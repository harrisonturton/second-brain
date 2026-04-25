# web/CLAUDE.md

Conventions for the `web/` Vite + React + Electron renderer. Read this before adding code here.

## Workflow

- **Commit changes as you go.** When you finish a coherent unit of work (a feature, a refactor pass, a bug fix), stage the relevant files and create a focused commit before moving on. Don't accumulate a session's worth of unrelated changes into one giant commit.
- Match the existing commit-message style: lowercase, imperative, no trailing period, single line for routine work.

## Stack

- Vite + React 19 + TypeScript (strict).
- **MobX 6** with **legacy decorators** (`@observable`, `@action`, `@computed`) and `makeObservable(this)` in the constructor. The TS config has `experimentalDecorators` / `useDefineForClassFields: false` so this is the supported flavour — do not switch to `makeAutoObservable` or stage-3 decorators.
- **mobx-react-lite**. Subscriptions happen at the install layer through inline `<Observer>` blocks (see Architecture). Avoid wrapping leaf views with `observer` — they should stay stateless.
- **styled-components** with **transient props** (`$active`, `$collapsed`, …). Always prefix variant props with `$` so they don't leak to the DOM.
- **@dnd-kit** for the tab drag-and-drop. The hooks (`useSortable`, `useSensors`) are part of its public API — keep them at the use site.

## Architecture: views, stores, presenters, services, install

The app uses a strict separation between **rendering**, **state**, **behaviour**, and **data fetching** so each layer can be unit-tested independently. Wiring happens in **install** files (pages and `App.tsx`).

### The four roles

| Role | Lives in | Responsibility | Allowed to import |
|---|---|---|---|
| **Component** (stateless) | `*.tsx` next to its store/presenter | Render UI. Props in, JSX out. No `useRootStore`, no `observer`, no service calls. Plain name (`ActivityBar`, `Sidebar`, `ChatFrame`). The stateful, store-bound version is created inline in the page install and conventionally named `*View` locally — that's the only place the `View` suffix appears. | styled-components, icons, types from sibling store |
| **Store** | `*Store.ts` next to its presenter | Hold observable state — **everything the views read**. No services, no orchestration, no React. Just `@observable` fields and one-line `@action` setters. The shape of the store is the shape of what the view consumes; the presenter is responsible for keeping the right values in those fields. | mobx, types from services (for typed fields) |
| **Presenter** | `*Presenter.ts` next to its store | Behaviour + business logic. Takes its store(s) and any services in the constructor. Exposes **only action methods** — no state getters, no derived `@computed`. Views never read from a presenter. The presenter writes results into the store, and the view reads the store. No React. | mobx (`action`), the store, service interfaces |
| **Service** | `services/<feature>/` | Backend data fetching. **Interface** + **fake impl** today (real impls land later). All services accept an `HttpService` so the fake can simulate latency to exercise loading states. | http types only |

### The install layer

A "stateful component" is just a function that **instantiates the stores + presenters + services it needs and wires them to stateless views**. These are the install files:

- **`App.tsx`** — installs the global theme + window providers around `<HomePage />`.
- **`main.tsx`** — composition root. Instantiates `FakeHttpService` + every `Fake*Service` and provides them through `<ServicesProvider>`. Instantiates `RootStore` and provides it through `<RootStoreProvider>`. Swap fakes for real impls here.
- **`pages/<page>/index.tsx`** — the page install. Built using the `makePage` factory from `@/base/page/Page`, default-exported so callers `import HomePage from '@/pages/home'`. The setup function passed to `makePage` runs once on mount with `(initialProps, { rootStore, services })`, instantiates page-local stores + presenters, kicks off initial loads, wraps each `*View` in `observer(() => <View ... />)` to bind it (state from the store, actions from the presenter), and returns a root component (typically rendering a `<PageView>` that takes the bound subcomponents as props).

