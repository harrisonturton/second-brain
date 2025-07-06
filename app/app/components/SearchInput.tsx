import {search} from "@/app/api/endpoints/search";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function SearchInput({ newSession = false }: { newSession?: boolean }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default newline behavior
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
        <textarea
            placeholder="Ask anything"
            className="textarea textarea-bordered w-full max-w-md min-h-[100px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
        />
    );
}