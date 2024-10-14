import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string;
    role: "ADMIN" | "CLIENT";
    phone: string;
    email: string;
    password: string;
    googleId?: string;
    loginType: "EMAIL" | "GOOGLE";
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: ["ADMIN", "CLIENT"],
            default: "CLIENT",
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
        },
        googleId: {
            type: String,
        },
        loginType: {
            type: String,
            required: [true, "Login type is required"],
            enum: ["EMAIL", "GOOGLE"],
            default: "EMAIL",
        },
        verifyCode: {
            type: String,
            required: [true, "Verify code is required"],
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, "Verify code expiry is required"],
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel =
    (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);

export default UserModel;
