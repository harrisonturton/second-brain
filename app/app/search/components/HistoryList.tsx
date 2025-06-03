import {Concept} from '../types';
import {search} from "@/app/api/endpoints/search";

interface HistoryListProps {
    history: Concept[]; // and query id
}

export default function HistoryList({ history }: HistoryListProps) {
    const handleHistoryClick = async (concept: Concept) => {
        try {
            const sessionId = sessionStorage.getItem("sessionId") || "";
            const result = await search(concept.Name, sessionId);
            console.log('Search result:', result);
            sessionStorage.setItem('searchResult', JSON.stringify(result));
            // Dispatch a custom event to notify about the storage change
            window.dispatchEvent(new Event('searchResultUpdated'));
        } catch (error) {
            console.error('Failed to update active concept:', error);
        }
    };

    if (!history || history.length === 0) {
        return (
            <div className="h-screen overflow-y-auto">
                <ul className="menu bg-base-200 rounded-box w-full">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Previous searches</li>
                    <li className="p-4 text-sm opacity-60">No search history yet</li>
                </ul>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto">
            <ul className="menu bg-base-200 rounded-box w-full">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Previous searches</li>
                {history.map((concept, index) => (
                    <li key={index} className="list-row" onClick={() => handleHistoryClick(concept)}>
                        <div>
                            <div>{concept.Name}</div>
                            <div className="text-xs opacity-60">
                                {concept.Description}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}