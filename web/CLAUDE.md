# web/CLAUDE.md

Onboarding + conventions for the `web/` Vite + React + Electron renderer. **Read this top-to-bottom before writing code.** The architecture is opinionated and the pattern is consistent across the codebase — fitting in saves you from rewrites.

The repo's parent `CLAUDE.md` describes the Go backend + Postgres + LLM engine. This file is only about the renderer.

## What this app is

The renderer for a "second brain" knowledge tool. There are two top-level pages today:

- **`/login`** — the sign-in screen (email + password + Google / Apple / SSO buttons). Auth is currently fake: any non-empty credentials accepted; the user profile is hydrated from `ProfileService` after a successful login.
- **`/`** — the main app. An activity bar (left edge), a sidebar that swaps content based on the active section (sessions / library / settings), tabs at the top of the chat frame, and a chat area with table of contents + composer. There's also a settings subpage (rendered in place of the chat frame when the cog is selected) for things like dev-mode toggles, plus a user settings panel with a logout button.

The visible page is driven by `SessionStore.status`, not directly by the URL — the URL is pushed on login/logout for bookmark-ability but the renderer keys off the session.

Today the backend isn't wired in: services are fake implementations that sleep for `FakeHttpService.delayMs` and return hardcoded data. Loading states in the UI are real and exercise the same code paths the eventual real services will.

The app ships as both a web dev build and a packaged Electron desktop app (Mac DMG/zip). macOS is the primary target — the title bar handling is tuned for traffic lights specifically.

## Get running

```bash
cd web
npm install
npm run dev                 # web dev server (Vite) → localhost:5173
npm run dev:app-desktop     # Electron + Vite + main-process TS watcher (concurrent)
```

Verify before committing:

```bash
npx tsc -b                  # renderer + electron typecheck (silent on success)
npx tsc -p tsconfig.electron.json --noEmit   # explicit electron-only typecheck if you touched electron/
npx eslint .                # silent on success
```

Both must be silent. Don't commit code that breaks either.

`npm run build:app-web` produces `dist/`. `npm run build:app-desktop` produces `dist/` + `dist-desktop/` and runs `electron-builder` for a Mac package.

## Workflow

- **Commit changes as you go.** When you finish a coherent unit of work (a feature, a refactor pass, a bug fix), stage the relevant files and create a focused commit before moving on. Don't accumulate a session's worth of unrelated changes into one giant commit.
- Match the existing commit-message style: lowercase, imperative, no trailing period, single line for routine work. A commit-msg hook may rewrite your message to a more accurate summary — that's expected.
- Stage specific paths (`git add web/src/foo`), not `git add -A`, when you can — protects against accidentally including unrelated junk.

## Stack

- Vite + React 19 + TypeScript (strict).
- **MobX 6** with **legacy decorators** (`@observable`, `@action`, `@computed`) and `makeObservable(this)` in the constructor. The TS config has `experimentalDecorators` / `useDefineForClassFields: false` so this is the supported flavour — do not switch to `makeAutoObservable` or stage-3 decorators.
- **mobx-react-lite**. Subscriptions happen at the install layer through inline `observer(() => ...)` wrappers (see Architecture). Never wrap stateless components with `observer` — they should stay pure.
- **styled-components** with **transient props** (`$active`, `$collapsed`, …). Always prefix variant props with `$` so they don't leak to the DOM. Theme tokens come from `ThemeProvider` context, not from props.
- **@dnd-kit** for the tab drag-and-drop. The hooks (`useSortable`, `useSensors`) are part of its public API — keep them at the use site.
- **Electron 39** for the desktop build. ESM preload, with `sandbox: false` (see Desktop section).

## Architecture: the four roles + install layer

The app uses a strict separation between **rendering**, **state**, **behaviour**, and **data fetching** so each layer can be unit-tested independently. Wiring happens in **install** files (pages, `main.tsx`).

### The four roles

