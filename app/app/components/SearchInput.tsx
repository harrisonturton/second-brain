import {search} from "@/app/api/endpoints/search";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function SearchInput({ newSession = false }: { newSession?: boolean }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                const storedSessionId = sessionStorage.getItem("sessionId");
                const sessionId = newSession ? "" : (storedSessionId || "");

                const result = await search(query, sessionId);
                console.log('Search result:', result);
                sessionStorage.setItem('sessionId', result.SessionId);
                sessionStorage.setItem('searchResult', JSON.stringify(result));
                
                // Dispatch event to notify other components
                window.dispatchEvent(new Event('searchResultUpdated'));
                
                router.push('/search');
            } catch (error) {
                console.error('Search failed:', error);
            }
        }
    };

    return (
        <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full max-w-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
        />
    );
}