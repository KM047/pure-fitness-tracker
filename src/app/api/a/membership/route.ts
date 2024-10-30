import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { IUser } from "@/model/auth/user.model";

import MembershipModel from "@/model/membership.model";
import UserMembershipModel, {
    IUserMembership,
} from "@/model/userMembership.model";

export async function POST(request: Request) {
    await dbConnect();

    // code for the adding the membership of the user

    const { _id, membershipId, duration, startedFrom } = await request.json();

    try {
        const session = await getServerSession(authOptions);

        const user = session?.user as User;

        if (!session || !user) {
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

        if (user?.role != "ADMIN") {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const membership = await MembershipModel.findById(membershipId);

        if (!membership) {
            return Response.json(
                {
                    success: false,
                    message: "Membership not found",
                },
                {
                    status: 400,
                }
            );
        }

        const userMembership: IUserMembership | null =
            await UserMembershipModel.findOne({
                userId: _id,
            });

        // what if I update the membership of that id but it doesn't exist then i will create that
        if (userMembership) {
            // this shows that it has already membership so update it

            if (userMembership.membershipId != membershipId) {
                userMembership.membershipId = membershipId;
            }

            userMembership.membership_validity = duration;
            userMembership.membership_status = true;
            userMembership.membership_start_date = startedFrom;

            userMembership.save();

            return Response.json(
                {
                    success: true,
                    message: "User membership updated",
                },
                {
                    status: 200,
                }
            );
        } else {
            // create the user membership
            const newUserMembership = new UserMembershipModel({
                userId: _id,
                membershipId: membershipId,
                membership_validity: duration,
                membership_status: true,
                membership_start_date: startedFrom,
            });

            newUserMembership.save();

            return Response.json(
                {
                    success: true,
                    message: "User membership created",
                },
                {
                    status: 200,
                }
            );
        }

        // if the user already has membership
    } catch (error) {
        console.log(error);

        console.log("Error while adding user membership", error);

        return Response.json(
            {
                success: false,
                message: "Error while adding user membership",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if (!session || !user) {
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

    if (user?.role != "ADMIN") {
        return Response.json(
            {
                success: false,
                message: "Unauthorized to access this route",
            },
            {
                status: 401,
            }
        );
    }

    return Response.json(
        {
            success: true,
            messages: "✅ this route only access the admin",
        },
        {
            status: 200,
        }
    );
}
