import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RootStore, RootStoreProvider } from '@/stores/RootStore'
import { FakeHttpService } from '@/services/http/FakeHttpService'
import { FakeLibraryService } from '@/services/library/FakeLibraryService'
import { FakeProfileService } from '@/services/profile/FakeProfileService'
import { FakeSessionService } from '@/services/session/FakeSessionService'
import { ServicesProvider, type Services } from '@/services/ServicesContext'

// Single composition root: instantiate the service graph once and pass
// it through context. Swap fakes for real implementations here when the
// backend lands.
const httpService = new FakeHttpService(300)
const services: Services = {
  sessionService: new FakeSessionService(httpService),
  profileService: new FakeProfileService(httpService),
  libraryService: new FakeLibraryService(httpService),
}

const rootStore = new RootStore()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootStoreProvider value={rootStore}>
      <ServicesProvider value={services}>
        <App />
      </ServicesProvider>
    </RootStoreProvider>
  </StrictMode>,
)
