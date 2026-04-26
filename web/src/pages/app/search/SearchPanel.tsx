import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'
import { SearchIcon } from '@/base/icons/SearchIcon'
import type { SearchResult } from '@/services/search/SearchService'

const Frame = styled.div<{
  $sidebarCollapsed: boolean
  $topInset: number
  $sidebarWidth: number
  $resizing: boolean
}>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: ${({ $sidebarCollapsed, $sidebarWidth }) =>
    $sidebarCollapsed ? '44px' : `${44 + $sidebarWidth + 4}px`};
  right: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 7px;
  box-shadow: ${({ theme }) => theme.panelShadow};
  overflow: hidden;
  will-change: left;
  transition: ${({ $resizing }) =>
    $resizing
      ? 'top 260ms cubic-bezier(0.32, 0.72, 0, 1)'
      : 'left 260ms cubic-bezier(0.32, 0.72, 0, 1), top 260ms cubic-bezier(0.32, 0.72, 0, 1)'};
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`

const Hero = styled.div<{ $compact: boolean }>`
  width: 100%;
  max-width: 640px;
  padding: ${({ $compact }) => ($compact ? '32px 24px 16px' : '120px 24px 32px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: padding 220ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Title = styled.h1<{ $hidden: boolean }>`
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  height: ${({ $hidden }) => ($hidden ? 0 : 'auto')};
  overflow: hidden;
  transition: opacity 180ms ease;
`

const Form = styled.form`
  width: 100%;
`

const InputWrap = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 48px;
  background: ${({ theme }) => theme.panelBg};
  border: 1px solid
    ${({ $focused, theme }) =>
      $focused ? theme.accentBg : theme.panelBorder};
  border-radius: 8px;
  box-shadow: ${({ $focused, theme }) =>
    $focused ? theme.panelShadow : 'none'};
  transition: border-color 120ms ease, box-shadow 120ms ease;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.textTertiary};
  }
`

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font: inherit;
  font-size: 15px;
  color: ${({ theme }) => theme.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const ResultsWrap = styled.div`
  width: 100%;
  max-width: 640px;
  padding: 8px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ResultCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 120ms ease;
  font: inherit;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
  }
`

const ResultTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`

const ResultSnippet = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textBody};
`

const ResultSource = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`

const Skeleton = styled.div`
  height: 64px;
  border-radius: 8px;
  background: ${({ theme }) => theme.subtleHoverBg};
  animation: ${shimmer} 1.2s ease-in-out infinite;
`

export type SearchPanelProps = {
  query: string
  results: SearchResult[]
  searching: boolean
  sidebarCollapsed: boolean
  topInset: number
  sidebarWidth: number
  resizing: boolean
  onQueryChange: (value: string) => void
  onSubmit: (query: string) => void
  breadcrumbBar: ReactNode
}

export function SearchPanel({
  query,
  results,
  searching,
  sidebarCollapsed,
  topInset,
  sidebarWidth,
  resizing,
  onQueryChange,
  onSubmit,
  breadcrumbBar,
}: SearchPanelProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasResults = results.length > 0 || searching
  const compact = hasResults

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(query)
  }

  return (
    <Frame
      $sidebarCollapsed={sidebarCollapsed}
      $topInset={topInset}
      $sidebarWidth={sidebarWidth}
      $resizing={resizing}
    >
      <Body>
        <Hero $compact={compact}>
          <Title $hidden={compact}>What do you want to find?</Title>
          <Form onSubmit={handleSubmit}>
            <InputWrap $focused={focused}>
              <SearchIcon />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search your second brain…"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
                spellCheck={false}
              />
            </InputWrap>
          </Form>
        </Hero>
        {hasResults && (
          <ResultsWrap>
            {searching && results.length === 0
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
              : results.map((r) => (
                  <ResultCard key={r.id} type="button">
                    <ResultSource>{r.source}</ResultSource>
                    <ResultTitle>{r.title}</ResultTitle>
                    <ResultSnippet>{r.snippet}</ResultSnippet>
                  </ResultCard>
                ))}
          </ResultsWrap>
        )}
      </Body>
      {breadcrumbBar}
    </Frame>
  )
}
