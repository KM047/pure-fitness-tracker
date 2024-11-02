import dbConnection from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/auth/user.model";
import UserProgressModel from "@/model/userProgress.model";
import { exit } from "process";
import { number } from "zod";

export async function GET(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);

    const _user: User = session?.user as User;

    // console.log("_user -> ", _user);

    if (!session || !_user) {
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

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        // fetching the user progress by userId

        const userProgress = await UserProgressModel.aggregate([
            {
                $match: { userId: userId },
            },
            {
                $addFields: {
                    // Reverse the last 12 elements in weightHistory
                    reversedWeightHistory: {
                        $reverseArray: { $slice: ["$weightHistory", -12] },
                    },
                },
            },
            {
                $addFields: {
                    weightHistory: {
                        $map: {
                            input: "$reversedWeightHistory",
                            as: "weight",
                            in: {
                                weight: "$$weight",
                                month: {
                                    $dateToString: {
                                        format: "%B %Y",
                                        date: {
                                            $dateAdd: {
                                                startDate: "$updatedAt",
                                                unit: "month",
                                                amount: {
                                                    $multiply: [
                                                        -1, // Move backward
                                                        {
                                                            $indexOfArray: [
                                                                {
                                                                    $slice: [
                                                                        "$reversedWeightHistory",
                                                                        -12,
                                                                    ],
                                                                },
                                                                "$$weight",
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    level: 1,
                    currentWeight: 1,
                    weightHistory: 1, // Modified weight history with months
                    height: 1,
                    updatedAt: 1,
                },
            },
        ]);

        if (!userProgress) {
            return Response.json(
                {
                    success: false,
                    message: "User progress not found",
                },
                {
                    status: 404,
                }
            );
        }

        // reverse the array in the userProgress weightHistory
        userProgress[0]?.weightHistory.reverse();

        return Response.json({
            success: true,
            data: userProgress,
            status: 200,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error while getting the progress of user" + error,
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);

    const _user: User = session?.user as User;

    if (!session || !_user) {
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

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        // code for the adding the progress of the user

        const { weight, height } = await request.json();

        const existingUserProgress = await UserProgressModel.findOne({
            userId: userId,
        });

        if (existingUserProgress) {
            existingUserProgress.weightHistory.push(weight);
            existingUserProgress.weightHistory =
                existingUserProgress.weightHistory.slice(-12);
            existingUserProgress.currentWeight = weight;
            existingUserProgress.height = height;
            await existingUserProgress.save();
        } else {
            const newUserProgress = new UserProgressModel({
                userId: userId,
                level: 0,
                currentWeight: weight,
                weightHistory: [weight],
                height: height,
            });
            await newUserProgress.save();
        }

        return Response.json(
            {
                success: true,
                message: "User progress added successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Error while registering user", error);

        return Response.json(
            {
                success: false,
                message: "Error while updating the progress of user",
            },
            {
                status: 500,
            }
        );
    }
}
