import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import type { LoginProvider } from '@/base/session/SessionPresenter'
import { LoginShader } from './LoginShader'

const Backdrop = styled.div<{ $topInset: number }>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: top 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 360px;
  padding: 32px;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.panelShadow};
`

const Title = styled.h1`
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`

const Subtitle = styled.p`
  margin: 0 0 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`

const TextInput = styled.input`
  padding: 8px 10px;
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

const PrimaryButton = styled.button`
  margin-top: 4px;
  padding: 9px 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.accentFg};
  background: ${({ theme }) => theme.accentBg};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accentBgHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.accentBgDisabled};
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.divider};
  }
`

const ProviderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ProviderButton = styled.button`
  padding: 9px 14px;
  font: inherit;
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 6px;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.subtleHoverBg};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const ErrorMessage = styled.p`
  margin: 12px 0 0;
  font-size: 12px;
  color: #c9433f;
`

export type LoginPanelProps = {
  topInset: number
  submitting: boolean
  errorMessage: string | null
  onSubmit: (email: string, password: string) => void
  onLoginWithProvider: (provider: LoginProvider) => void
}

const PROVIDERS: { id: LoginProvider; label: string }[] = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
  { id: 'sso', label: 'Continue with SSO' },
]

export function LoginPanel({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onLoginWithProvider,
}: LoginPanelProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <Backdrop $topInset={topInset}>
      <LoginShader />
      <Card>
        <Title>Welcome back</Title>
        <Subtitle>Sign in to continue.</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <TextInput
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>
        </Form>
        <Divider>or</Divider>
        <ProviderRow>
          {PROVIDERS.map(({ id, label }) => (
            <ProviderButton
              key={id}
              type="button"
              disabled={submitting}
              onClick={() => onLoginWithProvider(id)}
            >
              {label}
            </ProviderButton>
          ))}
        </ProviderRow>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Card>
    </Backdrop>
  )
}
