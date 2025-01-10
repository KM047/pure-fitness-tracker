
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



export function NewMembershipEdits() {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            membershipName: "",
            membershipDescription: "",
            membershipPerks: "",
            membershipIsAvailable: true,
            membershipImage: null
        },
    });


    const onSubmit = async (data: any) => {


        setIsSubmitting(true);
        try {

            const formData = new FormData();

            formData.append("membershipName", data.membershipName);
            formData.append("membershipDescription", data.membershipDescription);
            formData.append("membershipPerks", data.membershipPerks.split(',').map((perk: any) => perk.trim()));
            formData.append("membershipIsAvailable", data.membershipIsAvailable);

            if (data.membershipImage) {
                formData.append("file", data.membershipImage);
            }

            formData.append("plans", JSON.stringify(plans));

            const response = await axiosInstance.post(
                `/a/membership/new-plan`,
                formData
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

    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ duration: "", price: "", currentOffer: "" });

    const [editingIndex, setEditingIndex] = useState(null);

    const handleAddPlan = () => {
        if (editingIndex !== null) {
            const updatedPlans: any = [...plans];
            updatedPlans[editingIndex] = newPlan; // Update the plan
            setPlans(updatedPlans);
            setEditingIndex(null); // Reset editing mode
        } else {
            setPlans([...plans, newPlan] as any); // Add new plan
        }
        setNewPlan({ duration: "", price: "", currentOffer: "" }); // Reset the form
    };

    const handleRemovePlan = (index: any) => {
        const updatedPlans = plans.filter((_, i) => i !== index);
        setPlans(updatedPlans);
    };

    const handleEditPlan = (index: any) => {
        const planToEdit = plans[index];
        setNewPlan(planToEdit);
        setPlans(plans.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        form.setValue("membershipImage", file);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    New Membership
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Membership</DialogTitle>
                    <DialogDescription>
                        Create new membership for  your clients to subscribe
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                                            <FormLabel htmlFor="membershipDescription">Membership Description</FormLabel>
                                            <Input
                                                id="membershipDescription"
                                                {...field}
                                                placeholder="Enter membership description"
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
                                            <FormLabel htmlFor="membershipPerks">Membership Perks</FormLabel>
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

                                {/* File Upload */}
                                <FormItem>
                                    <FormLabel htmlFor="membershipImage">Membership Image</FormLabel>
                                    <input
                                        type="file"
                                        id="membershipImage"
                                        onChange={handleFileChange}
                                        className="col-span-2 h-8"
                                    />
                                    <FormMessage />
                                </FormItem>

                                {/* Monthly Plans */}
                                <div>
                                    <h4 className="font-medium leading-none">Monthly Plans</h4>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            value={newPlan.duration}
                                            onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                                            placeholder="Duration (months)"
                                            className="h-8"
                                        />
                                        <Input
                                            type="number"
                                            value={newPlan.price}
                                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                                            placeholder="Price"
                                            className="h-8"
                                        />
                                        <Input
                                            type="number"
                                            value={newPlan.currentOffer}
                                            onChange={(e) =>
                                                setNewPlan({ ...newPlan, currentOffer: e.target.value })
                                            }
                                            placeholder="Current Offer"
                                            className="h-8"
                                        />
                                        <Button
                                            type="button"
                                            onClick={newPlan.duration && newPlan.price && newPlan.currentOffer ? handleAddPlan : () => { }}
                                            className="mt-2"
                                        >
                                            {editingIndex !== null ? "Save Changes" : "Add Plan"}
                                        </Button>
                                    </div>
                                    <ul>
                                        {plans.map((plan: any, index) => (
                                            <li key={index} className="flex items-center justify-between">
                                                <div>
                                                    {plan.duration} months - Price: {plan.price} - Offer: {plan.currentOffer}
                                                </div>
                                                <div className="flex space-x-2">
                                                    {/* Edit Button */}
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleEditPlan(index)}
                                                        className="text-blue-500"
                                                    >
                                                        Edit
                                                    </Button>
                                                    {/* Remove Button */}
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() => handleRemovePlan(index)}
                                                        className="text-red-500"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait...
                                    </>
                                ) : (
                                    "Add Membership"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}