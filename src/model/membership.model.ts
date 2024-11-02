// this model is for the membership info for the user
// in future I can take info or edit info in it

import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IMonthsPlan extends Document {
    name: string;
    duration: number;
    price: number;
    current_offer?: number;
}

const monthsPlanSchema: Schema<IMonthsPlan> = new Schema<IMonthsPlan>({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // Duration in months (e.g., 3, 6, 12)
        required: true,
    },
    price: {
        type: Number, // Price for this duration
        required: true,
    },
    current_offer: {
        type: Number, // Current offer price
        default: 0,
    },
});

export interface IMembership extends Document {
    membership_name: string;
    membership_description: string;
    membership_isAvailable: boolean;
    membership_plans: IMonthsPlan[];
    membership_image: string;
    membership_perks: string[];
}

const membershipSchema: Schema<IMembership> = new Schema<IMembership>({
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
        default: true,
    },
    membership_plans: [monthsPlanSchema],
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
