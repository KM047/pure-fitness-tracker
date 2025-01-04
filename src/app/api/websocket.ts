import { NextApiRequest, NextApiResponse } from "next";
import MembershipModel from "@/model/membership.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { jsonResponse } from "@/helpers/responseUtils";
import WebSocket from "ws";

const wss = new WebSocket.Server({ noServer: true });

const broadcast = (data: any) => {
    wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on("connection", async (ws: any) => {
    // console.log("New client connected");

    // Connect to MongoDB and fetch membership data
    await dbConnect();

    // Fetch all memberships from the database and send them on connection
    const memberships = await MembershipModel.find()
        .sort({ timestamp: -1 })
        .lean();
    ws.send(JSON.stringify({ type: "initialData", data: memberships }));

    // Handle new subscriptions
    ws.on("message", async (message: any) => {
        const newSubscription = JSON.parse(message);

        if (newSubscription.type === "newSubscription") {
            const { clientId, membershipStatus } = newSubscription.data;
            const newMembership = new MembershipModel({
                clientId,
                membershipStatus,
                timestamp: new Date().toISOString(),
            });

            // Save the new subscription to the database
            await newMembership.save();

            // Fetch updated membership data
            const updatedMemberships = await MembershipModel.find()
                .sort({ timestamp: -1 })
                .lean();

            // Broadcast the updated list
            broadcast({ type: "new", data: updatedMemberships });
        }
    });

    ws.on("close", () => {
        // console.log("Client disconnected");
    });
});

async function GET(request: NextRequest) {
    return jsonResponse({
        success: true,
        message: "✅ WebSocket connection established",
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
