import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import UserDietPlanModel from "@/model/userDietPlan.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest } from "next/server";

// This route is to create the diet plan of the user by userId
export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        const user = session?.user as User;

        if (!session || !user) {
            return Response.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        if (!user.role || user?.role !== "ADMIN") {
            return jsonResponse({
                success: false,
                message:
                    "Not authorized to access this route. only can an admin can access this route.",
                status: 401,
            });
        }

        const { clientId, planName, meals, notes, type } = await request.json();

        const newDietPlan = await UserDietPlanModel.create({
            clientId,
            planName,
            meals,
            notes,
            type,
        });

        if (!newDietPlan) {
            throw new Error("Error while creating the new diet plan");
        }

        return jsonResponse({
            success: true,
            message: "Diet plan created successfully for the client",
            data: newDietPlan,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while assigning diet to the client.",
        });
    }
}

// This route is to update the diet plan of the user by userId
export async function PUT(request: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        const user = session?.user as User;

        if (!session || !user) {
            return Response.json(
                {
                    success: false,
                    message: "Not authenticated",
                },
                {
                    status: 401,
                }
            );
        }

        const { clientId, planName, meals, notes, type } = await request.json();

        const updatedDietPlan = await UserDietPlanModel.findOneAndUpdate(
            { clientId, planName },
            {
                clientId,
                planName,
                meals,
                notes,
                type,
            },
            {
                new: true,
            }
        );

        if (!updatedDietPlan) {
            throw new Error("Error while updating the diet plan");
        }

        return jsonResponse({
            success: true,
            message: "Diet plan updated successfully for the client",
            data: updatedDietPlan,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while updating the diet plan",
        });
    }
}

// This route is to delete the diet plan of the user by userId
export async function DELETE(request: NextRequest) {
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

        const { clientId, planName } = await request.json();
        // in this i can get direct the _id of the userDietPlan object

        const deletedDietPlan = await UserDietPlanModel.findOneAndDelete({
            clientId,
            planName,
        });

        if (!deletedDietPlan) {
            return errorResponse({
                error: "",
                message: "The diet plan is not found or it deleted already",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "Diet plan deleted successfully for the client",
            data: deletedDietPlan,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while deleting the diet plan",
        });
    }
}
