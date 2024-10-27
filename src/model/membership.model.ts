// this model is for the membership info for the user
// in future I can take info or edit info in it

import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IMembership extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    membership_name: string;
    membership_description: string;
    membership_isAvailable: boolean;
    membership_validity: number;
    membership_price: number;
    membership_current_offer: number; // this will add in easy to handle the offers in future
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
    membership_validity: {
        type: Number,
        required: true,
    },
    membership_price: {
        type: Number,
        required: true,
    },
    membership_current_offer: {
        type: Number,
        required: true,
    },
});

const membershipModel =
    (models.Membership as Model<IMembership>) ||
    model<IMembership>("Membership", membershipSchema);

export default membershipModel;
