import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserDietPlanModel from "@/model/userDietPlan.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest } from "next/server";

// This route is to get the details of the diet plan of the all users

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        const user = session?.user as User;

        if (!session || !user) {
            return jsonResponse({
                success: false,
                message: "Not authenticated",
                status: 401,
            });
        }

        if (!user.role || user?.role !== "ADMIN") {
            return jsonResponse({
                success: false,
                message:
                    "Not authorized to access this route. only can an admin can access this route.",
                status: 401,
            });
        }

        const userDiet = await UserDietPlanModel.findOne({
            clientId: params.userId,
        }).select("-__v -createdAt -updatedAt");

        if (!userDiet) {
            throw new Error(
                "Error while fetching the diet plan for this userId"
            );
        }

        return jsonResponse({
            success: true,
            message: "User diet plan fetched successfully",
            data: userDiet,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while fetching the diet plans",
        });
    }
}
