import "./globals.css";

import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import React from "react";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <html>
        <body>
        <SidebarProvider defaultOpen={defaultOpen} className="h-full flex flex-row">
            <AppSidebar/>
            <main className="w-full h-full min-h-screen flex-1">
                {children}
            </main>
        </SidebarProvider>
        </body>
        </html>
    );
}
