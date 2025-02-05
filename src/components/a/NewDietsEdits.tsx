
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import axiosInstance from "@/helpers/axiosInstance";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from '@/components/ui/switch';



export function NewDietsEdits() {

    const [template, setTemplate] = useState({
        templateName: "Balanced Weight Loss Plan",
        type: "Weight Loss",
        meals: {
            breakfast: {
                name: "Oatmeal and Fruit",
                items: [
                    { foodItem: "Oats", quantity: "50g" },
                    { foodItem: "Banana", quantity: "1 medium" },
                    { foodItem: "Almond milk", quantity: "200ml" },
                ],
                calories: 300,
                macros: { protein: 10, carbs: 50, fats: 5 },
            },
            preWorkout: {
                name: "Energy Boost",
                items: [
                    { foodItem: "Apple", quantity: "1 medium" },
                    { foodItem: "Peanut butter", quantity: "1 tbsp" },
                ],
                calories: 150,
                macros: { protein: 2, carbs: 20, fats: 7 },
            },
            postWorkout: {
                name: "Protein Shake",
                items: [
                    { foodItem: "Protein powder", quantity: "1 scoop" },
                    { foodItem: "Water", quantity: "300ml" },
                ],
                calories: 120,
                macros: { protein: 25, carbs: 3, fats: 1 },
            },
            lunch: {
                name: "Grilled Chicken Salad",
                items: [
                    { foodItem: "Grilled chicken breast", quantity: "150g" },
                    { foodItem: "Mixed greens", quantity: "100g" },
                    { foodItem: "Olive oil", quantity: "1 tbsp" }
                ],
                calories: 400,
                macros: { protein: 30, carbs: 15, fats: 10 }
            },
            dinner: {
                name: "Vegetable Stir Fry",
                items: [
                    { foodItem: "Tofu", quantity: "100g" },
                    { foodItem: "Mixed vegetables", quantity: "200g" },
                    { foodItem: "Soy sauce", quantity: "1 tbsp" }
                ],
                calories: 350,
                macros: { protein: 15, carbs: 30, fats: 8 }
            },
        },
        notes: "Drink plenty of water throughout the day and avoid sugary drinks.",
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
        setIsSubmitting(true);
        try {

            const response = await axiosInstance.post(
                `/a/diet`,
                {
                    templateName: template.templateName,
                    type: template.type,
                    meals: template.meals,
                    notes: template.notes
                }
            );

            if (response) {
                toast({
                    title: "Success",
                    description: response.data.message
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
                <Button variant="outline">New Diet Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-auto overflow-y-auto max-h-[calc(100vh-2rem)] p-4">
                <DialogHeader>
                    <DialogTitle>New Diet Plan</DialogTitle>
                    <DialogDescription>
                        Create a personalized diet plan for your clients.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            {/* Template Name and Type */}
                            <div className="grid gap-2">
                                <FormField
                                    name="templateName"
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
                                            name={`${mealKey}.name`}
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
}