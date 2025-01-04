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

        // const { pageSize, currentPage } = await request.json();
        const pageSize = 10;
        const currentPage = 1;

        const skip = (currentPage - 1) * pageSize;

        const pipeline = [
            // Step 1: Lookup to populate user details from User collection
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Step 2: Lookup to populate membership details from Membership collection
            {
                $lookup: {
                    from: "memberships",
                    localField: "membershipId",
                    foreignField: "_id",
                    as: "membershipInfo",
                },
            },
            {
                $unwind: {
                    path: "$membershipInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Step 3: Add a computed field for membership validity
            {
                $addFields: {
                    isMembershipValid: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$membershipStatus", true] },
                                    {
                                        $gte: [
                                            "$membershipEndDate",
                                            new Date(),
                                        ],
                                    },
                                    {
                                        $lte: [
                                            "$membershipStartDate",
                                            new Date(),
                                        ],
                                    },
                                ],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },

            // Step 4: Project the fields needed for the output
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

            // Step 5: Pagination - skip and limit for paginated results
            { $skip: skip },
            { $limit: pageSize },

            // Step 6: Group and count members by feeStatus
            {
                $group: {
                    _id: null,
                    totalMembers: { $sum: 1 },
                    feeNotPaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$feeStatus", "NOT_PAID"] }, 1, 0],
                        },
                    },
                    feeHalfPaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$feeStatus", "HALF"] }, 1, 0],
                        },
                    },
                    feeFullPaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$feeStatus", "FULL"] }, 1, 0],
                        },
                    },
                    paginatedData: { $push: "$$ROOT" }, // Store paginated data
                },
            },

            // Step 7: Final projection to shape the output
            {
                $project: {
                    _id: 0,
                    totalMembers: 1,
                    feeNotPaidCount: 1,
                    feeHalfPaidCount: 1,
                    feeFullPaidCount: 1,
                    paginatedData: 1,
                },
            },
        ];

        const registrationPipeline = [
            {
                $match: {
                    membershipStartDate: {
                        $gte: new Date(
                            new Date().setMonth(new Date().getMonth() - 6)
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$membershipStartDate" },
                        month: { $month: "$membershipStartDate" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $addFields: {
                    monthName: {
                        $arrayElemAt: [
                            [
                                "",
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ],
                            "$_id.month",
                        ],
                    },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
            {
                $project: {
                    monthName: 1,
                    year: "$_id.year",
                    count: 1,
                    _id: 0,
                },
            },
        ];

        // const membership = await UserMembershipModel.aggregate(pipeline);

        const [membership, registration] = await Promise.all([
            UserMembershipModel.aggregate(pipeline),
            // @ts-ignore
            UserMembershipModel.aggregate(registrationPipeline),
        ]);

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
            data: { membership, registration },
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error occurred while you fetching the membership plans",
            status: 500,
        });
    }
}
