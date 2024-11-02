import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { errorResponse, jsonResponse } from "@/helpers/responseUtils";
import dbConnect from "@/lib/dbConnect";
import MembershipModel from "@/model/membership.model";
import { v2 as cloudinary } from "cloudinary";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "path";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    await dbConnect();

    // code for creating the new membership plan for the customer

    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    try {
        const formData = await request.formData();

        // const {
        //     name,
        //     description = "",
        //     // perks = ["No perks"],
        //     // planDets,
        // } = await request.json();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        let perks = ["No perks"];

        let planDets = [
            {
                duration: 3,
                price: 12000,
                current_offer: 10000,
            },
            {
                duration: 6,
                price: 22000,
                current_offer: 18000,
            },
            {
                duration: 12,
                price: 40000,
                current_offer: 35000,
            },
        ];

        // insert the name in the planDets

        // we need to add the name in the planDets for easy to find the plan name
        planDets = planDets.map((plan) => {
            return {
                ...plan,
                name,
            };
        });

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

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({
                success: false,
                message: "File not found",
                status: 400,
            });
        }

        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        // upload the buffer to the cloudinary

        const result = await new Promise<CloudinaryUploadResult>(
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

        if (!result.public_id) {
            return NextResponse.json({
                success: false,
                message: "Error while uploading the file.",
                status: 500,
            });
        }

        // console.log("result -> ", result);

        // file uploaded successfully

        // save the plan in the database

        const newPlan = await MembershipModel.create({
            membership_name: name,
            membership_description: description,
            membership_image: result.url,
            membership_plans: planDets,
            membership_perks: perks,
        });

        console.log("New plan created successfully", newPlan);
        if (!newPlan) {
            return NextResponse.json({
                success: false,
                message: "Error while creating the new plan",
                status: 500,
            });
        }

        return jsonResponse({
            success: true,
            message: "Plan created successfully",
            status: 200,
            data: newPlan,
        });
    } catch (error) {
        // console.log("Error while creating the new plan", error);

        return errorResponse({
            error,
            message: "Error while creating the new plan",
        });
    }
}
