'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const router = useRouter();

    const menuItems = [
        { label: 'Home', path: '/' },
        { label: 'Search', path: '/search' },
        { label: 'History', path: '/history' },
        { label: 'Settings', path: '/settings' },
    ];

    return (
        <div className={`fixed top-0 left-0 h-screen bg-base-200 p-4 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Second Brain</h2>
                <button
                    className="btn btn-ghost btn-circle btn-sm"
                    onClick={onToggle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="flex-1">
                <ul className="menu bg-base-200 w-full">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <a
                                onClick={() => router.push(item.path)}
                                className="hover:bg-base-300"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <div className="flex items-center gap-2 p-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full">
                            <img src="https://lh3.googleusercontent.com/a/AGNmyxajX2KbMi2PoTx6QwiyG3QkXHTWbjV_xgCQqCqv=s96-c" alt="User avatar" />
                        </div>
                    </div>
                    <span className="text-sm">User Name</span>
                </div>
            </div>
        </div>
    );
} 