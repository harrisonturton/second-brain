import {Concept} from "@/app/search/types";
import {search} from "@/app/api/endpoints/search";

interface ConceptGroupsProps {
    concept: Concept
    relatedConcepts: Concept[];
}

export default function ConceptsMenu({concept, relatedConcepts}: ConceptGroupsProps) {
    const handleConceptClick = async (conceptName: string) => {
        try {
            const sessionId = sessionStorage.getItem("sessionId");
            const result = await search(conceptName, sessionId);
            console.log('Search result:', result);
            sessionStorage.setItem('searchResult', JSON.stringify(result));
            // Dispatch a custom event to notify about the storage change
            window.dispatchEvent(new Event('searchResultUpdated'));
        } catch (error) {
            console.error('Failed to search concept:', error);
        }
    };

    return (
        <div className="w-full h-full">
            <div>
                Next concepts
            </div>
            <ul className="menu bg-base-200 rounded-box w-full mb-4">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{concept.name}</li>
                {relatedConcepts.map((relatedConcept, i) => (
                    <li key={i} onClick={() => handleConceptClick(relatedConcept.name)}><a>{relatedConcept.name}</a></li>
                ))}
            </ul>
        </div>
    )
}