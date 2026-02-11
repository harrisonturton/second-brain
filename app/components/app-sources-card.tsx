import { Separator } from "@radix-ui/react-separator";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "@/components/ui/button";
import {ArrowDownToLine, VectorSquare} from "lucide-react";

export function AppSourcesCard() {
    return (
        <div className="border-input rounded-3xl border bg-transparent p-4 h-full overflow-y-auto">
            <div className="flex justify-end">
                <Button variant="secondary" size="icon" className="size-8">
                    <ArrowDownToLine />
                </Button>
            </div>
            <Card className="bg-secondary hover:bg-secondary/80 transition-colors duration-200 mt-4 mb-4">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
            </Card>
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
            </Card>
                <Separator className="bg-gray-500 h-0.5"/>
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
            </Card>
        </div>
    )
}