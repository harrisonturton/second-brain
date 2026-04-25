import { observer } from 'mobx-react-lite'
import { ChatFrame } from './components/ChatFrame'
import { Sidebar } from './components/Sidebar'
import { useRootStore } from './stores/RootStore'

const App = observer(function App() {
  useRootStore()

  return (
    <>
      <Sidebar />
      <ChatFrame />
    </>
  )
})

export default App