| Role | Lives in | Responsibility | Allowed to import |
|---|---|---|---|
| **Component** (stateless view) | `*.tsx` next to its store/presenter, or `base/components/` if generic | Render UI. Props in, JSX out. No `useRootStore`, no `observer`, no service calls. Plain name (`ActivityBar`, `Sidebar`, `ChatFrame`). The stateful, store-bound version is created inline in the page install and conventionally named `*View` locally — that's the only place the `View` suffix appears. | styled-components, icons, types from sibling store |
| **Store** | `*Store.ts` next to its presenter | Hold observable state — **everything the views read**. No services, no orchestration, no React. Just `@observable` fields and one-line `@action` setters. The shape of the store is the shape of what the view consumes; the presenter is responsible for keeping the right values in those fields. | mobx, types from services (for typed fields) |
| **Presenter** | `*Presenter.ts` next to its store | Behaviour + business logic. Takes its store(s) and any services in the constructor. Exposes **only action methods** — no state getters, no derived `@computed`. Views never read from a presenter. The presenter writes results into the store, and the view reads the store. No React. | mobx (`action`), the store, service interfaces |
| **Service** | `services/<feature>/` | Backend data fetching. **Interface** + **fake impl** today (real impls land later). All services accept an `HttpService` so the fake can simulate latency to exercise loading states. | http types only |

### The install layer

A "stateful component" is a function that **instantiates the stores + presenters + services it needs and wires them to stateless views**. These are the install files:

- **`main.tsx`** — composition root. Builds the service graph (`FakeHttpService` + every `Fake*Service`) once and provides them through `<ServicesProvider>`. Renders `<RootPage />`. Swap fakes for real impls here.
- **`pages/root/index.tsx`** — the root page (`makePage`). Owns the truly-global UI stores (`ThemeStore`, `WindowStore`, `SessionStore`) + the global session presenter, and the global styling concerns (`<ThemeProvider>`, `createGlobalStyle` for body bg, the macOS title-bar overlay). Routes between subpages by reading `sessionStore.status` (logged-out → `LoginPage`, logged-in → `AppPage`) and passes the global stores + session presenter down as props. There is **no `RootStore`** — `pages/root` is the mechanism that makes the global stores reachable from each page.
- **`pages/<page>/index.tsx`** — a subpage install (`makePage`), default-exported so callers `import HomePage from '@/pages/home'`. The setup function runs once on mount with `(initialProps, { services })`, instantiates page-local stores + presenters, kicks off initial loads, wraps each stateless component in `observer(() => <Component ... />)` to bind it (state from the store, actions from the presenter), and returns a root component (typically rendering a stateless layout that takes the bound subcomponents as props). Subpages receive the global stores (theme, window) through `initialProps`, **not** through context.

The setup function runs once and stores live for the lifetime of the page mount — no `useMemo` / `useEffect` ceremony. Each `observer(() => ...)` wrapper is its own MobX subscription, so re-renders stay scoped to the data each binding reads.

#### `makePage` shape

```ts
export function makePage<P>(setup: (initialProps: P, ctx: { services: Services }) => FunctionComponent): FunctionComponent<P>
```

Inside `setup` you cannot call React hooks (it runs inside a `useState` lazy initializer). Pull what you need from `ctx` or from `initialProps`. The component you return is rendered without forwarded props — capture the props you need at setup time.

#### Canonical example to read

[pages/home/index.tsx](src/pages/home/index.tsx) is the canonical install. It instantiates 4 stores + 4 presenters, kicks off 3 initial loads, defines 6 inline `*View` bindings, and composes them into a `<HomePage>` layout. Read it before adding a new page or feature.

### Stores hold state, not behaviour

- A store has only `@observable` fields and one-line `@action` setters. If you find yourself adding a method that calls a service or composes multiple setters, that logic belongs in a presenter.
- The store fields should mirror what the view actually consumes. If the sidebar shows one list of items, there's one `sidebarItems` field — not one per source-of-truth (e.g. `sessionCategories` + `libraryCategories`). The presenter decides which source fills the field based on the active mode. See [NavigationStore](src/pages/home/navigation/NavigationStore.ts) + [NavigationPresenter](src/pages/home/navigation/NavigationPresenter.ts).
- Do not put services on stores. Services flow through the presenter constructor.
- The truly-global UI stores (`ThemeStore`, `WindowStore`, `SessionStore`) are owned by `pages/root` and flow into subpages as props on the page install. There is no app-level store container.
- Page-local stores (`NavigationStore`, `TabsStore`, `ProfileStore`, `SettingsStore`) live inside their page's folder and are instantiated in the page's setup.
- If a store has no presenter (`ThemeStore`, `WindowStore`), it can still expose a one-line action method like `toggle()`. The bar for "needs a presenter" is real orchestration logic, not symmetry.

