import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Sidebar } from './components/Sidebar'
import { useRootStore } from './stores/RootStore'

const Main = styled.main`
  margin-left: 252px;
  padding: 24px;
  min-height: 100svh;
`

const App = observer(function App() {
  useRootStore()

  return (
    <>
      <Sidebar />
      <Main>
        <h1>second brain</h1>
      </Main>
    </>
  )
})

export default App
