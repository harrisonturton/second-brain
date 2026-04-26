import { Fragment } from 'react'
import styled from 'styled-components'
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

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  background: ${({ theme }) => theme.panelBg};
  pointer-events: auto;
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
}

export function BreadcrumbBar({ crumbs }: BreadcrumbBarProps) {
  const lastIndex = crumbs.length - 1
  return (
    <Wrap>
      <Bar>
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
      </Bar>
      <Fade />
    </Wrap>
  )
}