The setup function runs once and stores live for the lifetime of the page mount — no `useMemo` / `useEffect` ceremony. Each `observer(() => ...)` wrapper is its own MobX subscription, so re-renders stay scoped to the data each binding reads. **Do not** wrap views themselves with `observer` — keep them stateless and bind them in the setup function.

Example shape:

```tsx
// pages/home/index.tsx
export default makePage((_, { rootStore, services }) => {
  const navStore = new NavigationStore()
  const navPresenter = new NavigationPresenter(navStore, services.sessionService, services.libraryService)
  void navPresenter.loadSidebarItems()

  // State comes from the store; actions come from the presenter.
  // The local `*View` name is the stateful, store-bound version of `Sidebar`.
  const SidebarView = observer(() => (
    <Sidebar
      collapsed={navStore.sidebarCollapsed}
      items={navStore.sidebarItems}
      loading={navStore.sidebarLoading}
      onToggleSidebar={navPresenter.toggleSidebar}
    />
  ))

  return () => <HomePage Sidebar={SidebarView} />
})
```

### Stores hold state, not behaviour

- A store has only observables + setters. If you find yourself adding a method that calls a service or composes multiple setters, that logic belongs in a presenter.
- The store fields should mirror what the view actually consumes. If the sidebar shows one list of items, there's one `sidebarItems` field — not one per source-of-truth (e.g. `sessionCategories` + `libraryCategories`). The presenter decides which source fills the field based on the active mode.
- Do not put services on stores. Services flow through the presenter constructor.
- `RootStore` is a tiny container of **truly global** stores (`themeStore`, `windowStore`). It does NOT hold page-local stores (e.g. `NavigationStore`, `TabsStore`) — those live inside their page and are owned by the page install.
- If a store has no presenter (`ThemeStore`, `WindowStore`), it can still expose a one-line action method like `toggle()`. The bar for "needs a presenter" is real orchestration logic, not symmetry.

### Presenters are testable behaviour

- Constructor takes `(store, ...services)`. Tests hand it a fake store and a fake service.
- Methods that mutate multiple store fields are wrapped with `action(...)` from MobX so the change is one transaction.
- Async loaders set a loading flag on the store, fetch, set the data on the store, and unset the loading flag in `finally`. **The view reads both off the store, never off the presenter.**
- For loaders that can race (e.g. rapid section switches refetching the same field), use a monotonic load token to discard stale results — see `NavigationPresenter.loadSidebarItems`.
- A presenter that contains essentially zero logic (just passthrough getters and one-line wrappers) is a smell — drop the presenter and let the install file call the store/service directly.

### Services have interfaces and fakes

- Each service is `interface FooService` + `class FakeFooService implements FooService`. The interface goes next to the fake.
- All `Fake*Service` constructors accept the `HttpService` interface and call `http.request(...)` once per method. The fake then returns its own dummy data; the response from the fake HTTP service is discarded. Today: `FakeHttpService` only sleeps for `delayMs` — change `delayMs` in `main.tsx` to test slower / faster loads.
- When a real backend lands, write a `RealFooService implements FooService` next to the fake and swap it in `main.tsx`. No other code changes.
- Services are provided through `<ServicesProvider>` (separate from `<RootStoreProvider>` because services are not stores).

### How a feature is laid out

```
src/pages/<page>/<feature>/
  <Feature>Store.ts        observable state, setters
  <Feature>Presenter.ts    constructor(store, ...services); load/select/etc.
  <View>.tsx               stateless component(s) for this feature
```

Components without a presenter (purely visual / form-only) can live in `src/base/components/`. Anything tied to a feature lives with that feature.

## File layout

