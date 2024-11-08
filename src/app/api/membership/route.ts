import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import MembershipModel from "@/model/membership.model";
import UserMembershipModel, {
    IUserMembership,
} from "@/model/userMembership.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import MonthlyMembershipModel from "@/model/monthlyMembership.model";

// This route is for the adding the membership to the client by client it self
export async function POST(request: NextRequest) {
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

        const {
            monthlyPlanId,
            duration,
            startedFrom = new Date(),
            planFee,
        } = await request.json();

        // in this you can get the monthlyPlanId from that you could get the all details
        // or you can send the all the details directly that you couldn't send another request to getting the months plan

        const membershipPlan = await MonthlyMembershipModel.findById(
            monthlyPlanId
        );

        if (!membershipPlan) {
            return jsonResponse({
                success: false,
                message: "Membership not found",
                status: 400,
            });
        }

        // Calculate membershipEndDate based on membershipStartDate and duration
        const calculateEndDate = (startDate: Date, months: number): Date => {
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + months);
            return endDate;
        };

        const exitingUserMembership: IUserMembership | null =
            await UserMembershipModel.findOne({
                userId: user._id,
            });

        if (exitingUserMembership) {
            // Update existing membership
            if (exitingUserMembership.monthlyPlanId != monthlyPlanId) {
                exitingUserMembership.monthlyPlanId = monthlyPlanId;
            }

            exitingUserMembership.membershipValidity = duration;
            exitingUserMembership.membershipStatus = true;
            exitingUserMembership.membershipStartDate = startedFrom;
            exitingUserMembership.membershipEndDate = calculateEndDate(
                startedFrom,
                duration
            ); // Set end date
            exitingUserMembership.actualFee = planFee;

            await exitingUserMembership.save();

            return jsonResponse({
                success: true,
                message: "User membership updated",
                status: 200,
                data: exitingUserMembership,
            });
        } else {
            // Create new user membership
            const newUserMembership = new UserMembershipModel({
                userId: user._id,
                monthlyPlanId,
                membershipValidity: duration,
                membershipStatus: true,
                membershipStartDate: startedFrom,
                membershipEndDate: calculateEndDate(startedFrom, duration), // Set end date
                actualFee: planFee,
            });

            await newUserMembership.save();

            return jsonResponse({
                success: true,
                message: "User membership created",
                status: 200,
                data: newUserMembership,
            });
        }
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while adding user membership",
            status: 500,
        });
    }
}

export async function GET(request: Request) {
    await dbConnect();

    try {
        const pipeline = [];

        const memberships = await MembershipModel.aggregate([
            {
                $lookup: {
                    from: "monthsplans", // The MongoDB collection name for monthly plans
                    localField: "_id", // The field in the Membership model
                    foreignField: "membershipId", // The field in MonthlyPlan that references Membership
                    as: "plans", // Alias for the joined data
                },
            },
            // {
            //     $unwind: "$plans",
            // },
            {
                $project: {
                    membershipName: 1,
                    membershipDescription: 1,
                    membershipIsAvailable: 1,
                    membershipPerks: 1,
                    membershipImage: 1,
                    plans: {
                        $map: {
                            input: "$plans",
                            as: "plan",
                            in: {
                                _id: "$$plan._id",
                                name: "$$plan.name",
                                duration: "$$plan.duration",
                                price: "$$plan.price",
                                currentOffer: "$$plan.currentOffer",
                            },
                        },
                    },
                },
            },
        ]);

        if (!memberships) {
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
