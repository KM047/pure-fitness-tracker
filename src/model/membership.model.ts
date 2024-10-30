// this model is for the membership info for the user
// in future I can take info or edit info in it

import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IMembership extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    membership_name: string;
    membership_description: string;
    membership_isAvailable: boolean;
    membership_plans: {
        duration: number;
        price: number;
        current_offer: number;
    };
    membership_image: string;
    membership_perks: string[];
}

const membershipSchema: Schema<IMembership> = new Schema<IMembership>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    membership_name: {
        type: String,
        required: true,
    },
    membership_description: {
        type: String,
        required: true,
    },
    membership_isAvailable: {
        type: Boolean,
        required: true,
    },
    membership_plans: [
        {
            duration: {
                type: Number, // Duration in months (e.g., 3, 6, 12)
                required: true,
            },
            price: {
                type: Number, // Price for this duration
                required: true,
            },
            current_offer: {
                type: Number,
                default: 0, // Any offer specific to this plan
            },
        },
    ],
    membership_image: {
        type: String,
    },
    membership_perks: {
        type: [String],
    },
});

const MembershipModel =
    (models.Membership as Model<IMembership>) ||
    model<IMembership>("Membership", membershipSchema);

export default MembershipModel;