### Presenters are testable behaviour

- Constructor takes `(store, ...services)`. Tests hand it a fake store and a fake service.
- Methods that mutate multiple store fields are wrapped with `action(...)` from MobX so the change is one transaction.
- Async loaders set a loading flag on the store, fetch, set the data on the store, and unset the loading flag in `finally`. **The view reads both off the store, never off the presenter.**
- For loaders that can race (e.g. rapid section switches refetching the same field), use a monotonic load token to discard stale results — see [`NavigationPresenter.loadSidebarItems`](src/pages/home/navigation/NavigationPresenter.ts).
- A presenter that contains essentially zero logic (just passthrough getters and one-line wrappers) is a smell — drop the presenter and let the install file call the store/service directly. [ThemeStore](src/base/theme/ThemeStore.ts) is an example of a store with no presenter; the install just calls `themeStore.toggle()`.

### Services have interfaces and fakes

- Each service is `interface FooService` + `class FakeFooService implements FooService`. The interface goes next to the fake.
- All `Fake*Service` constructors accept the `HttpService` interface and call `http.request(...)` once per method. The fake then returns its own dummy data; the response from the fake HTTP service is discarded. Today: `FakeHttpService` only sleeps for `delayMs`.
- The default `delayMs` is configured in `main.tsx`. At runtime, the home page's [SettingsPresenter](src/pages/home/settings/SettingsPresenter.ts) can mutate `FakeHttpService.delayMs` (it `instanceof`-checks so a real impl no-ops). To exercise loading states, flip developer mode on in the settings subpage and bump the delay.
- When a real backend lands, write a `RealFooService implements FooService` next to the fake and swap it in `main.tsx`. No other code changes.
- Services are provided through `<ServicesProvider>` (separate from any store provider — services are not stores).

### How a feature is laid out

```
src/pages/<page>/<feature>/
  <Feature>Store.ts        observable state, setters
  <Feature>Presenter.ts    constructor(store, ...services); load/select/etc.
  <View>.tsx               stateless component(s) for this feature
```

Components without a presenter (purely visual / form-only) can live in `src/base/components/` if generic, or stay in their feature folder if specific. Anything tied to a feature lives with that feature.

## Recipes

### Add a stateless component

