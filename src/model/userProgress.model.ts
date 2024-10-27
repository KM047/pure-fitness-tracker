import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IUserProgress extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    level: number;
    currentWeight: number | undefined;
    weightHistory: number[];
    height: number;
}

const UserProgressSchema: Schema<IUserProgress> = new Schema<IUserProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        level: {
            type: Number,
            required: true,
        },
        currentWeight: {
            type: Number,
            required: true,
        },
        weightHistory: {
            type: [Number],
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const UserProgressModel =
    (models.UserProgress as Model<IUserProgress>) ||
    model<IUserProgress>("UserProgress", UserProgressSchema);

export default UserProgressModel;
