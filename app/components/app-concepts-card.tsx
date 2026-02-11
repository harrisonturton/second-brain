import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {VectorSquare} from "lucide-react";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card";

export function AppConceptsCard() {
  return (
    <div className="border-input rounded-3xl border bg-transparent p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-2">
            <Input type="search" placeholder="Search related concepts..." className="flex-1"/>
            <Button variant="secondary" size="icon" className="size-8">
                <VectorSquare />
            </Button>
        </div>
        <Card className="bg-secondary hover:bg-secondary/80 transition-colors duration-200 mt-4">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
        </Card>
        <Card className="bg-secondary hover:bg-secondary/80 transition-colors duration-200 mt-4">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
        </Card>
    </div>
  )
}