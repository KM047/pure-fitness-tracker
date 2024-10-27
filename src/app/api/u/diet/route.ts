import dbConnection from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function POST(request: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);

    const _user: User = session?.user as User;

    try {
    } catch (error) {
        console.log("Error while registering user", error);

        return Response.json(
            {
                success: false,
                message: "Error while updating the user membership",
            },
            {
                status: 500,
            }
        );
    }
}
