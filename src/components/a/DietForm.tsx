import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Replace with your UI components
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const DietPlanForm = ({ initialData, onSubmit, isSubmitting }: any) => {
    const [template, setTemplate] = useState(initialData);

    const updateMealItem = (mealKey: string, index: number, updatedItem: { foodItem: string; quantity: string }) => {
        setTemplate((prev: any) => ({
            ...prev,
            meals: {
                ...prev.meals,
                [mealKey]: {
                    ...prev.meals[mealKey],
                    items: prev.meals[mealKey].items.map((item: any, i: number) =>
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
                    items: [...prev.meals[mealKey].items, { foodItem: "", quantity: "" }],
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

    const form = useForm({ defaultValues: initialData });

    return (

        <>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => onSubmit(template))} className="grid gap-4">
                    {/* Template Name */}
                    <FormField
                        name="templateName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Template Name</FormLabel>
                                <Input
                                    {...field}
                                    value={template.templateName}
                                    onChange={(e) => setTemplate({ ...template, templateName: e.target.value })}
                                    placeholder="Enter template name"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Template Type */}
                    <FormField
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Input
                                    {...field}
                                    value={template.type}
                                    onChange={(e) => setTemplate({ ...template, type: e.target.value })}
                                    placeholder="Enter type"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Meals Section */}
                    <div className="space-y-4">
                        <h4>Meals</h4>
                        {Object.entries(template.meals).map(([mealKey, mealData]: any) => (
                            <div key={mealKey} className="space-y-2">
                                <Input
                                    value={mealData.name}
                                    onChange={(e) =>
                                        setTemplate({
                                            ...template,
                                            meals: {
                                                ...template.meals,
                                                [mealKey]: { ...mealData, name: e.target.value },
                                            },
                                        })
                                    }
                                    placeholder={`${mealKey.charAt(0).toUpperCase() + mealKey.slice(1)} name`}
                                />
                                {mealData.items.map((item: any, index: number) => (
                                    <div key={index} className="flex space-x-2">
                                        <Input
                                            value={item.foodItem}
                                            placeholder="Food Item"
                                            onChange={(e) =>
                                                updateMealItem(mealKey, index, { ...item, foodItem: e.target.value })
                                            }
                                        />
                                        <Input
                                            value={item.quantity}
                                            placeholder="Quantity"
                                            onChange={(e) =>
                                                updateMealItem(mealKey, index, { ...item, quantity: e.target.value })
                                            }
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => removeMealItem(mealKey, index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button size="sm" onClick={() => addMealItem(mealKey)} className="text-blue-500">
                                    Add Item
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <FormField
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <Textarea
                                    {...field}
                                    value={template.notes}
                                    onChange={(e) => setTemplate({ ...template, notes: e.target.value })}
                                    placeholder="Add notes"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </form>

            </Form>
        </>

    );
};
