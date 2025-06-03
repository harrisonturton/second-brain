'use client'

import React, {useRef, useState} from 'react'
import {Abstract} from "@/app/search/types";

interface AbstractCardProps {
    modalRef: React.RefObject<HTMLDialogElement>
    conceptName: string
    defaultComplexity: string
    abstractMap: Record<string, Abstract> // complexity -> abstract
}

export default function AbstractCard({modalRef, conceptName, defaultComplexity, abstractMap}: AbstractCardProps) {
    const [selectedComplexity, setSelectedComplexity] = useState(defaultComplexity);
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const abstract = abstractMap[selectedComplexity];

    const handleComplexitySelect = (newComplexity: string) => {
        setSelectedComplexity(newComplexity);
        detailsRef.current?.removeAttribute('open');
    };

    return (
        <div className="card bg-base-100 w-full h-full shadow-sm flex flex-col">
            <div className="card-body flex-1 overflow-y-auto">
                <h2 className="card-title">{conceptName}</h2>
                {abstract && abstract.Claims ? (
                    abstract.Claims.map((claim, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <p className="m-0 flex-1">{claim.Body}</p>
                            <a href={claim.Source.Link} target="_blank" rel="noopener noreferrer" className="link link-primary shrink-0">[{i}]</a>
                        </div>
                    ))
                ) : (
                    <p className="text-sm opacity-60">No abstract available for this complexity level</p>
                )}
            </div>
            <div className="flex justify-end gap-2 p-4 shrink-0">
                <button className="btn btn-square btn-ghost" onClick={() => modalRef.current?.showModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                </button>
                <details ref={detailsRef} className="dropdown dropdown-top dropdown-end">
                    <summary className="btn m-1">{selectedComplexity}</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[50] w-52 p-2 shadow-sm">
                        <li><a onClick={() => handleComplexitySelect('0')}>0</a></li>
                        <li><a onClick={() => handleComplexitySelect('1')}>1</a></li>
                        <li><a onClick={() => handleComplexitySelect('2')}>2</a></li>
                        <li><a onClick={() => handleComplexitySelect('3')}>3</a></li>
                        <li><a onClick={() => handleComplexitySelect('4')}>4</a></li>
                    </ul>
                </details>
            </div>
        </div>
    )
}