import styled from 'styled-components'
import { MoreVerticalIcon } from '../icons/MoreVerticalIcon'

const Container = styled.aside`
  position: fixed;
  top: 12px;
  left: 12px;
  bottom: 12px;
  width: 240px;
  padding: 8px 0;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 13px;
  color: #2a2a2a;

  &:hover {
    background: #f3f3f3;
  }
`

const Label = styled.button`
  flex: 1;
  padding: 5px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
`

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 6px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: #6b6b6b;
  cursor: pointer;
  opacity: 0;

  ${Item}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const items = ['Inbox', 'Today', 'Upcoming', 'Projects', 'Notes', 'Archive']

export function Sidebar() {
  return (
    <Container>
      {items.map((label) => (
        <Item key={label}>
          <Label>{label}</Label>
          <MoreButton aria-label={`More options for ${label}`}>
            <MoreVerticalIcon />
          </MoreButton>
        </Item>
      ))}
    </Container>
  )
}
