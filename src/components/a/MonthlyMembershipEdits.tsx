
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Loader2, Pencil } from "lucide-react";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axiosInstance from "@/helpers/axiosInstance";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";

export function MonthlyMembershipEdits({ plan }: { plan: any }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            duration: plan.duration,
            price: plan.price,
            currentOffer: plan.currentOffer,
        },
    });


    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {

            // console.log("Data:", data);

            const response = await axiosInstance.put(
                `/a/membership/monthly-plan/${plan._id}`,
                data
            );

            if (response) {
                toast({
                    title: "Success",
                    description: response.data.message,
                });
            }


        } catch (error) {
            console.error("Error during updating the monthly plan:", error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;
            ("There was a problem with updating your plan. Please try again.");

            toast({
                title: "Failed to update plan",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Pencil className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {/* Monthly Plan Header */}
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Monthly Plan</h4>
                            <p className="text-sm text-muted-foreground">
                                Edit the info of the monthly plan.
                            </p>
                        </div>

                        {/* Form Fields for Membership Plan */}
                        <div className="grid gap-2">
                            {/* Membership Name */}
                            <FormLabel htmlFor="name">Membership Name</FormLabel>
                            <Input
                                id="name"
                                value={plan.name}
                                placeholder="Enter membership name"
                                className="col-span-2 h-8 disabled:opacity-70"
                                contentEditable={false}
                            />

                            {/* Duration */}
                            <FormField
                                name="duration"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="duration">Duration</FormLabel>
                                        <Input
                                            id="duration"

                                            {...field}
                                            placeholder="Enter duration (e.g. 12 months)"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Plan Price */}
                            <FormField
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="price">Plan Price</FormLabel>
                                        <Input
                                            id="price"
                                            defaultValue={plan.price}
                                            {...field}
                                            placeholder="Enter the plan price"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Plan Offer */}
                            <FormField
                                name="currentOffer"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="currentOffer">Plan Offer</FormLabel>
                                        <Input
                                            id="currentOffer"
                                            defaultValue={plan.currentOffer}
                                            {...field}
                                            placeholder="Enter the plan offer"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}