import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export function DietView({ dietPlan }: any) {

    // console.log("DietView plan", dietPlan);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">View Diet Plan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-2rem)] overflow-y-auto p-4">
                    <DialogHeader>
                        <DialogTitle>Diet Plan Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Template Name */}
                        <div>
                            <h3 className="text-lg font-semibold">Template Name:</h3>
                            <p className="text-gray-600">{dietPlan.templateName}</p>
                        </div>

                        {/* Template Type */}
                        <div>
                            <h3 className="text-lg font-semibold">Template Type:</h3>
                            <p className="text-gray-600">{dietPlan.type}</p>
                        </div>

                        {/* Meals Section */}
                        <div>
                            <h3 className="text-lg font-semibold">Meals:</h3>
                            {dietPlan?.meals && Object.entries(dietPlan?.meals).map(([mealKey, mealData]: any) => (
                                <div key={mealKey} className="mb-4">
                                    <h4 className="font-medium">{mealKey.charAt(0).toUpperCase() + mealKey.slice(1)}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{mealData.name}</p>
                                    <ul className="list-disc list-inside">
                                        {mealData.items?.map((item: any, index: number) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                {item.foodItem} - {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Notes */}
                        {dietPlan.notes && (
                            <div>
                                <h3 className="text-lg font-semibold">Notes:</h3>
                                <p className="text-gray-600">{dietPlan.notes}</p>
                            </div>
                        )}
                    </div>
                    <DialogClose>
                        <Button variant="outline" className="mt-4 w-full">
                            Close
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog></>
    )
}

