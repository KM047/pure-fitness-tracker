export async function GET(request: Request) {
    return Response.json(
        {
            success: true,
            messages: "✅ Server health is ok...",
        },
        {
            status: 200,
        }
    );
}
