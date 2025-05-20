import React from "react";
import type {ElementDefinition} from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import {ConceptGraph} from "@/app/search/types";

interface GraphModalProps {
    modalRef: React.RefObject<HTMLDialogElement>
    conceptGraph: ConceptGraph
}

export default function GraphModal({modalRef, conceptGraph}: GraphModalProps) {
    const elements: ElementDefinition[] = conceptGraph.nodes.length === 0 ? [] : [
        // Add nodes
        ...conceptGraph.nodes.map(node => ({
            data: { 
                id: node.id, 
                label: node.name 
            }
        })),
        // Add edges from adjList
        ...conceptGraph.adjList.flatMap((connections, index) => 
            connections.map(targetNode => ({
                data: { 
                    source: conceptGraph.nodes[index].id,
                    target: targetNode.id
                }
            }))
        )
    ];

    return (
        <dialog ref={modalRef} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg mb-4">Concept Graph</h3>
                <div className="w-full h-[600px] border border-base-300 rounded-lg">
                    <CytoscapeComponent
                        elements={elements}
                        style={{ width: "100%", height: "100%" }}
                        layout={{ 
                            name: "grid",
                            rows: Math.ceil(Math.sqrt(conceptGraph.nodes.length)),
                            cols: Math.ceil(Math.sqrt(conceptGraph.nodes.length)),
                            padding: 50,
                            nodeDimensionsIncludeLabels: true
                        }}
                    />
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