```
web/
  electron/                          Electron main + preload (compiled to dist-desktop/)
    main.ts
    preload.ts
  src/
    App.tsx                          install: global providers
    main.tsx                         composition root: services + RootStore
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
      window/
        WindowStore.ts               isDesktop / isFullScreen / topInset; subscribes to electronAPI
    pages/
      home/
        index.tsx                    page install (makePage); default-exported so callers `import HomePage from '@/pages/home'`
        HomePage.tsx                 stateless layout that takes ActivityBar / Sidebar / ChatFrame as props
        navigation/                  activity bar + sidebar feature
          NavigationStore.ts
          NavigationPresenter.ts
          ActivityBar.tsx            stateless
          Sidebar.tsx                stateless (loading-aware)
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
        profile/
          ProfileStore.ts
          ProfilePresenter.ts
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
    stores/
      RootStore.ts                   global stores (themeStore, windowStore) + useRootStore
  vite.config.ts                     `@/*` alias → ./src/*; base="./" in app-desktop mode
  tsconfig.app.json                  paths: { "@/*": ["./src/*"] }
  tsconfig.electron.json             main-process compile (outDir: dist-desktop)
  eslint.config.js                   ignores dist + dist-desktop; node globals for electron/
```

### Path alias convention

`@/` maps to `src/`. Use it for any cross-folder import. Same-folder imports stay relative (`./SiblingFile`). Don't write `../../../../...` chains — switch to `@/`.

## Styling

- One styled-component per visual element, named after its role (`Strip`, `Container`, `IconButton`), declared **above** the React component that uses it.
- Variants flow through transient props: `` styled.button<{ $active: boolean }>` ... ` ``.
- Tokens come from the theme (`${({ theme }) => theme.panelBg}`), not from inline hex values. Layout constants (pixel sizes) live in `src/base/theme/platformLayout.ts`.
- Don't read `themeMode` to branch on light/dark inside views. Read tokens off `theme`. The one exception is choosing the right *icon* (sun vs moon) for the toggle — that's a content decision, not a styling one.

## Desktop / Electron integration

- The Electron main process and preload live in `web/electron/` and compile to `dist-desktop/` via `tsconfig.electron.json`. `package.json#main` points at `dist-desktop/main.js`.
- `src/electronApi.ts` is the single source of truth for the `window.electronAPI` shape exposed by `electron/preload.ts` through `contextBridge`. **Keep these in sync** — if you change one, change the other.
- The preload is compiled as ESM (matching the rest of the package). Electron only loads ESM preload scripts when `webPreferences.sandbox: false`, so that flag is set in `main.ts`. Don't re-enable the sandbox without also moving the preload to CommonJS — otherwise `window.electronAPI` silently fails to expose and `isDesktop` becomes `false`. Renderer isolation still holds via `contextIsolation: true` + `nodeIntegration: false`.
- The renderer detects desktop mode by **the presence of `window.electronAPI`**, not by Vite mode. The `app-desktop` Vite mode only flips the asset base path (`./` for `file://` loading).
- `WindowStore` owns `isDesktop`, `isDesktopFullScreen`, and the `topInset` computed. It subscribes to `onWindowStateChange` from preload directly in its constructor — no React effect needed.
- The window-state contract is intentionally narrow: only **fullscreen** is tracked, because that's the one transition that hides the macOS traffic lights and lets the panels claim the full vertical space. Don't track maximize/zoom — on macOS those keep traffic lights visible, so the topInset and title-bar logic is the same as for the normal state.
- The Electron main process emits state on `enter-full-screen` and `leave-full-screen`, plus a 120 ms re-emit per event to catch the end of macOS fullscreen animations (querying `isFullScreen()` mid-animation can be stale). **Do not add polling fallbacks**; if a transition is genuinely missed, find the right main-process event instead.

## Build modes

- `npm run dev` / `npm run dev:app-web` — web dev server in browser.
- `npm run dev:app-desktop` — concurrently runs the renderer dev server, the main-process TypeScript watcher, and the electron launcher (gated on `wait-on` for both targets).
- `npm run build:app-web` — web production build into `dist/`.
- `npm run build:app-desktop` — renderer + main builds, then `electron-builder` packages the Mac DMG/zip.
