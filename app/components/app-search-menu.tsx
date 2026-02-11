"use client"

import {MessageCircle, SquarePen,} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import React from "react";

interface AppSearchMenuProps {
    triggerOpen?: () => void;
}

export function AppSearchMenu({triggerOpen}: AppSearchMenuProps) {
    const [open, setOpen] = React.useState(false)

    // Expose the open function to parent components
    React.useEffect(() => {
        if (triggerOpen) {
            // Store the setOpen function in a way that parent can access
            (window as any).__openSearchMenu = () => setOpen(true);
        }
    }, [triggerOpen]);

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Search Chats"
            description="Search through your chat history and commands"
        >
            <CommandInput placeholder="Type a command or search..."/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandItem onSelect={() => window.location.href = '/'}>
                        <SquarePen/>
                        <span>New chat</span>
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Previous 30 Days">
                    <CommandItem>
                        <MessageCircle/>
                        <span>Chat</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
