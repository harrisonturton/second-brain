'use client';

import { useState } from 'react';
import NavBar from './components/NavBar'
import SearchInput from "@/app/components/SearchInput";
import Sidebar from './components/Sidebar';

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <main className="min-h-screen bg-white">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <NavBar 
                    // onSidebarToggle={toggleSidebar}
                    // showSideBar={}
                    // showSideBarToggle={true}
                />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                    <h1 className="text-3xl font-bold mb-6">What do you want to learn today?</h1>
                    <SearchInput newSession={true}/>
                </div>
            </div>
        </main>
    );
}

