import { useState, type FormEvent, type KeyboardEvent } from 'react'
import styled from 'styled-components'
import { ArrowUpIcon } from '../icons/ArrowUpIcon'

const Bar = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 24px 20px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 40%);
`

const Box = styled.form`
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 10px 10px 14px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: border-color 120ms ease;

  &:focus-within {
    border-color: #bdbdbd;
  }
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
  color: #2a2a2a;
  padding: 6px 0;
  max-height: 200px;
  overflow-y: auto;

  &::placeholder {
    color: #b3b3b3;
  }
`

const SendButton = styled.button`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    background: #2f2f2f;
  }

  &:disabled {
    background: #dcdcdc;
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
