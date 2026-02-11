"use client"

import {useRouter} from 'next/navigation'
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Link from "next/link";

interface NavBarProps {
    showSideBar?: () => void;
    showSideBarToggle?: boolean;
}

export default function NavBar() {
    // const router = useRouter()
    // const showSideBarToggle = !showSideBar

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        // <div className="navbar bg-base-100 shadow-sm">
        //     <div className="flex-1">
        //         {/*{showSideBarToggle && (*/}
        //         {/*    <button*/}
        //         {/*        className="btn btn-ghost btn-circle"*/}
        //         {/*        onClick={showSideBar}*/}
        //         {/*    >*/}
        //         {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
        //         {/*             stroke="currentColor" className="w-6 h-6">*/}
        //         {/*            <path strokeLinecap="round" strokeLinejoin="round"*/}
        //         {/*                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>*/}
        //         {/*        </svg>*/}
        //         {/*    </button>*/}
        //         {/*)}*/}
        //         <a
        //             className="btn btn-ghost text-xl"
        //             // onClick={() => router.push('/')}
        //         >
        //             SecondBrain
        //         </a>
        //     </div>
        //     <div className="flex gap-2">
        //         <div className="dropdown dropdown-end">
        //             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        //                 <div className="w-10 rounded-full">
        //                     <img
        //                         alt="Tailwind CSS Navbar component"
        //                         src="https://lh3.googleusercontent.com/a/AGNmyxajX2KbMi2PoTx6QwiyG3QkXHTWbjV_xgCQqCqv=s96-c"/>
        //                 </div>
        //             </div>
        //             <ul
        //                 tabIndex={0}
        //                 className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        //                 <li>
        //                     <a className="justify-between">
        //                         Profile
        //                         <span className="badge">New</span>
        //                     </a>
        //                 </li>
        //                 <li><a>Settings</a></li>
        //                 <li><a>Logout</a></li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>
    )
}