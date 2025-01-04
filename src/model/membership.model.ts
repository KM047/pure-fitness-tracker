// this model is for the membership info for the user
// in future I can take info or edit info in it

import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IMembership extends Document {
    membershipName: string;
    membershipDescription: string;
    membershipIsAvailable: boolean;
    membershipImage?: string;
    membershipPerks: string[];
}

const membershipSchema: Schema<IMembership> = new Schema<IMembership>(
    {
        membershipName: {
            type: String,
            required: true,
        },
        membershipDescription: {
            type: String,
            required: true,
        },
        membershipIsAvailable: {
            type: Boolean,
            required: true,
            default: true,
        },
        membershipPerks: {
            type: [String],
        },

        membershipImage: {
            type: String,
            default: "https://placehold.co/600x400",
        },
    },
    {
        timestamps: true,
    }
);

const MembershipModel =
    (models.Membership as Model<IMembership>) ||
    model<IMembership>("Membership", membershipSchema);

export default MembershipModel;
