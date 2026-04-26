import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.45);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 18vh;
`

const Modal = styled.div`
  width: min(560px, calc(100vw - 32px));
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 10px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.22),
    0 6px 18px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  flex: none;
  height: 48px;
  padding: 0 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.panelBorder};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const Results = styled.div`
  max-height: 360px;
  overflow-y: auto;
  padding: 6px;
`

const Empty = styled.div`
  padding: 18px;
  text-align: center;
  color: ${({ theme }) => theme.textTertiary};
  font-size: 13px;
`

const Row = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  background: ${({ $active, theme }) =>
    $active ? theme.activeBg : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.activeFg : theme.textPrimary};
  cursor: pointer;
  font-size: 13px;
`

const Label = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Hint = styled.span`
  margin-left: 12px;
  font-size: 11px;
  color: ${({ theme }) => theme.textTertiary};
`

export type CommandAction = {
  id: string
  label: string
  /** Optional short hint shown in muted text on the right. */
  hint?: string
  run: () => void
}

export type CommandPaletteProps = {
  query: string
  actions: CommandAction[]
  onQueryChange: (value: string) => void
  onRun: (run: () => void) => void
  onClose: () => void
}

export function CommandPalette({
  query,
  actions,
  onQueryChange,
  onRun,
  onClose,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = useMemo(
    () =>
      actions.filter((a) =>
        a.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [actions, query],
  )

  const safeIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(Math.min(filtered.length - 1, safeIndex + 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(Math.max(0, safeIndex - 1))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const action = filtered[safeIndex]
      if (action) onRun(action.run)
    }
  }

  return (
    <Backdrop onMouseDown={onClose}>
      <Modal onMouseDown={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          value={query}
          placeholder="Type a command…"
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Results>
          {filtered.length === 0 ? (
            <Empty>No matching commands</Empty>
          ) : (
            filtered.map((action, i) => (
              <Row
                key={action.id}
                $active={i === safeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => onRun(action.run)}
              >
                <Label>{action.label}</Label>
                {action.hint && <Hint>{action.hint}</Hint>}
              </Row>
            ))
          )}
        </Results>
      </Modal>
    </Backdrop>
  )
}
