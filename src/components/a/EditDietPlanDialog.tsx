import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import axiosInstance from "@/helpers/axiosInstance";
import { toast } from "@/hooks/use-toast";

const EditDietPlanDialog = ({ diet }: any) => {

    // console.log("Edited diet plan : ", diet._id)

    const [template, setTemplate] = useState({
        templateName: diet?.templateName || "",
        type: diet?.type || "",
        meals: diet?.meals || {},
        notes: diet?.notes || "",
    });

    const form = useForm({
        defaultValues: {
            templateName: "",
            type: "",
            meals: {
                breakfast: {
                    name: "",
                    items: [{ foodItem: "", quantity: "" }],
                    calories: "",
                    macros: { protein: "", carbs: "", fats: "" },
                },
                preWorkout: {
                    name: "",
                    items: [{ foodItem: "", quantity: "" }],
                    calories: "",
                    macros: { protein: "", carbs: "", fats: "" },
                },
                postWorkout: {
                    name: "",
                    items: [{ foodItem: "", quantity: "" }],
                    calories: "",
                    macros: { protein: "", carbs: "", fats: "" },
                },
                lunch: {
                    name: "",
                    items: [{ foodItem: "", quantity: "" }],
                    calories: "",
                    macros: { protein: "", carbs: "", fats: "" },
                },
                dinner: {
                    name: "",
                    items: [{ foodItem: "", quantity: "" }],
                    calories: "",
                    macros: { protein: "", carbs: "", fats: "" },
                },
            },
            notes: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateMealItem = (mealKey: string, index: number, updatedItem: { foodItem: string; quantity: string; }) => {
        setTemplate((prev: any) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [mealKey]: {
                    ...prev.meals[mealKey],
                    items: prev.meals[mealKey].items.map((item: any, i: any) =>
                        i === index ? updatedItem : item
                    ),
                },
            },
        }));
    };

    const addMealItem = (mealKey: string) => {
        setTemplate((prev: any) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [mealKey]: {
                    ...prev.meals[mealKey],
                    items: Array.isArray(prev.meals[mealKey].items) ? [...prev.meals[mealKey].items, { foodItem: "", quantity: "" }] : [{ foodItem: "", quantity: "" }],
                },
            },
        }));
    };

    const removeMealItem = (mealKey: string, index: number) => {
        setTemplate((prev: any) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [mealKey]: {
                    ...prev.meals[mealKey],
                    items: prev.meals[mealKey].items.filter((_: any, i: any) => i !== index),
                },
            },
        }));
    };

    const onSubmit = async (data: any) => {
        // console.log("Submitting data:", template);
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.put("/a/diet", {
                templateId: diet._id,
                templateName: template.type,
                type: template.templateName,
                meals: template.meals,
                notes: template.templateName,
            });

            if (response) {
                toast({
                    title: "Success",
                    description: response.data.message,
                });
            }
        } catch (err) {
            console.error("Error submitting template:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Diet Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-auto overflow-y-auto max-h-[calc(100vh-2rem)] p-4">
                <DialogHeader>
                    <DialogTitle>Edit Diet Plan</DialogTitle>
                    <DialogDescription>
                        Update diet plan for your clients.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            {/* Template Name and Type */}
                            <div className="grid gap-2">
                                <FormField
                                    name="templateName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="templateName">Template Name</FormLabel>
                                            <Input
                                                id="templateName"
                                                {...field}
                                                value={template.templateName}
                                                onChange={(e) =>
                                                    setTemplate({ ...template, templateName: e.target.value })
                                                }
                                                placeholder="Enter template name"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="type"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="type">Template Type</FormLabel>
                                            <Input
                                                id="type"
                                                {...field}
                                                value={template.type}
                                                onChange={(e) =>
                                                    setTemplate({ ...template, type: e.target.value })
                                                }
                                                placeholder="Enter template type"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Meals Section */}
                            <div className="space-y-4">
                                <h4 className="font-medium leading-none">Meals</h4>
                                {Object.entries(template.meals).map(([mealKey, mealData]: any) => (
                                    <div key={mealKey} className="space-y-2">
                                        <FormField
                                            name={`meals.${mealKey}.name`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor={`${mealKey}_name`}>
                                                        {mealKey.charAt(0).toUpperCase() + mealKey.slice(1)} Name
                                                    </FormLabel>
                                                    <Input
                                                        id={`${mealKey}_name`}
                                                        {...field}
                                                        value={mealData.name}
                                                        onChange={(e) =>
                                                            setTemplate({
                                                                ...template,
                                                                meals: {
                                                                    ...template.meals,
                                                                    [mealKey]: {
                                                                        ...mealData,
                                                                        name: e.target.value,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        placeholder={`Enter ${mealKey} name`}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-y-2">
                                            <h5 className="font-medium leading-none">Items</h5>
                                            {mealData.items?.map((item: any, index: number) => (
                                                <div key={index} className="flex space-x-2">
                                                    <Input
                                                        value={item.foodItem}
                                                        placeholder="Food Item"
                                                        onChange={(e) =>
                                                            updateMealItem(mealKey, index, {
                                                                ...item,
                                                                foodItem: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        value={item.quantity}
                                                        placeholder="Quantity"
                                                        onChange={(e) =>
                                                            updateMealItem(mealKey, index, {
                                                                ...item,
                                                                quantity: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => removeMealItem(mealKey, index)}
                                                        type="button"
                                                        className="text-red-400"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => addMealItem(mealKey)}
                                                className="text-blue-500"
                                                type="button"
                                            >
                                                Add Item
                                            </Button>
                                        </div>
                                        {/* Macros and Calories */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <Input
                                                value={mealData.calories}
                                                placeholder="Calories"
                                                onChange={(e) =>
                                                    setTemplate({
                                                        ...template,
                                                        meals: {
                                                            ...template.meals,
                                                            [mealKey]: {
                                                                ...mealData,
                                                                calories: e.target.value,
                                                            },
                                                        },
                                                    })
                                                }
                                            />
                                            <div className="flex space-x-2">
                                                <Input
                                                    value={mealData.macros?.protein}
                                                    placeholder="Protein (g)"
                                                    onChange={(e) =>
                                                        setTemplate({
                                                            ...template,
                                                            meals: {
                                                                ...template.meals,
                                                                [mealKey]: {
                                                                    ...mealData,
                                                                    macros: {
                                                                        ...mealData.macros,
                                                                        protein: e.target.value,
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Input
                                                    value={mealData.macros?.carbs}
                                                    placeholder="Carbs (g)"
                                                    onChange={(e) =>
                                                        setTemplate({
                                                            ...template,
                                                            meals: {
                                                                ...template.meals,
                                                                [mealKey]: {
                                                                    ...mealData,
                                                                    macros: {
                                                                        ...mealData.macros,
                                                                        carbs: e.target.value,
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                                <Input
                                                    value={mealData.macros?.fats}
                                                    placeholder="Fats (g)"
                                                    onChange={(e) =>
                                                        setTemplate({
                                                            ...template,
                                                            meals: {
                                                                ...template.meals,
                                                                [mealKey]: {
                                                                    ...mealData,
                                                                    macros: {
                                                                        ...mealData.macros,
                                                                        fats: e.target.value,
                                                                    },
                                                                },
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            <FormField
                                name="notes"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="notes">Notes</FormLabel>
                                        <Textarea
                                            id="notes"
                                            {...field}
                                            value={template.notes}
                                            onChange={(e) =>
                                                setTemplate({ ...template, notes: e.target.value })
                                            }
                                            placeholder="Add any important notes"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait...
                                    </>
                                ) : (
                                    "Save Template"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default EditDietPlanDialog;
