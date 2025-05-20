'use client'
import {
    Panel,
    PanelGroup,
    PanelResizeHandle
} from 'react-resizable-panels'

interface SplitPaneProps {
    historyPanel: React.ReactNode
    abstractPanel: React.ReactNode
    sourcesPanel: React.ReactNode
    relatedConceptsPanel: React.ReactNode
}

export default function SplitPane({
    historyPanel,
    abstractPanel,
    sourcesPanel,
    relatedConceptsPanel
}: SplitPaneProps) {
    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30} minSize={20}>
                {historyPanel}
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={40} minSize={20}>
                <PanelGroup direction="vertical">
                    <Panel maxSize={80}>
                        {abstractPanel}
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel maxSize={80}>
                        {sourcesPanel}
                    </Panel>
                </PanelGroup>
            </Panel>
            <PanelResizeHandle/>
            <Panel defaultSize={30} minSize={20}>
                {relatedConceptsPanel}
            </Panel>
        </PanelGroup>
    )
}