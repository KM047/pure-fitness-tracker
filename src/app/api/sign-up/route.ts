import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/auth/user.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { errorResponse } from "@/helpers/responseUtils";

export async function POST(request: Request) {
    await dbConnection();

    try {
        const { name, username, phone, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: true,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with the same email",
                    },
                    {
                        status: 500,
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );

                await existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                name,
                username,
                phone,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });

            await newUser.save();
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully and please verify your email",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return errorResponse({
            error,
            message: "Error while registering user",
            status: 500,
        });
    }
}
