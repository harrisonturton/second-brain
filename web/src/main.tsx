import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootPage from '@/pages/root'
import { FakeHttpService } from '@/services/http/FakeHttpService'
import { FakeLibraryService } from '@/services/library/FakeLibraryService'
import { FakeMinionsService } from '@/services/minions/FakeMinionsService'
import { FakeProfileService } from '@/services/profile/FakeProfileService'
import { FakeSearchService } from '@/services/search/FakeSearchService'
import { FakeSessionService } from '@/services/session/FakeSessionService'
import { ServicesProvider, type Services } from '@/services/ServicesContext'

// Single composition root: build the service graph once and pass it
// through context. Swap fakes for real implementations here when the
// backend lands.
const httpService = new FakeHttpService(300)
const services: Services = {
  httpService,
  sessionService: new FakeSessionService(httpService),
  profileService: new FakeProfileService(httpService),
  libraryService: new FakeLibraryService(httpService),
  minionsService: new FakeMinionsService(httpService),
  searchService: new FakeSearchService(httpService),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServicesProvider value={services}>
      <RootPage />
    </ServicesProvider>
  </StrictMode>,
)
