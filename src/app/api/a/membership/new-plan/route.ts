import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import MembershipModel from "@/model/membership.model";
import MonthlyMembershipModel from "@/model/monthlyMembership.model";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: unknown;
}

// route for creating the new membership plan for the customer
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

        if (user?.role != "ADMIN") {
            return jsonResponse({
                success: false,
                message:
                    "Unauthorized to access this route only an admin can access this route",
                status: 401,
            });
        }

        const formData = await request.formData();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        let perks = ["No perks"];

        // TODO: we need to extract the perks from the form data and also the plan details

        let planDets = [
            {
                duration: 3,
                price: 12000,
                currentOffer: 10000,
            },
            {
                duration: 6,
                price: 22000,
                currentOffer: 18000,
            },
            {
                duration: 12,
                price: 40000,

                currentOffer: 35000,
            },
        ];

        // insert the name in the planDets

        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                {
                    error: "Cloudinary credentials not found",
                },
                { status: 500 }
            );
        }

        const file = formData.get("file") as File;

        // if (!file) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "File not found",
        //         status: 400,
        //     });
        // }

        let result;

        if (file) {
            const bytes = await file.arrayBuffer();

            const buffer = Buffer.from(bytes);

            // upload the buffer to the cloudinary

            result = await new Promise<CloudinaryUploadResult>(
                (resolve, rejects) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "pure-fitness-tracker",
                        },
                        (error, result) => {
                            if (error) {
                                rejects(error);
                            } else {
                                resolve(result as CloudinaryUploadResult);
                            }
                        }
                    );

                    uploadStream.end(buffer);
                }
            );

            if (!result.url) {
                return NextResponse.json({
                    success: false,
                    message: "Error while uploading the file.",
                    status: 500,
                });
            }
        }

        const newPlan = await MembershipModel.create({
            membershipName: name,
            membershipDescription: description,
            membershipImage: result?.url,
            membershipPerks: perks,
        });

        if (!newPlan) {
            return NextResponse.json({
                success: false,
                message: "Error while creating the new plan",
                status: 500,
            });
        }

        // we need to add the name in the planDets for easy to find the plan name
        planDets = planDets.map((plan) => {
            return {
                ...plan,
                name,
                membershipId: new mongoose.Types.ObjectId(
                    newPlan._id as string
                ),
            };
        });

        const monthlyPlan = await MonthlyMembershipModel.insertMany(planDets);

        if (!monthlyPlan) {
            return NextResponse.json({
                success: false,
                message:
                    "Error while creating the monthly plans for the membership ",
                status: 500,
            });
        }

        // newPlan.plans = monthlyPlan;

        return jsonResponse({
            success: true,
            message: "Plan created successfully",
            status: 200,
            data: newPlan,
        });
    } catch (error) {

        return errorResponse({
            error,
            message: "Error while creating the new plan",
        });
    }
}

// This route is to update the membership plan of the user by userId
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
            membershipId,
            membershipName,
            membershipDescription,
            membershipPerks,
        } = await request.json();

        const existingMembership = await MembershipModel.findById(
            new mongoose.Types.ObjectId(membershipId)
        );

        if (!existingMembership) {
            return jsonResponse({
                success: false,
                message: "Membership not found",
                status: 404,
            });
        }

        // set the updated values and save the document

        existingMembership.membershipName = membershipName;
        existingMembership.membershipPerks = membershipPerks;
        existingMembership.membershipDescription = membershipDescription;

        await existingMembership.save({ validateBeforeSave: false });

        return jsonResponse({
            success: true,
            message: "Membership updated successfully",
            status: 200,
            data: existingMembership,
        });
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while updating the plan for the membership plans",
        });
    }
}
