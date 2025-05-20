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
                    setState({
                        activeConcept: result.concept,
                        conceptGraph: result.conceptGraph,
                        historyList: result.history,
                    });
                } catch (error) {
                    console.error('Failed to parse search result:', error);
                }
            }
        };

        window.addEventListener('searchResultUpdated', handleStorageChange);
        window.addEventListener('activeConceptUpdated', handleStorageChange);

        // Check for initial value immediately
        handleStorageChange();

        return () => {
            window.removeEventListener('searchResultUpdated', handleStorageChange);
            window.removeEventListener('activeConceptUpdated', handleStorageChange);
        };
    }, []);

    const defaults: Defaults = {
        complexity: "medium"
    }

    const abstractMap = Object.fromEntries(
        state.activeConcept.abstracts.map(abstract => [abstract.complexity, abstract])
    )
    const activeConceptIndex = state.conceptGraph.nodes.findIndex(node => node.id === state.activeConcept.id)
    const relatedConcepts = state.conceptGraph.adjList[activeConceptIndex] || []
    const activeConceptSources = state.activeConcept?.abstracts.flatMap(abstract => 
        abstract.claims.map(claim => claim.source)
    ) || []

    return (
        <main className="h-screen w-screen">
            <NavBar/>
            <div className="h-[calc(100vh-4rem)] p-4">
                <SplitPane
                    historyPanel={<HistoryList history={state.historyList}/>}
                    abstractPanel={<AbstractCard conceptName={state.activeConcept.name} modalRef={modalRef}
                                                 defaultComplexity={defaults.complexity}
                                                 abstractMap={abstractMap}/>}
                    sourcesPanel={<SourcesList sources={activeConceptSources}/>}
                    relatedConceptsPanel={<ConceptsMenu concept={state.activeConcept} relatedConcepts={relatedConcepts}/>}
                />
            </div>
            <GraphModal 
                modalRef={modalRef as React.RefObject<HTMLDialogElement>} 
                conceptGraph={state.conceptGraph || placeholderConceptGraph}
            />
        </main>
    )
}
