'use client';

import {AppTextarea} from "@/components/app-textarea";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import {Slider} from "@/components/ui/slider";
import { AppConceptsCard } from '@/components/app-concepts-card';
import {AppSourcesCard} from "@/components/app-sources-card";

    const markdown = `# Welcome to Second Brain

## Getting Started

This is a **powerful** knowledge management system that helps you organize your thoughts and ideas.

### Key Features

- **Smart Search**: Find information quickly across your knowledge base
- **Concept Extraction**: Automatically identify and link related concepts
- **Reference Management**: Keep track of your sources and citations
- **Interactive Interface**: Modern, responsive design for all devices

### Quick Tips

1. Use the search bar to find existing content
2. Create new entries with the text area below
3. Explore the concept graph to see connections
4. Organize your thoughts with tags and categories

> **Pro Tip**: The more you use this system, the better it becomes at understanding your knowledge structure.

\`\`\`javascript
// Example of how to structure your thoughts
const thought = {
  title: "My Idea",
  content: "Detailed explanation here",
  concepts: ["AI", "Productivity", "Learning"],
  references: ["source1", "source2"]
};
\`\`\`

---

## Getting Started

This is a **powerful** knowledge management system that helps you organize your thoughts and ideas.

### Key Features

- **Smart Search**: Find information quickly across your knowledge base
- **Concept Extraction**: Automatically identify and link related concepts
- **Reference Management**: Keep track of your sources and citations
- **Interactive Interface**: Modern, responsive design for all devices

### Quick Tips

1. Use the search bar to find existing content
2. Create new entries with the text area below
3. Explore the concept graph to see connections
4. Organize your thoughts with tags and categories

> **Pro Tip**: The more you use this system, the better it becomes at understanding your knowledge structure.

\`\`\`javascript
// Example of how to structure your thoughts
const thought = {
  title: "My Idea",
  content: "Detailed explanation here",
  concepts: ["AI", "Productivity", "Learning"],
  references: ["source1", "source2"]
};
\`\`\`

---

*Ready to start building your second brain? Begin typing below!*`;
export default function ChatPage() {
    const [streamedContent, setStreamedContent] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const streamRef = useRef<NodeJS.Timeout | null>(null);

    const startStreaming = () => {
        if (isStreaming) return;
        
        setIsStreaming(true);
        setStreamedContent('');
        
        let currentIndex = 0;
        const streamSpeed = 5; // milliseconds per character
        
        const streamNext = () => {
            if (currentIndex < markdown.length) {
                setStreamedContent(markdown.slice(0, currentIndex + 1));
                currentIndex++;
                streamRef.current = setTimeout(streamNext, streamSpeed);
            } else {
                setIsStreaming(false);
            }
        };
        
        streamNext();
    };

    // Auto-start streaming when component mounts
    useEffect(() => {
        startStreaming();
        
        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                clearTimeout(streamRef.current);
            }
        };
    }, []);

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center">
            <div className="w-3/4 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-4">
                        <Markdown>{streamedContent}</Markdown>
                    </div>
                    {/* <Slider defaultValue={[33]} max={100} step={100}/> */}
                </div>
                <div className="mt-auto">
                    <AppTextarea/>
                </div>
            </div>
            <div>
                <AppConceptsCard/>
                <AppSourcesCard/>
            </div>
        </div>
    );
}
