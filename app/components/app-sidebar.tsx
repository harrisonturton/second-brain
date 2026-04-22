'use client';

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    HomeIcon,
    LogOut,
    PanelLeftIcon,
    Search,
    Sparkles,
    SquarePen
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react";
import { AppSearchMenu } from "./app-search-menu";
import {Concept} from "@/app/search/types";

export function AppSidebar() {
    const username = "Vilia";
    const useremail = "vilia.li@gmail.com"
    const {toggleSidebar} = useSidebar();
    const [historyList, setHistoryList] = React.useState<Concept[]>([]);
    const [sessionId, setSessionId] = React.useState<string>("");

    React.useEffect(() => {
        const refresh = () => {
            setSessionId(sessionStorage.getItem("sessionId") || "");
            const stored = sessionStorage.getItem("historyList");
            if (stored) {
                try {
                    setHistoryList(JSON.parse(stored));
                } catch (error) {
                    console.error('Failed to parse historyList:', error);
                    setHistoryList([]);
                }
            } else {
                setHistoryList([]);
            }
        };
        refresh();
        window.addEventListener('sessionHistoryUpdated', refresh);
        return () => window.removeEventListener('sessionHistoryUpdated', refresh);
    }, []);

    return (
        <>
            <AppSearchMenu triggerOpen={() => {}} />
            <Sidebar collapsible={"icon"}>
            <SidebarHeader>
                <div className="flex justify-between items-center w-full">
                    <SidebarMenu className="w-auto">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="size-8 w-8 h-8 group-data-[collapsible=icon]:hidden"
                            >
                                <HomeIcon/>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu className="w-auto">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="size-8 w-8 h-8"
                                onClick={toggleSidebar}
                            >
                                <PanelLeftIcon/>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/">
                                        <SquarePen/>
                                        <span>New session</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => {
                                    // Open the search menu directly
                                    if ((window as any).__openSearchMenu) {
                                        (window as any).__openSearchMenu();
                                    }
                                }}>
                                    <Search/>
                                    <span>Search sessions</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Current session</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {historyList.map((concept, i) => {
                                const href = sessionId
                                    ? `/chat/${sessionId}/${encodeURIComponent(concept.Name)}`
                                    : `/chat/new/${encodeURIComponent(concept.Name)}`;
                                return (
                                    <SidebarMenuItem key={`${concept.Id ?? concept.Name}-${i}`}>
                                        <SidebarMenuButton asChild>
                                            <a href={href}>
                                                <span>{concept.Name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={"https://lh3.googleusercontent.com/a/AGNmyxajX2KbMi2PoTx6QwiyG3QkXHTWbjV_xgCQqCqv=s96-c"}
                                            alt={username}/>
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{username}</span>
                                        <span className="truncate text-xs">{useremail}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={"bottom"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={"https://lh3.googleusercontent.com/a/AGNmyxajX2KbMi2PoTx6QwiyG3QkXHTWbjV_xgCQqCqv=s96-c"}
                                                alt={username}/>
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{username}</span>
                                            <span className="truncate text-xs">{useremail}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Sparkles/>
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <BadgeCheck/>
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard/>
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Bell/>
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <LogOut/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        </>
    );
}
