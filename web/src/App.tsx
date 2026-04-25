import { observer } from 'mobx-react-lite'
import { ChatFrame } from './components/ChatFrame'
import { IconStrip } from './components/IconStrip'
import { Sidebar } from './components/Sidebar'
import { useRootStore } from './stores/RootStore'

const App = observer(function App() {
  useRootStore()

  return (
    <>
      <IconStrip />
      <Sidebar />
      <ChatFrame />
    </>
  )
})

export default App
