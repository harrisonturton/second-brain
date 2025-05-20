import {search} from "@/app/api/endpoints/search";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function SearchInput({ newSession = false }: { newSession?: boolean }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                if (newSession) {
                    sessionStorage.clear();
                }
                const sessionId = sessionStorage.getItem("sessionId");

                const result = await search(query, sessionId, true);
                console.log('Search result:', result);
                sessionStorage.setItem('sessionId', result.sessionId);
                sessionStorage.setItem('searchResult', JSON.stringify(result));

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