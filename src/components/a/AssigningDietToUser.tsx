import React from "react";
import { DietPlanForm } from './DietForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



const AssignDietPlan = ({ userId }: { userId: string }) => {
    const initialData = {
        templateName: "",
        type: "",
        meals: {
            breakfast: { name: "", items: [], calories: "", macros: { protein: "", carbs: "", fats: "" } },
            preWorkout: { name: "", items: [], calories: "", macros: { protein: "", carbs: "", fats: "" } },
            postWorkout: { name: "", items: [], calories: "", macros: { protein: "", carbs: "", fats: "" } },
            lunch: { name: "", items: [], calories: "", macros: { protein: "", carbs: "", fats: "" } },
            dinner: { name: "", items: [], calories: "", macros: { protein: "", carbs: "", fats: "" } },
        },
        notes: "",
    };

    const handleSubmit = async (data: any) => {
        console.log(`Assigning diet plan to user ${userId} with data:`, data);
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Diet Plan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] h-auto overflow-y-auto max-h-[calc(100vh-2rem)] p-4">
                    <DialogHeader>
                        <DialogTitle>Edit Diet Plan</DialogTitle>
                        <DialogDescription>
                            Update diet plan for your client.
                        </DialogDescription>
                    </DialogHeader>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a diet plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Diet Plans</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="grid gap-4 py-4">
                        <DietPlanForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={false} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AssignDietPlan;
