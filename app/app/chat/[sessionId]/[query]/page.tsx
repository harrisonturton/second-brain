'use client';

import {AppTextarea} from "@/components/app-textarea";
import React, { useEffect, useRef, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import Markdown from "react-markdown";
import { AppConceptsCard } from '@/components/app-concepts-card';
import {AppSourcesCard} from "@/components/app-sources-card";
import {Concept, ConceptGraph} from "@/app/search/types";
import GraphModal from "@/app/search/components/GraphModal";
import {placeholderConceptGraph} from "@/app/fakes";
import {search} from "@/app/api/endpoints/search";

interface State {
    activeConcept: Concept | null;
    conceptGraph: ConceptGraph | null;
    historyList: Concept[];
}

function conceptToMarkdown(concept: Concept | null): string {
    if (!concept) return '';
    const sections: string[] = [`(Title) ${concept.Name}`];
    if (concept.Description) sections.push(`*(description) ${concept.Description}*`);
    const abstract = concept.Abstracts?.find(a => a.Complexity === "3");
    if (abstract) {
        for (const claim of abstract.Claims ?? []) {
            sections.push(`- ${claim.Body}`);
        }
    }
    return sections.join('\n\n');
}

type Status = 'loading' | 'ready' | 'error';

export default function ChatPage() {
    const params = useParams<{ sessionId: string; query: string }>();
    const router = useRouter();
    const query = decodeURIComponent(params.query);
    const urlSessionId = params.sessionId === "new" ? "" : params.sessionId;

    const [status, setStatus] = useState<Status>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [streamedContent, setStreamedContent] = useState('');
    const [state, setState] = useState<State>({
        activeConcept: null,
        conceptGraph: null,
        historyList: [],
    });
    const streamRef = useRef<NodeJS.Timeout | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const openGraph = () => modalRef.current?.showModal();

    const startStreaming = (text: string) => {
        if (streamRef.current) {
            clearTimeout(streamRef.current);
            streamRef.current = null;
        }
        setStreamedContent('');

        let currentIndex = 0;
        const streamSpeed = 5;

        const streamNext = () => {
            if (currentIndex < text.length) {
                setStreamedContent(text.slice(0, currentIndex + 1));
                currentIndex++;
                streamRef.current = setTimeout(streamNext, streamSpeed);
            }
        };
        streamNext();
    };

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        setErrorMessage(null);
        setStreamedContent('');

        (async () => {
            try {
                const result = await search(query, urlSessionId);
                if (cancelled) return;
                sessionStorage.setItem('sessionId', result.SessionId);
                sessionStorage.setItem('historyList', JSON.stringify(result.History ?? []));
                window.dispatchEvent(new Event('sessionHistoryUpdated'));
                setState({
                    activeConcept: result.Concept,
                    conceptGraph: result.ConceptGraph,
                    historyList: result.History ?? [],
                });
                setStatus('ready');
                startStreaming(conceptToMarkdown(result.Concept));
                if (params.sessionId !== result.SessionId) {
                    router.replace(`/chat/${result.SessionId}/${encodeURIComponent(query)}`);
                }
            } catch (error) {
                if (cancelled) return;
                console.error('Search failed:', error);
                setStatus('error');
                setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
            }
        })();

        return () => {
            cancelled = true;
            if (streamRef.current) {
                clearTimeout(streamRef.current);
                streamRef.current = null;
            }
        };
    }, [params.sessionId, params.query]);

    const handleFollowUp = (newQuery: string) => {
        const sid = sessionStorage.getItem('sessionId') || params.sessionId || 'new';
        router.push(`/chat/${sid}/${encodeURIComponent(newQuery)}`);
    };

    const handleConceptClick = (concept: Concept) => {
        handleFollowUp(concept.Name);
    };

    const activeConceptIndex = state.conceptGraph?.Nodes.findIndex(node => node.Id === state.activeConcept?.Id) ?? -1;
    const relatedConcepts = activeConceptIndex >= 0
        ? (state.conceptGraph?.AdjList[activeConceptIndex] ?? [])
        : [];
    const activeConceptSources = state.activeConcept?.Abstracts?.flatMap(abstract =>
        abstract.Claims.map(claim => claim.Source)
    ) ?? [];

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-3xl px-4 mx-auto pt-8 pb-16">
                <div className="space-y-4">
                    {status === 'loading' && (
                        <div className="text-muted-foreground">Searching for &ldquo;{query}&rdquo;&hellip;</div>
                    )}
                    {status === 'error' && (
                        <div className="text-destructive">
                            Search failed{errorMessage ? `: ${errorMessage}` : ''}.
                        </div>
                    )}
                    {status === 'ready' && <Markdown>{streamedContent}</Markdown>}
                </div>
            </div>

            {/* Top-right overlay: ConceptsCard + SourcesCard (wide screens) */}
            <div className="hidden 2xl:flex fixed top-8 right-8 w-118 flex-col gap-4 z-50">
                <div className="bg-background rounded-3xl shadow-[var(--widget-shadow)]">
                    <AppConceptsCard relatedConcepts={relatedConcepts} onGraphClick={openGraph} onConceptClick={handleConceptClick}/>
                </div>
                <div className="bg-background rounded-3xl shadow-[var(--widget-shadow)]">
                    <AppSourcesCard sources={activeConceptSources}/>
                </div>
            </div>

            {/* Bottom-center sticky: ConceptsCard + SourcesCard (narrow) + Textarea */}
            <div className="sticky bottom-8 max-w-3xl px-4 mx-auto z-50 flex flex-col gap-4">
                <div className="2xl:hidden bg-background rounded-3xl shadow-[var(--widget-shadow)]">
                    <AppConceptsCard relatedConcepts={relatedConcepts} onGraphClick={openGraph} onConceptClick={handleConceptClick}/>
                </div>
                <div className="2xl:hidden bg-background rounded-3xl shadow-[var(--widget-shadow)]">
                    <AppSourcesCard sources={activeConceptSources}/>
                </div>
                <div className="bg-background rounded-3xl shadow-[var(--widget-shadow)]">
                    <AppTextarea onSubmit={handleFollowUp}/>
                </div>
            </div>
            <GraphModal
                modalRef={modalRef as React.RefObject<HTMLDialogElement>}
                conceptGraph={state.conceptGraph ?? placeholderConceptGraph}
            />
        </div>
    );
}
