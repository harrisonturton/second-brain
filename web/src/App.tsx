import styled from 'styled-components'

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

function App() {
  return (
    <Page>
      <Title>second brain</Title>
    </Page>
  )
}

export default App
