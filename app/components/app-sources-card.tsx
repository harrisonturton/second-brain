import React from "react";
import { Separator } from "@radix-ui/react-separator";
import {Card, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "@/components/ui/button";
import {ArrowDownToLine, VectorSquare} from "lucide-react";
import {Source} from "@/app/search/types";

interface AppSourcesCardProps {
    sources?: Source[];
}

export function AppSourcesCard({ sources = [] }: AppSourcesCardProps = {}) {
    return (
        <div className="border-input rounded-3xl border bg-transparent p-4 max-h-[40vh] overflow-y-auto">
            <div className="flex justify-end">
                <Button variant="secondary" size="icon" className="size-8">
                    <ArrowDownToLine />
                </Button>
            </div>
            {sources.map((source, i) => {
                const isTransparent = i > 2;
                let marginClass: string;
                if (i < 3) marginClass = "mt-4";
                else if (i === 3) marginClass = "mt-4 mb-2";
                else marginClass = "mt-2 mb-2";
                return (
                    <React.Fragment key={`${source.Link}-${i}`}>
                        {isTransparent && i > 3 && <Separator className="bg-gray-500 h-px"/>}
                        <a
                            href={source.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Card
                                className={`cursor-pointer ${isTransparent
                                    ? "bg-transparent border-none shadow-none"
                                    : "bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                                } ${marginClass}`}
                            >
                                <CardHeader>
                                    <CardTitle className="break-all">{source.Link}</CardTitle>
                                    <CardDescription className="break-all">{source.Link}</CardDescription>
                                </CardHeader>
                            </Card>
                        </a>
                    </React.Fragment>
                );
            })}
        </div>
    )
}