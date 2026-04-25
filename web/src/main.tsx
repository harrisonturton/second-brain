import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RootStore, RootStoreProvider } from './stores/RootStore'

const rootStore = new RootStore()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootStoreProvider value={rootStore}>
      <App />
    </RootStoreProvider>
  </StrictMode>,
)
