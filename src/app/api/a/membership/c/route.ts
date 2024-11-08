import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";

import UserMembershipModel from "@/model/userMembership.model";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import { NextRequest } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/options";

// this route is accepted user membership by admin only

export async function PUT(request: NextRequest) {
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

        const {
            userMembershipId,
            feePaid = 0,
            feeStatus = "UNPAID",
        } = await request.json();

        const existingUserMembership =
            await UserMembershipModel.findByIdAndUpdate(
                userMembershipId,
                {
                    membershipStatus: true,
                    feePaid,
                    feeStatus,
                },
                { new: true }
            ).select("-__v -createdAt -updatedAt ");

        if (!existingUserMembership) {
            return errorResponse({
                error: "User membership not found",
                message: "User membership not found",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "User membership updated successfully",
            data: existingUserMembership,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while updating the user membership",
            status: 500,
        });
    }
}
