import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
    const session = await getServerSession(authOptions);

    const _user = session?.user as User;

    console.log("_user -> ", _user);

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

    return Response.json({
        success: true,
        data: _user,
        status: 200,
    });
}
