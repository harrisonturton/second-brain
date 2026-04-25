import { useState, type ChangeEvent } from 'react'
import styled from 'styled-components'

const Heading = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`

const FieldLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
`

const FieldHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`

const TextInput = styled.input`
  width: 200px;
  padding: 6px 10px;
  font: inherit;
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 6px;
  outline: none;
  transition: border-color 120ms ease;

  &:focus {
    border-color: ${({ theme }) => theme.textTertiary};
  }
`

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
`

export type DeveloperSettingsProps = {
  developerMode: boolean
  fakeNetworkDelayMs: number
  onDeveloperModeChange: (value: boolean) => void
  onFakeNetworkDelayChange: (ms: number) => void
}

export function DeveloperSettings(props: DeveloperSettingsProps) {
  const {
    developerMode,
    fakeNetworkDelayMs,
    onDeveloperModeChange,
    onFakeNetworkDelayChange,
  } = props

  // Track the input as a string locally so the user can type freely
  // (e.g. clear the field) without the parent rejecting non-numbers.
  const [delayDraft, setDelayDraft] = useState(String(fakeNetworkDelayMs))

  const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDelayDraft(e.target.value)
    const parsed = Number(e.target.value)
    if (Number.isFinite(parsed) && parsed >= 0) {
      onFakeNetworkDelayChange(Math.round(parsed))
    }
  }

  return (
    <>
      <Heading>Developer settings</Heading>
      <Toggle>
        <input
          type="checkbox"
          checked={developerMode}
          onChange={(e) => onDeveloperModeChange(e.target.checked)}
        />
        Developer mode
      </Toggle>
      <Field>
        <FieldLabel>Fake network delay</FieldLabel>
        <FieldHint>
          Milliseconds the fake HTTP service waits before resolving — useful
          for exercising loading states. Applied when developer mode is on.
        </FieldHint>
        <TextInput
          type="number"
          inputMode="numeric"
          min={0}
          step={50}
          value={delayDraft}
          onChange={handleDelayChange}
        />
      </Field>
    </>
  )
}
