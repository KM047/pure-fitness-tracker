import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import DietTemplateModel from "@/model/dietPlanTemplate.model";
import { NextRequest } from "next/server";

// creating a new diet plan template for the client
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

        const { templateName, meals, notes, type } = await request.json();

        const newDietPlanTemplate = await DietTemplateModel.create({
            templateName,
            type,
            meals,
            notes,
        });

        if (!newDietPlanTemplate) {
            throw new Error("Error while creating the new diet plan template");
        }

        return jsonResponse({
            success: true,
            message: "New diet plan template is created successfully",
            data: newDietPlanTemplate,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while assigning diet to the client.",
        });
    }
}

// getting the all the diet plan templates
export async function GET(request: NextRequest) {
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
            return Response.json(
                {
                    success: false,
                    message:
                        "Not authorized to access this route. only can an admin can access this route.",
                },
                {
                    status: 401,
                }
            );
        }

        const allDietPlanTemplates = await DietTemplateModel.find({}).select(
            "-__v -createdAt -updatedAt"
        );

        if (!allDietPlanTemplates) {
            throw new Error("Error while creating the new diet plan template");
        }

        return jsonResponse({
            success: true,
            message: "All diet plan template is fetched successfully",
            data: allDietPlanTemplates,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while assigning diet to the client.",
        });
    }
}

// we need to route that update this template
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

        const { templateId, templateName, type, meals, notes } =
            await request.json();

        const existedDietPlanTemplate =
            await DietTemplateModel.findOneAndUpdate(
                { _id: templateId },
                {
                    templateName,
                    type,
                    meals,
                    notes,
                },
                {
                    new: true,
                }
            ).select("-__v -createdAt -updatedAt");

        if (!existedDietPlanTemplate) {
            throw new Error("Error while updating the diet plan template");
        }

        return jsonResponse({
            success: true,
            message: "Diet plan template is updated successfully",
            data: existedDietPlanTemplate,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while assigning diet to the client.",
            status: 500,
        });
    }
}

// we need to route that delete this template

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

        const { templateId } = await request.json();
        // in this i can get direct the _id of the userDietPlan object

        const deletedDietPlan = await DietTemplateModel.findByIdAndDelete(
            templateId
        );

        if (!deletedDietPlan) {
            return errorResponse({
                error: "",
                message:
                    "The diet plan template is not found or it deleted already",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "Diet plan template deleted successfully.",
            data: deletedDietPlan,
            status: 200,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while deleting the diet plan template",
        });
    }
}
