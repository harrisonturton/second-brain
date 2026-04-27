import { Fragment } from 'react'
import styled from 'styled-components'
import { ArrowsInIcon } from '@/base/icons/ArrowsInIcon'
import { ArrowsOutIcon } from '@/base/icons/ArrowsOutIcon'
import { ChevronRightIcon } from '@/base/icons/ChevronRightIcon'
import { withAlpha } from '@/base/theme/themes'

const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
`

const Bar = styled.div<{ $leftIndent: number }>`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  padding-left: ${({ $leftIndent }) => `${5 + $leftIndent}px`};
  background: ${({ theme }) => theme.panelBg};
  pointer-events: auto;
  -webkit-app-region: drag;
  transition: padding-left 200ms ease;
`

const Spacer = styled.span`
  flex: 1;
`

const ExpandButton = styled.button`
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
    color: ${({ theme }) => theme.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const Fade = styled.div`
  height: 32px;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.panelBg} 0%,
    ${({ theme }) => withAlpha(theme.panelBg, 0.6)} 50%,
    ${({ theme }) => withAlpha(theme.panelBg, 0)} 100%
  );
`

const Pill = styled.button<{ $current: boolean }>`
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textPrimary};
  cursor: ${({ $current }) => ($current ? 'default' : 'pointer')};
  white-space: nowrap;
  opacity: ${({ $current }) => ($current ? 1 : 0.65)};
  transition: background 120ms ease, opacity 120ms ease;

  &:hover {
    background: ${({ $current, theme }) =>
      $current ? 'transparent' : theme.subtleHoverBg};
    opacity: 1;
  }
`

const Separator = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textTertiary};

  svg {
    width: 12px;
    height: 12px;
  }
`

export type BreadcrumbCrumb = {
  id: string
  label: string
  onClick?: () => void
}

export type BreadcrumbBarProps = {
  crumbs: BreadcrumbCrumb[]
  expanded: boolean
  /** Extra left padding to clear the macOS traffic-light buttons when
   *  the panel is flush against the window edge. Caller passes 0 when
   *  no indent is needed (web, fullscreen, or non-expanded). */
  leftIndent: number
  onToggleExpanded: () => void
}

export function BreadcrumbBar({
  crumbs,
  expanded,
  leftIndent,
  onToggleExpanded,
}: BreadcrumbBarProps) {
  const lastIndex = crumbs.length - 1
  return (
    <Wrap>
      <Bar $leftIndent={leftIndent}>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.id}>
            <Pill
              type="button"
              $current={i === lastIndex}
              onClick={crumb.onClick}
              disabled={!crumb.onClick}
            >
              {crumb.label}
            </Pill>
            {i < lastIndex && (
              <Separator aria-hidden="true">
                <ChevronRightIcon />
              </Separator>
            )}
          </Fragment>
        ))}
        <Spacer />
        <ExpandButton
          type="button"
          onClick={onToggleExpanded}
          aria-label={expanded ? 'Exit focus mode' : 'Enter focus mode'}
          title={expanded ? 'Exit focus mode' : 'Enter focus mode'}
        >
          {expanded ? <ArrowsInIcon /> : <ArrowsOutIcon />}
        </ExpandButton>
      </Bar>
      <Fade />
    </Wrap>
  )
}
