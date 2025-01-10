
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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



export function MembershipEdits({ plan }: { plan: any }) {

    let membershipName = plan.membershipName;

    const [isSubmitting, setIsSubmitting] = useState(false);

    // console.log(plan);

    const form = useForm({
        defaultValues: {
            membershipName: plan.membershipName,
            membershipDescription: plan.membershipDescription,
            membershipPerks: plan.membershipPerks.join(", "),
            membershipIsAvailable: plan.membershipIsAvailable
        },
    });


    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {

            // console.log("Data:", data);

            const response = await axiosInstance.put(
                `/a/membership/${plan._id}`,
                {
                    data,
                    isMembershipNameChanged: data.membershipName !== membershipName
                }
            );

            if (response) {
                toast({
                    title: "Success",
                    description: response.data.message
                });
            }


        } catch (error) {
            console.error("Error during updating membership details:", error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message;
            ("There was a problem with updating your membership details. Please try again.");

            toast({
                title: "Failed to update membership details",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // TODO: Creating input for the perks and how could you add them 
    // you can take text area and by separating them with comma you can add them

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Pencil className="h-4 w-4 mr-1" /> {" "}Edit
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">

                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Membership Info</h4>
                            <p className="text-sm text-muted-foreground">
                                Edit the info of the membership.
                            </p>
                        </div>


                        <div className="grid gap-2">
                            {/* Membership Name */}
                            <FormField
                                name="membershipName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="membershipName">Membership Name</FormLabel>
                                        <Input
                                            id="membershipName"
                                            {...field}
                                            placeholder="Enter membership name"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                name="membershipDescription"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="membershipDescription">Description</FormLabel>
                                        <Input
                                            id="membershipDescription"
                                            {...field}
                                            placeholder="Enter duration (e.g. 12 months)"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                name="membershipPerks"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="membershipPerks">Plan Offer</FormLabel>
                                        <Textarea
                                            id="membershipPerks"
                                            {...field}
                                            placeholder="Enter the plan offer separated by comma"
                                            className="col-span-2 h-8"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                name="membershipIsAvailable"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>

                                        <div className="flex items-center space-x-2">
                                            <FormLabel htmlFor="membershipIsAvailable">Active</FormLabel>
                                            <Switch
                                                id="membershipIsAvailable"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
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