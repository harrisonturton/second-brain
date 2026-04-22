'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {AppTextarea} from "@/components/app-textarea";
import { AppConceptsCard } from '@/components/app-concepts-card';
import {AppSourcesCard} from "@/components/app-sources-card";
import { Separator } from '@radix-ui/react-separator';

export default function Home() {
    const router = useRouter();

    const handleSubmit = (query: string) => {
        const sessionId = sessionStorage.getItem("sessionId") || "new";
        router.push(`/chat/${sessionId}/${encodeURIComponent(query)}`);
    };

    return (
        <div className="h-screen overflow-hidden">
            <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance">
                Where should we begin?
            </h1>
            <div className="h-1/4">
                <AppTextarea onSubmit={handleSubmit}/>
            </div>
        </div>
    );
}

