'use client';

import React from 'react';
import {AppTextarea} from "@/components/app-textarea";
import { AppConceptsCard } from '@/components/app-concepts-card';
import {AppSourcesCard} from "@/components/app-sources-card";
import { Separator } from '@radix-ui/react-separator';

export default function Home() {
    return (
        <div className="h-screen overflow-hidden">
            <h1 className="scroll-m-20 text-center text-4xl tracking-tight text-balance">
                Where should we begin?
            </h1>
            <div className="h-1/4">
                <AppTextarea/>
            </div>
        </div>
    );
}

