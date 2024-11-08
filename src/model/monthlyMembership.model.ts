import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IMonthsPlan extends Document {
    name: string;
    membershipId: Schema.Types.ObjectId;
    duration: number;
    price: number;
    currentOffer?: number;
}

const monthlyPlanSchema: Schema<IMonthsPlan> = new Schema<IMonthsPlan>(
    {
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
        currentOffer: {
            type: Number, // Current offer price
            default: 0,
        },
        membershipId: {
            type: Schema.Types.ObjectId,
            ref: "Membership",
        },
    },
    {
        timestamps: true,
    }
);

const MonthlyMembershipModel: Model<IMonthsPlan> =
    models.MonthsPlan || model<IMonthsPlan>("MonthsPlan", monthlyPlanSchema);

export default MonthlyMembershipModel;
