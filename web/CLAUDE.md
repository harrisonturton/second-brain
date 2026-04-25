# web/CLAUDE.md

Conventions for the `web/` Vite + React + Electron renderer. Read this before adding code here.

## Stack

- Vite + React 19 + TypeScript (strict).
- **MobX 6** with **legacy decorators** (`@observable`, `@action`, `@computed`) and `makeObservable(this)` in the constructor. The TS config has `experimentalDecorators` / `useDefineForClassFields: false` so this is the supported flavour — do not switch to `makeAutoObservable` or stage-3 decorators.
- **mobx-react-lite**. Wrap components with `observer(function ComponentName() { ... })` — the named function form, not anonymous, so the component shows up properly in React DevTools.
- **styled-components** with **transient props** (`$active`, `$collapsed`, …). Always prefix variant props with `$` so they don't leak to the DOM.
- **@dnd-kit** for the tab drag-and-drop. The hooks (`useSortable`, `useSensors`) are part of its public API — keep them at the use site, don't try to mirror that state into MobX.

## State management

- All shared and cross-component state lives in `src/stores/RootStore.ts`. Components reach it through `useRootStore()`.
- **Don't prop-drill store-derived values.** If a component is already an `observer` calling `useRootStore()`, read what it needs directly. Only pass props for genuinely component-local data (e.g. dnd-kit's per-row `tab` / `active`).
- **Derived values are `@computed` getters on the store**, not helper functions called from the component (e.g. `store.topInset`, not `getTopInset(isDesktop, isMaximized)`).
- `useState` / `useEffect` are reserved for **purely local UI state** that no other component needs to read. The current legitimate uses are:
  - `TableOfContents` — `IntersectionObserver` lifetime tied to the component.
  - `Composer` — uncontrolled-ish text input value.
  - `TabBar` / `SortableTab` — dnd-kit hooks (`useSensors`, `useSortable`).

  If two components would both want to read the same piece of state, it goes in the store.

## Styling

- One styled-component per visual element, named after its role (`Strip`, `Container`, `IconButton`), declared **above** the React component that uses it.
- Variants flow through transient props: `` styled.button<{ $active: boolean }>` ... ` ``.
- Layout/theme tokens live in `src/theme/` (e.g. `platformLayout.ts`). Don't sprinkle pixel constants across components.

## Desktop / Electron integration

- The Electron main process and preload live in `web/electron/` and compile to `dist-desktop/` via `tsconfig.electron.json`. `package.json#main` points at `dist-desktop/main.js`.
- `src/electronApi.ts` is the single source of truth for the `window.electronAPI` shape exposed by `electron/preload.ts` through `contextBridge`. **Keep these in sync** — if you change one, change the other.
- The preload is compiled as ESM (matching the rest of the package). Electron only loads ESM preload scripts when `webPreferences.sandbox: false`, so that flag is set in `main.ts`. Don't re-enable the sandbox without also moving the preload to CommonJS — otherwise `window.electronAPI` silently fails to expose and `isDesktop` becomes `false`. Renderer isolation still holds via `contextIsolation: true` + `nodeIntegration: false`.
- The renderer detects desktop mode by **the presence of `window.electronAPI`**, not by Vite mode. The `app-desktop` Vite mode only flips the asset base path (`./` for `file://` loading).
- `RootStore` owns `isDesktop`, `isDesktopFullScreen`, and the `topInset` computed. The store subscribes to `onWindowStateChange` from preload directly in its constructor — there's no separate `init()` method to remember to call, and **no React effect**.
- The window-state contract is intentionally narrow: only **fullscreen** is tracked, because that's the one transition that hides the macOS traffic lights and lets the panels claim the full vertical space. Don't track maximize/zoom — on macOS those keep traffic lights visible, so the topInset and title-bar logic is the same as for the normal state.
- The Electron main process emits state on `enter-full-screen` and `leave-full-screen`, plus a 120 ms re-emit per event to catch the end of macOS fullscreen animations (querying `isFullScreen()` mid-animation can be stale). **Do not add polling fallbacks**; if a transition is genuinely missed, find the right main-process event instead.

## File layout

```
web/
  electron/                  Electron main + preload (compiled to dist-desktop/)
    main.ts
    preload.ts
  src/
    components/              styled-components + observer components
    icons/                   SVG-as-React-component icons
    stores/RootStore.ts      MobX store + RootStoreProvider/useRootStore
    theme/                   layout/design tokens
    electronApi.ts           window.electronAPI typing & accessor
    App.tsx
    main.tsx
  vite.config.ts             base="./" only in app-desktop mode
  tsconfig.electron.json     main-process compile (outDir: dist-desktop)
  eslint.config.js           ignores dist + dist-desktop; node globals for electron/
```

## Build modes

- `npm run dev` / `npm run dev:app-web` — web dev server in browser.
- `npm run dev:app-desktop` — concurrently runs the renderer dev server, the main-process TypeScript watcher, and the electron launcher (gated on `wait-on` for both targets).
- `npm run build:app-web` — web production build into `dist/`.
- `npm run build:app-desktop` — renderer + main builds, then `electron-builder` packages the Mac DMG/zip.
