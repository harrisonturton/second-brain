'use client';

import NavBar from './components/NavBar'
import SearchInput from "@/app/components/SearchInput";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <NavBar showSearch={false}/>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <SearchInput newSession={true}/>
            </div>
        </main>
    );
}

