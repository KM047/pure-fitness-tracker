import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IUserMembership extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    monthlyPlanId: mongoose.Schema.Types.ObjectId;
    membershipStatus: boolean;
    membershipValidity: number;
    membershipStartDate?: Date;
    membershipEndDate?: Date;
    feePaid: number;
    actualFee?: number;
    feeStatus?: "UNPAID" | "HALF" | "PAID";
}

const userMembershipSchema: Schema<IUserMembership> =
    new Schema<IUserMembership>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            monthlyPlanId: {
                // this is the id of the membership plan
                type: Schema.Types.ObjectId,
                ref: "MonthsPlan",
            },
            membershipStatus: {
                type: Boolean,
                required: true,
                default: false,
            },
            membershipValidity: {
                type: Number,
                required: true,
            },
            membershipStartDate: {
                type: Date,
                required: true,
            },
            membershipEndDate: {
                type: Date,
                required: true,
            },
            feePaid: {
                // this amount where user paid to admin
                type: Number,
                default: 0,
            },
            actualFee: {
                type: Number,
                default: 0,
            },
            feeStatus: {
                type: String,
                enum: ["UNPAID", "HALF", "PAID"],
                default: "UNPAID",
            },
        },
        {
            timestamps: true,
        }
    );

const UserMembershipModel =
    models.UserMembership ||
    model<IUserMembership>("UserMembership", userMembershipSchema);

export default UserMembershipModel;
