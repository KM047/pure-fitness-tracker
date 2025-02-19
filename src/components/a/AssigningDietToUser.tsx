import React, { useState } from "react";
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
import { fetcherForGet } from "@/helpers";
import useSWR from "swr";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/helpers/axiosInstance";



const AssignDietPlan = ({ userId }: { userId: string }) => {


    const [initialData, setInitialData] = useState(null)

    const { data, error, isLoading } = useSWR(`a/diet`, fetcherForGet, {
        revalidateOnFocus: true,
    });

    const handleSubmit = async (data: any) => {
        // console.log(`Assigning diet plan to user ${userId} with data:`, data);

        try {

            // const exitDietPlanUser = 

            const response = await axiosInstance.post("/a/diet/u", {
                clientId: userId,
                planName: data.templateName,
                type: data.type,
                meals: data.meals,
                notes: data.templateName,
            });

            if (response) {
                toast({
                    title: "Success",
                    description: response.data.message,
                });
            }
        } catch (err) {
            console.error("Error while assigning diet to user :", err);
        } finally {
        }
    };

    const onChangeTemplate = (template: any) => {
        setInitialData(template);
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">New Diet Plan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] h-auto overflow-y-auto max-h-[calc(100vh-2rem)] p-4">
                    <DialogHeader>
                        <DialogTitle>New Diet Plan</DialogTitle>
                        <DialogDescription>
                            New diet plan for your client.
                        </DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={onChangeTemplate}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a diet plan" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                <SelectLabel>Diet Plans</SelectLabel>
                                {data && data.data &&
                                    data.data.map((planTemp: any, idx: number) =>
                                    (<>
                                        <SelectItem key={idx} value={planTemp} onClick={onChangeTemplate}>{planTemp.templateName}</SelectItem>
                                    </>))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {error && (<span className="text-sm text-red-500">{error}</span>)}
                    <div className="grid gap-4 py-4">
                        {initialData && (<DietPlanForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isLoading} />)}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AssignDietPlan;
