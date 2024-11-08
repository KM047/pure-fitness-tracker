import dbConnection from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import UserDietPlanModel from "@/model/userDietPlan.model";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

// This route is to get the diet plan of the user by userId
export async function GET(request: NextRequest) {
    await dbConnection();

    const session = await getServerSession(authOptions);

    const _user: User = session?.user as User;

    if (!session || !_user) {
        return jsonResponse({
            success: false,
            message: "Not authenticated",
            status: 401,
        });
    }

    try {
        const dietPlan = await UserDietPlanModel.aggregate([
            {
                $match: {
                    clientId: new mongoose.Types.ObjectId(_user._id),
                },
            },
            {
                $project: {
                    _id: 1,
                    clientId: 1,
                    planName: 1,
                    meals: 1,
                    notes: 1,
                },
            },
        ]);

        if (!dietPlan) {
            return jsonResponse({
                success: true,
                message:
                    "Diet plan not available yet. Please check back later.",
                status: 200,
                data: null,
            });
        }

        return jsonResponse({
            success: true,
            message: "The diet plan fetched successfully",
            status: 200,
            data: dietPlan,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while getting the diet plan",
            status: 500,
        });
    }
}
