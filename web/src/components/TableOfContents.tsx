import { useEffect, useState } from 'react'
import styled from 'styled-components'

export interface TocEntry {
  id: string
  label: string
  level?: 1 | 2
}

interface Props {
  entries: TocEntry[]
}

const Aside = styled.aside`
  flex-shrink: 0;
  width: 180px;
  padding: 32px 12px 24px 20px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const Item = styled.li``

const Bar = styled.span<{ $level: 1 | 2 }>`
  flex-shrink: 0;
  width: ${({ $level }) => ($level === 2 ? '26px' : '14px')};
  height: 1px;
  background: #d8d8d8;
  transition: background 120ms ease;
`

const LinkLabel = styled.span`
  flex-shrink: 0;
`

const TocLink = styled.a<{ $active: boolean; $level: 1 | 2 }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  font-size: ${({ $level }) => ($level === 2 ? '12px' : '13px')};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? '#2a2a2a' : '#888')};
  text-decoration: none;
  line-height: 1.4;
  transition: color 120ms ease;

  &:hover {
    color: #2a2a2a;
  }

  &:hover ${Bar} {
    background: #888;
  }
`

export function TableOfContents({ entries }: Props) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    entries.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [entries])

  return (
    <Aside>
      <List>
        {entries.map(({ id, label, level = 1 }) => (
          <Item key={id}>
            <TocLink
              href={`#${id}`}
              $active={activeId === id}
              $level={level}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Bar $level={level} />
              <LinkLabel>{label}</LinkLabel>
            </TocLink>
          </Item>
        ))}
      </List>
    </Aside>
  )
}
