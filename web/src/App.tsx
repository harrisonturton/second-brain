import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useRootStore } from './stores/RootStore'

const Page = styled.main`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 500;
`

const App = observer(function App() {
  useRootStore()

  return (
    <Page>
      <Title>second brain</Title>
    </Page>
  )
})

export default App
