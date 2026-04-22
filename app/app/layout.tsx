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
        <head>
            <title>Second Brain</title>
            {/* Prevents mobile browsers from zooming out to fit the desktop layout */}
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
        <body>
        <SidebarProvider defaultOpen={defaultOpen} className="h-screen flex flex-row">
            <AppSidebar/>
            <main className="h-screen flex-1">
                {children}
            </main>
        </SidebarProvider>
        </body>
        </html>
    );
}
