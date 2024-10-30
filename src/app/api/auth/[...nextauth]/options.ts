import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/auth/user.model";
import client from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnection();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    console.log("user with credentials -> ", user);

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "Please verify your account first before login"
                        );
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (isPasswordCorrect) {
                        console.log("password is correct ");

                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }
                } catch (error: any) {
                    console.log("error -> ", error);
                    throw new Error(error);
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    adapter: MongoDBAdapter(client),

    callbacks: {
        async signIn({ user, account }): Promise<any> {
            await dbConnection();
            if (account?.provider === "google") {
                try {
                    const existingUser = await UserModel.findOne({
                        email: user.email,
                    });

                    // console.log("User -> ", user);
                    // console.log("account -> ", account);
                    // console.log("Profile -> ", profile);
                    // console.log("existingUser -> ", existingUser);

                    if (existingUser) {
                        if (existingUser.googleId) {
                            user.id = existingUser._id?.toString() as string;

                            return user; // Sign in successful
                        }
                        // existingUser.googleId = user.id; // Link Google ID
                        // await existingUser.save();
                        // return user; // Sign in successful
                    }
                    const newUser = new UserModel({
                        name: user.name,
                        username: user.email,
                        loginType: "GOOGLE",
                        googleId: user.id,
                        email: user.email,
                        isVerified: true,
                        role: "CLIENT",
                    });

                    await newUser.save();
                    user._id = newUser._id?.toString();
                    return user; // Sign in successful
                } catch (error) {
                    console.log(error);
                }
            } else if (account?.provider === "credentials") {
                // Allow sign-in for credentials if authorize() succeeded
                return true;
            }
        },

        async jwt({ token, user }) {
            console.log("user", user);

            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.role = user.role;
            }

            console.log("token -> ", token);

            return token;
        },
        async session({ session, token }) {
            console.log("user", token);
            if (token) {
                session.user._id = token._id || token?.sub;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.role = token.role;
            }

            console.log("session -> ", session);

            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
