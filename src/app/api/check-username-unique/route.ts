import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/auth/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnection();

    try {
        const { searchParams } = new URL(request.url);

        const queryParams = {
            username: searchParams.get("username"),
        };

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];

            return Response.json(
                {
                    success: false,
                    message:
                        usernameError?.length > 0
                            ? usernameError.join(", ")
                            : "Invalid query parameters",
                },
                {
                    status: 400,
                }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error checking username");

        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500,
            }
        );
    }
}
