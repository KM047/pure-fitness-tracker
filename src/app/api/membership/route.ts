import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import MembershipModel from "@/model/membership.model";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const memberships = await MembershipModel.find({});

        if (!memberships.length) {
            return errorResponse({
                error: "Not found",
                message: "No membership plans found",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "The membership plans fetched successfully",
            data: memberships,
        });
    } catch (error) {
        return errorResponse({
            error: error,
            message: "Error occurred while you fetching the membership plans",
            status: 500,
        });
    }
}
