import {Concept} from '../types';

interface HistoryListProps {
    history: Concept[]; // and query id
}

export default function HistoryList({ history }: HistoryListProps) {
    const handleHistoryClick = async (concept: Concept) => {
        try {
            const storedResult = sessionStorage.getItem('searchResult');
            if (storedResult) {
                const result = JSON.parse(storedResult);
                result.concept = concept;
                console.log('Updated result with active concept: ', result);
                sessionStorage.setItem('searchResult', JSON.stringify(result));

                window.dispatchEvent(new Event('activeConceptUpdated'));
            }
        } catch (error) {
            console.error('Failed to update active concept:', error);
        }
    };

    return (
        <ul className="menu bg-base-200 rounded-box w-full h-full">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Previous searches</li>
            {history.map((concept, index) => (
                <li key={index} className="list-row" onClick={() => handleHistoryClick(concept)}>
                    <div>
                        <div>{concept.name}</div>
                        <p className="list-col-wrap text-xs">
                            {concept.description}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}