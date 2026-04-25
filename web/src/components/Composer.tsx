import { useState, type FormEvent, type KeyboardEvent } from 'react'
import styled from 'styled-components'
import { ArrowUpIcon } from '../icons/ArrowUpIcon'

const Bar = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 24px 14px;
  background: ${({ theme }) =>
    `linear-gradient(to bottom, ${theme.panelBgFade}, ${theme.panelBg} 40%)`};
`

const Field = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  color: ${({ theme }) => theme.textPrimary};
  padding: 4px 0;
  min-height: 22px;
  max-height: 240px;
  overflow-y: auto;

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const Box = styled.form`
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.panelShadow};
  transition: border-color 120ms ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.textTertiary};
  }
`

const SendButton = styled.button`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.accentBg};
  color: ${({ theme }) => theme.accentFg};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accentBgHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.accentBgDisabled};
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

export function Composer() {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    setValue('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <Bar>
      <Box onSubmit={handleSubmit}>
        <Field
          placeholder="Ask anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <SendButton type="submit" disabled={!value.trim()} aria-label="Send">
          <ArrowUpIcon />
        </SendButton>
      </Box>
    </Bar>
  )
}
