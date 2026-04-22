import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {VectorSquare} from "lucide-react";
import {Separator} from "@radix-ui/react-separator";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card";
import {Concept} from "@/app/search/types";

interface AppConceptsCardProps {
  relatedConcepts?: Concept[];
  onGraphClick?: () => void;
  onConceptClick?: (concept: Concept) => void;
}

export function AppConceptsCard({ relatedConcepts = [], onGraphClick, onConceptClick }: AppConceptsCardProps = {}) {
  return (
    <div className="border-input rounded-3xl border bg-transparent p-4 max-h-[40vh] overflow-y-auto">
        <div className="flex items-center gap-2">
            <Input type="search" placeholder="Search related concepts..." className="flex-1"/>
            <Button variant="secondary" size="icon" className="size-8" onClick={onGraphClick}>
                <VectorSquare />
            </Button>
        </div>
        {relatedConcepts.map((concept, i) => {
            const isTransparent = i > 2;
            let marginClass: string;
            if (i < 3) marginClass = "mt-4";
            else if (i === 3) marginClass = "mt-4 mb-2";
            else marginClass = "mt-2 mb-2";
            return (
                <React.Fragment key={concept.Id ?? `${concept.Name}-${i}`}>
                    {isTransparent && i > 3 && <Separator className="bg-gray-500 h-px"/>}
                    <Card
                        onClick={onConceptClick ? () => onConceptClick(concept) : undefined}
                        className={`cursor-pointer ${isTransparent
                            ? "bg-transparent border-none shadow-none hover:bg-secondary/40 transition-colors duration-200"
                            : "bg-secondary hover:bg-secondary/80 transition-colors duration-200"
                        } ${marginClass}`}
                    >
                        <CardHeader>
                            <CardTitle>{concept.Name}</CardTitle>
                            <CardDescription>{concept.Name}</CardDescription>
                        </CardHeader>
                    </Card>
                </React.Fragment>
            );
        })}
    </div>
  )
}