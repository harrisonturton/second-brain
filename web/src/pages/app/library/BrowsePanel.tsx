import styled, { keyframes } from 'styled-components'
import type { LibraryDocument } from '@/services/library/LibraryService'

const Frame = styled.div<{ $sidebarCollapsed: boolean; $topInset: number }>`
  position: fixed;
  top: ${({ $topInset }) => `${$topInset}px`};
  left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '44px' : '268px')};
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
  transition:
    left 260ms cubic-bezier(0.32, 0.72, 0, 1),
    top 260ms cubic-bezier(0.32, 0.72, 0, 1);
`

const Header = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 18px 24px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.divider};
`

const Title = styled.h1`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.005em;
`

const Count = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`

const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: ${({ theme }) => theme.textBody};
`

const Th = styled.th<{ $align?: 'left' | 'right' }>`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.panelBg};
  text-align: ${({ $align }) => $align ?? 'left'};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 10px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.divider};
  white-space: nowrap;
`

const Td = styled.td<{ $align?: 'left' | 'right'; $muted?: boolean }>`
  padding: 10px 16px;
  text-align: ${({ $align }) => $align ?? 'left'};
  color: ${({ $muted, theme }) =>
    $muted ? theme.textSecondary : theme.textBody};
  border-bottom: 1px solid ${({ theme }) => theme.divider};
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleCell = styled(Td)`
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 500;
  max-width: 360px;
`

const Row = styled.tr`
  cursor: default;
  transition: background 120ms ease;

  &:hover {
    background: ${({ theme }) => theme.subtleHoverBg};
  }
`

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`

const SkeletonCell = styled.div`
  height: 14px;
  border-radius: 4px;
  background: ${({ theme }) => theme.subtleHoverBg};
  animation: ${shimmer} 1.2s ease-in-out infinite;
`

const Empty = styled.div`
  padding: 48px 24px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export type BrowsePanelProps = {
  documents: LibraryDocument[]
  loading: boolean
  sidebarCollapsed: boolean
  topInset: number
}

export function BrowsePanel({
  documents,
  loading,
  sidebarCollapsed,
  topInset,
}: BrowsePanelProps) {
  const showSkeleton = loading && documents.length === 0
  const showEmpty = !loading && documents.length === 0

  return (
    <Frame $sidebarCollapsed={sidebarCollapsed} $topInset={topInset}>
      <Header>
        <Title>Browse</Title>
        {!showSkeleton && !showEmpty && (
          <Count>
            {documents.length} document{documents.length === 1 ? '' : 's'}
          </Count>
        )}
      </Header>
      <Scroll>
        {showEmpty ? (
          <Empty>No documents yet.</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Source</Th>
                <Th $align="right">Published</Th>
                <Th $align="right">Added</Th>
              </tr>
            </thead>
            <tbody>
              {showSkeleton
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <Td>
                        <SkeletonCell style={{ width: '60%' }} />
                      </Td>
                      <Td>
                        <SkeletonCell style={{ width: '40%' }} />
                      </Td>
                      <Td>
                        <SkeletonCell style={{ width: '50%' }} />
                      </Td>
                      <Td $align="right">
                        <SkeletonCell style={{ width: 80, marginLeft: 'auto' }} />
                      </Td>
                      <Td $align="right">
                        <SkeletonCell style={{ width: 80, marginLeft: 'auto' }} />
                      </Td>
                    </tr>
                  ))
                : documents.map((doc) => (
                    <Row key={doc.id}>
                      <TitleCell title={doc.title}>{doc.title}</TitleCell>
                      <Td title={doc.author}>{doc.author}</Td>
                      <Td $muted title={doc.source}>
                        {doc.source}
                      </Td>
                      <Td $align="right" $muted>
                        {formatDate(doc.publishedDate)}
                      </Td>
                      <Td $align="right" $muted>
                        {formatDate(doc.addedDate)}
                      </Td>
                    </Row>
                  ))}
            </tbody>
          </Table>
        )}
      </Scroll>
    </Frame>
  )
}
