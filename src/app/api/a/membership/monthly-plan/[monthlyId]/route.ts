import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";

import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import { NextRequest } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/options";
import MonthlyMembershipModel from "@/model/monthlyMembership.model";

// this route is accepted user membership by admin only

export async function PUT(
    request: NextRequest,
    { params }: { params: { monthlyId: string } }
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

        if (user?.role != "ADMIN") {
            return jsonResponse({
                success: false,
                message:
                    "Unauthorized to access this route only an admin can access this route",
                status: 401,
            });
        }

        const { duration, price, currentOffer } = await request.json();

        const monthlyPlanId = params.monthlyId;

        const existingMonthlyMembershipPlan =
            await MonthlyMembershipModel.findByIdAndUpdate(
                monthlyPlanId,
                {
                    membershipStatus: true,
                    duration,
                    price,
                    currentOffer,
                },
                { new: true }
            );

        if (!existingMonthlyMembershipPlan) {
            return errorResponse({
                error: "Monthly membership plan not found",
                message: "Plan not found",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "Monthly membership plan updated successfully",
            data: existingMonthlyMembershipPlan,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while updating the monthly membership plan",
            status: 500,
        });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { monthlyId: string } }
) {
    await dbConnect();

    try {
        const deletedMonthlyMembershipPlan =
            await MonthlyMembershipModel.findByIdAndDelete(params.monthlyId);

        if (!deletedMonthlyMembershipPlan) {
            return errorResponse({
                error: "Monthly membership plan not found",
                message: "Plan not found",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "Monthly membership plan deleted successfully",
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while deleting the monthly membership plan",
            status: 500,
        });
    }
}