1. Create `<Foo>.tsx` in the feature folder (or `src/base/components/` if it's not feature-specific).
2. One styled-component per visual element above the function, named after the role (`Strip`, `Container`, `IconButton`).
3. Export `FooProps` type and `function Foo(props: FooProps)`.
4. Read theme tokens via `${({ theme }) => theme.x}` — never inline hex.
5. Variant props are transient: ``styled.button<{ $active: boolean }>` ... ` ``.
6. No `useRootStore`, no `observer`, no service calls. The install layer does the binding.

### Add a store + presenter

1. Decide the scope: page-local (lives in `pages/<page>/<feature>/`) or page-global (lives in `pages/root/...` if it's truly cross-page; otherwise add it as a page-local store).
2. `FooStore.ts` — `@observable` fields the view reads, `@action set*` setters. Use `makeObservable(this)` in the constructor.
3. `FooPresenter.ts` — `constructor(store, ...services)`. Add the action methods. Wrap multi-mutation methods in `action(...)`. For async loaders, set loading on the store, await the service, set data on the store, unset loading in `finally`. For racy loaders, use a monotonic `loadId`.
4. Wire them in the page's `index.tsx`: `new FooStore()` + `new FooPresenter(store, services.bar)`. Kick off any initial load: `void fooPresenter.load()`. Bind a stateless view: `const FooView = observer(() => <Foo data={fooStore.x} onAction={fooPresenter.act} />)`.

### Add a service

1. `src/services/<name>/<Name>Service.ts` — `interface NameService` + supporting types (`type Foo`, etc.). Pure types, no implementation.
2. `src/services/<name>/Fake<Name>Service.ts` — `class FakeNameService implements NameService`. Constructor takes `HttpService`. Each method: `await this.http.request({ method, path })` then `return [hardcoded dummy data]`.
3. Add to [Services type](src/services/ServicesContext.ts): `nameService: NameService`.
4. Instantiate in [main.tsx](src/main.tsx): `nameService: new FakeNameService(httpService)`.

### Add a new page (subpage of root)

1. Create `src/pages/<name>/index.tsx` and a stateless layout `<Name>Page.tsx`.
2. The install: `export default makePage<{ themeStore: ThemeStore; windowStore: WindowStore }>(({ themeStore, windowStore }, { services }) => { ... })`.
3. Subpage feature folders alongside (`<name>/<feature>/...`).
4. Add a route from [pages/root/index.tsx](src/pages/root/index.tsx) — today it just renders `HomePage`; if you add URL-based routing, do it there. Pass `themeStore` and `windowStore` as props.

### Add a sidebar section to the home page

1. Add the section id to [`WorkspaceSection`](src/pages/home/navigation/NavigationStore.ts).
2. Update [NavigationPresenter.fetchItemsFor](src/pages/home/navigation/NavigationPresenter.ts) to return the right items for the new section (from a service, or hardcoded).
3. Add the section to `sectionTitles` in [pages/home/index.tsx](src/pages/home/index.tsx).
4. Add an icon button in [ActivityBar](src/pages/home/navigation/ActivityBar.tsx). The settings cog is the model: it calls `onSelectSection('settings')` and reads `activeSection === 'settings'` for the active state.
5. If the section needs a different main content panel (like settings does), update the `MainView` switch in `pages/home/index.tsx`.

## Verifying changes

After any non-trivial change:

```bash
npx tsc -b && npx eslint .
```

Both must be silent. The TypeScript build is incremental — fast on subsequent runs.

If you touched `electron/`:

```bash
npx tsc -p tsconfig.electron.json --noEmit
```

There's no test suite yet. The architecture is set up so each layer (view / store / presenter / service) is independently testable, but tests haven't been added.

## Anti-patterns to avoid

- **Don't** wrap stateless components with `observer`. Subscriptions belong at the install layer (`observer(() => <Foo ... />)` inline).
- **Don't** put state on a presenter. State goes on the store; presenters are action-only.
- **Don't** read from a presenter in a view. Views read state from the store, get callbacks from the presenter — both flow through props.
- **Don't** add passthrough getters on a presenter (`get x() { return this.store.x }`). Read `store.x` directly from the install.
- **Don't** put services on stores. Services flow through the presenter constructor.
- **Don't** call hooks inside a `makePage` setup. Setup runs in a `useState` lazy initializer; pull deps from `ctx` or `initialProps`.
- **Don't** branch on `themeMode` in views. Read tokens off `theme`. The one exception is icon choice (sun vs moon) which is content, not styling.
- **Don't** prop-drill components through layout slots when you could pass a single Component prop. The home page hands `<HomePage>` three Component slots (`ActivityBar`, `Sidebar`, `Main`), each pre-bound by an `observer` wrapper at the install layer.
- **Don't** add polling for window state. The Electron main process emits the events we care about; if you find a missed transition, fix the main-process emitter.
- **Don't** re-enable `webPreferences.sandbox`. The preload is ESM and ESM preloads only load with `sandbox: false`. Renderer isolation still holds via `contextIsolation: true` + `nodeIntegration: false`.
- **Don't** write `../../../../...` import chains. Use `@/` for cross-folder imports; same-folder imports stay relative.
- **Don't** rely on `import.meta.env.MODE` to detect desktop. Detect by `window.electronAPI` presence (see `WindowStore`).

## File layout

```
web/
  electron/                          Electron main + preload (compiled to dist-desktop/)
    main.ts                          BrowserWindow setup, IPC, sandbox: false for ESM preload
    preload.ts                       contextBridge.exposeInMainWorld('electronAPI', ...)
  src/
    main.tsx                         composition root: services + <RootPage/>
    electronApi.ts                   window.electronAPI typing & accessor
    base/                            cross-cutting / non-feature code
      icons/                         SVG-as-React-component icons
      page/
        Page.ts                      makePage factory used by every page install
      theme/
        ThemeStore.ts                @observable mode, toggle, theme computed
        themes.ts                    Theme type + lightTheme / darkTheme tokens
        styled.d.ts                  styled-components DefaultTheme augmentation
        platformLayout.ts            pixel constants (title bar height, top inset)
      session/
        SessionStore.ts              status (logged-out / logging-in / logged-in), profile, loginError
        SessionPresenter.ts          login / loginWithProvider / logout; hydrates profile via ProfileService
      window/
        WindowStore.ts               isDesktop / isFullScreen / topInset; subscribes to electronAPI
    pages/
      root/
        index.tsx                    root page (makePage); owns ThemeStore + WindowStore + SessionStore; routes between LoginPage and AppPage by sessionStore.status
      login/
        index.tsx                    login page (makePage); calls SessionPresenter
        LoginPanel.tsx               stateless email/password form + provider buttons
      app/
        index.tsx                    app page install (makePage); default-exported so callers `import AppPage from '@/pages/app'`
        AppPage.tsx                  stateless layout that takes ActivityBar / Sidebar / Main as props
        navigation/                  activity bar + sidebar feature
          NavigationStore.ts
          NavigationPresenter.ts
          ActivityBar.tsx            stateless
          Sidebar.tsx                stateless (loading-aware, selected-item-aware)
        tabs/                        tab strip feature
          TabsStore.ts
          TabsPresenter.ts
          TabBar.tsx                 stateless
          SortableTab.tsx            stateless (dnd-kit hooks at the use site)
        chat/                        chat surface (frame + composer + TOC + content)
          ChatFrame.tsx              stateless layout; takes tabBar slot
          Composer.tsx               local form state only
          TableOfContents.tsx        local IntersectionObserver state only
          ExampleContent.tsx         static
        settings/                    settings subpage (rendered when activeSection === 'settings')
          SettingsStore.ts           developer-mode flag + fake network delay
          SettingsPresenter.ts       writes settings into runtime services (e.g. FakeHttpService.delayMs)
          SettingsPanel.tsx          stateless settings panel (sidebar-item-driven content)
          UserSettings.tsx           stateless user-settings panel (logout button)
          DeveloperSettings.tsx      stateless developer-settings form
    services/                        backend boundary
      ServicesContext.ts             Services type + Provider + useServices
      http/
        HttpService.ts               interface
        FakeHttpService.ts           sleep delayMs and resolve
      session/
        SessionService.ts            interface + types
        FakeSessionService.ts        hardcoded dummy data + http.request for delay
      profile/
        ProfileService.ts
        FakeProfileService.ts
      library/
        LibraryService.ts
        FakeLibraryService.ts
  vite.config.ts                     `@/*` alias → ./src/*; base="./" in app-desktop mode
  tsconfig.app.json                  paths: { "@/*": ["./src/*"] }
  tsconfig.electron.json             main-process compile (outDir: dist-desktop)
  eslint.config.js                   ignores dist + dist-desktop; node globals for electron/
```

### Path alias convention

`@/` maps to `src/`. Use it for any cross-folder import. Same-folder imports stay relative (`./SiblingFile`). Don't write `../../../../...` chains — switch to `@/`.

### Read these first when joining

| To learn… | Read |
|---|---|
| The full install pattern | [src/pages/app/index.tsx](src/pages/app/index.tsx) |
| Stupid store with single source of truth | [NavigationStore.ts](src/pages/app/navigation/NavigationStore.ts) |
| Presenter with services + race-safe loader | [NavigationPresenter.ts](src/pages/app/navigation/NavigationPresenter.ts) |
| Presenter that mutates a service at runtime | [SettingsPresenter.ts](src/pages/app/settings/SettingsPresenter.ts) |
| Global presenter (auth) with URL side effects | [SessionPresenter.ts](src/base/session/SessionPresenter.ts) |
| Stateless view with loading state | [Sidebar.tsx](src/pages/app/navigation/Sidebar.tsx) |
| Stateless view + slot pattern | [ChatFrame.tsx](src/pages/app/chat/ChatFrame.tsx) |
| The makePage factory | [base/page/Page.ts](src/base/page/Page.ts) |
| How global stores are owned/passed + routing | [pages/root/index.tsx](src/pages/root/index.tsx) |
| A simple subpage install | [pages/login/index.tsx](src/pages/login/index.tsx) |
| Service interface + fake | [SessionService.ts](src/services/session/SessionService.ts) + [FakeSessionService.ts](src/services/session/FakeSessionService.ts) |
| Composition root | [main.tsx](src/main.tsx) |

## Styling + theming

- One styled-component per visual element, named after its role (`Strip`, `Container`, `IconButton`), declared **above** the React component that uses it.
- Variants flow through transient props: ``styled.button<{ $active: boolean }>` ... ` ``.
- Tokens come from the theme (`${({ theme }) => theme.panelBg}`), not from inline hex values. Layout constants (pixel sizes) live in [`src/base/theme/platformLayout.ts`](src/base/theme/platformLayout.ts).
- Don't read `themeMode` to branch on light/dark inside views. Read tokens off `theme`. The one exception is choosing the right *icon* (sun vs moon) for the toggle — that's a content decision, not a styling one.
- When you need a new colour, add it as a token in [`themes.ts`](src/base/theme/themes.ts) (with a value in both light and dark). Don't ad-hoc hex values inside a styled-component.
- Body bg + text colour are owned by the `createGlobalStyle` block in [`pages/root/index.tsx`](src/pages/root/index.tsx) so they react to theme changes automatically.

## Desktop / Electron integration

- The Electron main process and preload live in `web/electron/` and compile to `dist-desktop/` via `tsconfig.electron.json`. `package.json#main` points at `dist-desktop/main.js`.
- [`src/electronApi.ts`](src/electronApi.ts) is the single source of truth for the `window.electronAPI` shape exposed by `electron/preload.ts` through `contextBridge`. **Keep these in sync** — if you change one, change the other.
- The preload is compiled as ESM (matching the rest of the package). Electron only loads ESM preload scripts when `webPreferences.sandbox: false`, so that flag is set in `main.ts`. **Don't re-enable the sandbox** without also moving the preload to CommonJS — otherwise `window.electronAPI` silently fails to expose and `isDesktop` becomes `false`. Renderer isolation still holds via `contextIsolation: true` + `nodeIntegration: false`.
- The renderer detects desktop mode by **the presence of `window.electronAPI`**, not by Vite mode. The `app-desktop` Vite mode only flips the asset base path (`./` for `file://` loading).
- [`WindowStore`](src/base/window/WindowStore.ts) owns `isDesktop`, `isDesktopFullScreen`, and the `topInset` computed. It subscribes to `onWindowStateChange` from preload directly in its constructor — no React effect needed.
- The window-state contract is intentionally narrow: only **fullscreen** is tracked, because that's the one transition that hides the macOS traffic lights and lets the panels claim the full vertical space. Don't track maximize/zoom — on macOS those keep traffic lights visible, so the topInset and title-bar logic is the same as for the normal state.
- The Electron main process emits state on `enter-full-screen` and `leave-full-screen`, plus a 120 ms re-emit per event to catch the end of macOS fullscreen animations (querying `isFullScreen()` mid-animation can be stale). **Do not add polling fallbacks**; if a transition is genuinely missed, find the right main-process event instead.
- Hot-reload caveat: changes to `electron/main.ts` or `electron/preload.ts` require a full restart of `npm run dev:app-desktop`. Renderer changes hot-reload as normal.

## Build modes

- `npm run dev` / `npm run dev:app-web` — web dev server in browser.
- `npm run dev:app-desktop` — concurrently runs the renderer dev server, the main-process TypeScript watcher, and the electron launcher (gated on `wait-on` for both targets).
- `npm run build:app-web` — web production build into `dist/`.
- `npm run build:app-desktop` — renderer + main builds, then `electron-builder` packages the Mac DMG/zip.

## When in doubt

- The pattern is consistent across the codebase. If you're unsure how to add something, find the closest analog (e.g. you're adding a feature like the sidebar — copy the navigation feature's shape) and mirror it.
- If a refactor seems to require breaking the four-roles separation, that's usually a sign you're missing a presenter or a store field. Look at how [NavigationPresenter](src/pages/home/navigation/NavigationPresenter.ts) handles the section-switch + items-load orchestration without putting derived state on the presenter.
- If the user asks for a new page-level feature, the answer almost always involves: a new `*Store` for the state, a new `*Presenter` for the orchestration, and a new stateless component, all wired in the page's `index.tsx`.
