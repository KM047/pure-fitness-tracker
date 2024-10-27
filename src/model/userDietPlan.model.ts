import { Document, Schema } from "mongoose";

export interface IUserDietPlan extends Document {
    userId: Schema.Types.ObjectId;
    plan_name: string;
    plan_details: string;
}
