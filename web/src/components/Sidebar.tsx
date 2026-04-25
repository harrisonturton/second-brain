import styled from 'styled-components'
import { MoreVerticalIcon } from '../icons/MoreVerticalIcon'

const Container = styled.aside`
  position: fixed;
  top: 6px;
  left: 6px;
  bottom: 6px;
  width: 240px;
  padding: 10px 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 7px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const SectionLabel = styled.div`
  padding: 4px 6px 2px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  color: #2a2a2a;
  opacity: 0.45;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 13px;
  color: #2a2a2a;
  border-radius: 4px;

  &:hover {
    background: #f3f3f3;
  }
`

const Label = styled.button`
  flex: 1;
  padding: 4px 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  line-height: 1.3;
`

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 4px;
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
    width: 14px;
    height: 14px;
  }
`

const items = ['Inbox', 'Today', 'Upcoming', 'Projects', 'Notes', 'Archive']

export function Sidebar() {
  return (
    <Container>
      <SectionLabel>Sessions</SectionLabel>
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
