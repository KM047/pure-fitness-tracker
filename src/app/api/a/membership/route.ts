import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

import MembershipModel from "@/model/membership.model";
import UserMembershipModel, {
    IUserMembership,
} from "@/model/userMembership.model";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import { NextRequest } from "next/server";

// this route only get the details about the subscribed user memberships

export async function GET(request: NextRequest) {
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

        /**
         * Make the aggregate query that where the it gives the result like user some info and he
         * has some membership or not its starting date and ending date
         * the validity of the membership
         *
         */

        const pipeline = [
            // Step 1: Lookup to populate user details from User collection
            {
                $lookup: {
                    from: "users", // The collection to join (Users)
                    localField: "userId", // Field from the current collection
                    foreignField: "_id", // Field from Users collection
                    as: "userInfo", // Output array field for user information
                },
            },

            // Step 2: Unwind userInfo array to make each user info a separate document
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Step 3: Lookup to populate membership details from Membership collection
            {
                $lookup: {
                    from: "memberships", // The collection to join (Memberships)
                    localField: "membershipId", // Field from the current collection
                    foreignField: "_id", // Field from Memberships collection
                    as: "membershipInfo", // Output array field for membership information
                },
            },

            // Step 4: Unwind membershipInfo array to make each membership info a separate document
            {
                $unwind: {
                    path: "$membershipInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Step 5: Add a computed field for membership validity
            {
                $addFields: {
                    isMembershipValid: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$membershipStatus", true] }, // Membership status must be true
                                    {
                                        $gte: [
                                            "$membershipEndDate",
                                            new Date(),
                                        ],
                                    }, // endDate >= today
                                    {
                                        $lte: [
                                            "$membershipStartDate",
                                            new Date(),
                                        ],
                                    }, // startDate <= today
                                ],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },

            {
                $project: {
                    "userInfo.name": 1,
                    "userInfo.email": 1,
                    membershipStatus: 1,
                    membershipValidity: 1,
                    membershipStartDate: 1,
                    membershipEndDate: 1,
                    isMembershipValid: 1,
                    feePaid: 1,
                    actualFee: 1,
                    feeStatus: 1,
                },
            },
        ];

        const membership = await UserMembershipModel.aggregate(pipeline);

        if (membership.length == 0) {
            return jsonResponse({
                success: false,
                message: "No membership plans found",
                data: null,
            });
        }

        return jsonResponse({
            success: true,
            message: "The membership plans fetched successfully",
            data: membership,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error occurred while you fetching the membership plans",
            status: 500,
        });
    }
}
