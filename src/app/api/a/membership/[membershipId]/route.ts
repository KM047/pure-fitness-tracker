import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import MembershipModel from "@/model/membership.model";
import { NextRequest } from "next/server";
import MonthlyMembershipModel from "@/model/monthlyMembership.model";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { membershipId: mongoose.Schema.Types.ObjectId } }
) {
    await dbConnect();

    try {
        // console.log(params.membershipId);

        // let membershipId: any = new ObjectId(Number(params.membershipId));

        if (!mongoose.Types.ObjectId.isValid(params.membershipId as any)) {
            // console.log("Invalid membership id");
        }

        // deleted first the monthly plans of the membership
        await MonthlyMembershipModel.deleteMany({
            membershipId:
                params.membershipId as unknown as mongoose.Schema.Types.ObjectId,
        });

        // console.log("Deleted monthly plans of the membership");

        const response = await MembershipModel.findByIdAndDelete(
            params.membershipId
        );

        if (!response) {
            return jsonResponse({
                success: false,
                message: "Membership not found or already deleted",
                status: 404,
            });
        }

        return jsonResponse({
            success: true,
            message: "Membership deleted successfully",
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error occurred while deleting the membership",
            status: 500,
        });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { membershipId: string } }
) {
    await dbConnect();

    try {
        const { data, isMembershipNameChanged } = await req.json();

        data.membershipPerks = data.membershipPerks
            .split(",")
            .map((perk: string) => perk.trim());

        const response = await MembershipModel.findByIdAndUpdate(
            params.membershipId,
            data,
            { new: true }
        );

        if (!response) {
            return jsonResponse({
                success: false,
                message: "Membership not found or already deleted",
                status: 404,
            });
        }

        // also changing in the monthly plans of the membership

        if (isMembershipNameChanged) {
            // console.log("Membership name changed");
            await MonthlyMembershipModel.updateMany(
                {
                    membershipId: params.membershipId,
                },
                {
                    name: data.membershipName,
                }
            );
        }

        return jsonResponse({
            success: true,
            message: "Membership updated successfully",
            data: response,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error occurred while updating the membership",
            status: 500,
        });
    }
}
