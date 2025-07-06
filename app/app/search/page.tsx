'use client'

import NavBar from '../components/NavBar'
import SplitPane from './components/SplitPane'
import HistoryList from './components/HistoryList'
import AbstractCard from './components/AbstractCard'
import SourcesList from "@/app/search/components/SourcesList";
import ConceptsMenu from "@/app/search/components/ConceptsMenu";
import GraphModal from "@/app/search/components/GraphModal";
import {useEffect, useRef, useState} from "react";
import {placeholderConcept, placeholderConceptGraph} from '../fakes'
import {Concept, ConceptGraph} from "@/app/search/types";

interface Defaults {
    complexity: string
}

interface State {
    activeConcept: Concept | null
    conceptGraph: ConceptGraph | null
    historyList: Concept[]
}

export default function SearchPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const modalRef = useRef<HTMLDialogElement>(null);
    const [state, setState] = useState<State>({
        activeConcept: placeholderConcept,
        conceptGraph: placeholderConceptGraph,
        historyList: [],
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedResult = sessionStorage.getItem('searchResult');
            if (storedResult) {
                try {
                    const result = JSON.parse(storedResult);
                    console.log('Setting state with result:', result);
                    setState({
                        activeConcept: result.Concept,
                        conceptGraph: result.ConceptGraph,
                        historyList: result.History,
                    });
                } catch (error) {
                    console.error('Failed to parse search result:', error);
                }
            }
        };

        window.addEventListener('searchResultUpdated', handleStorageChange);

        // Check for initial value immediately
        handleStorageChange();

        return () => {
            window.removeEventListener('searchResultUpdated', handleStorageChange);
            window.removeEventListener('activeConceptUpdated', handleStorageChange);
        };
    }, []);

    const defaults: Defaults = {
        complexity: "2"
    }

    const abstractMap = state.activeConcept?.Abstracts ? Object.fromEntries(
        state.activeConcept.Abstracts.map(abstract => [abstract.Complexity, abstract])
    ) : {}
    
    const activeConceptIndex = state.conceptGraph?.Nodes.findIndex(node => node.Id === state.activeConcept?.Id) ?? -1
    const relatedConcepts = state.conceptGraph?.AdjList[activeConceptIndex] || []
    const activeConceptSources = state.activeConcept?.Abstracts?.flatMap(abstract => 
        abstract.Claims.map(claim => claim.Source)
    ) || []

    return (
        <main className="h-screen w-screen">
            <NavBar
                // onSidebarToggle={toggleSidebar}
                // showSidebar={!isSidebarOpen}
                showSideBarToggle={true}
            />
            <div className="h-[calc(100vh-4rem)] p-4">
                <SplitPane
                    historyPanel={<HistoryList history={state.historyList}/>}
                    abstractPanel={<AbstractCard 
                        conceptName={state.activeConcept?.Name ?? ''} 
                        modalRef={modalRef as React.RefObject<HTMLDialogElement>}
                        defaultComplexity={defaults.complexity}
                        abstractMap={abstractMap}
                    />}
                    sourcesPanel={<SourcesList sources={activeConceptSources}/>}
                    relatedConceptsPanel={<ConceptsMenu 
                        concept={state.activeConcept ?? placeholderConcept} 
                        relatedConcepts={relatedConcepts}
                    />}
                />
            </div>
            {<GraphModal
                modalRef={modalRef as React.RefObject<HTMLDialogElement>}
                conceptGraph={state.conceptGraph ?? placeholderConceptGraph}
            />}
        </main>
    )
}
