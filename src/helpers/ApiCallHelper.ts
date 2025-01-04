import axiosInstance from "./axiosInstance";
import { toast } from "@/hooks/use-toast";

export async function deleteDiet(dietId: string) {
    try {
        const response = await axiosInstance.delete("a/diet", {
            data: {
                templateId: dietId,
            },
        });

        // console.log("response :", response);

        if (response?.data.success) {
            toast({
                title: "Membership Deleted",
                description: response?.data.message,
            });
        }
    } catch (error: any) {
        // console.log("error :", error);

        toast({
            title: "Failed to delete membership",
            description: error.message,
        });
    }
}
