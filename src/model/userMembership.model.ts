import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IUserMembership extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    membership_type: string;
    membership_status: boolean;
    membership_validity: number;
    membership_start_date: Date;
    membership_end_date: Date;
    membership_price: number;
}

const userMembershipSchema: Schema<IUserMembership> =
    new Schema<IUserMembership>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        membership_type: {
            type: String,
            required: true,
        },
        membership_status: {
            type: Boolean,
            required: true,
        },
        membership_validity: {
            type: Number,
            required: true,
        },
        membership_start_date: {
            type: Date,
            required: true,
        },
        membership_end_date: {
            type: Date,
            required: true,
        },
        membership_price: {
            type: Number,
            required: true,
        },
    });

const UserMembershipModel =
    models.UserMembership ||
    model<IUserMembership>("UserMembership", userMembershipSchema);

export default UserMembershipModel;
