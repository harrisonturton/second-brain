import { Fragment } from 'react'
import styled from 'styled-components'
import { ChevronRightIcon } from '@/base/icons/ChevronRightIcon'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-top: 1px solid ${({ theme }) => theme.panelBorder};
`

const Pill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  background: ${({ $active, theme }) =>
    $active ? theme.subtleHoverBg : 'transparent'};
  border: none;
  border-radius: 4px;
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  white-space: nowrap;
  opacity: ${({ $active }) => ($active ? 1 : 0.65)};
  transition: background 120ms ease, opacity 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
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
  if (crumbs.length === 0) return <Bar />
  const lastIndex = crumbs.length - 1
  return (
    <Bar>
      {crumbs.map((crumb, i) => (
        <Fragment key={crumb.id}>
          <Pill
            type="button"
            $active={i === lastIndex}
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
  )
}
