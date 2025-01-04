import mongoose from "mongoose";

interface ConnectionConfig {
    isConnected?: number;
}

// Use a global variable to persist the connection state across calls
let globalConnection: ConnectionConfig = globalThis as any;
globalConnection.isConnected = globalConnection?.isConnected || 0;

async function dbConnect() {
    if (globalConnection.isConnected) {
        // console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL! || "");
        globalConnection.isConnected = db.connections[0].readyState;
        // console.log("DB connected successfully");
    } catch (error: any) {
        // console.log("Database connection failed");
        process.exit(1);
    }
}

export default dbConnect;
