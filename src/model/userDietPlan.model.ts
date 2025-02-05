import mongoose, { Schema, Model } from "mongoose";

interface IMeal {
    name: string;
    items: { foodItem: string; quantity: string; instructions?: string }[];
    calories?: number;
    macros?: { protein: number; carbs: number; fats: number };
}

interface IDietPlan {
    clientId: mongoose.Schema.Types.ObjectId;
    planName: string;
    meals: {
        breakfast: IMeal;
        lunch: IMeal;
        dinner: IMeal;
        preWorkout: IMeal;
        postWorkout: IMeal;
    };

    notes: string;
    type: string;
}

const mealSchema = new Schema({
    name: { type: String, required: true },
    items: [
        {
            foodItem: { type: String, required: true },
            quantity: { type: String, required: true },
            instructions: { type: String },
        },
    ],
    calories: Number,
    macros: {
        protein: Number,
        carbs: Number,
        fats: Number,
    },
});

const clientDietPlanSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
        planName: { type: String, required: true },
        meals: {
            breakfast: mealSchema,
            preWorkout: mealSchema,
            postWorkout: mealSchema,
            lunch: mealSchema,
            dinner: mealSchema,
        },
        notes: { type: String },
        type: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const UserDietPlanModel: Model<IDietPlan> =
    mongoose.models.DietPlan ||
    mongoose.model<IDietPlan>("DietPlan", clientDietPlanSchema);
export default UserDietPlanModel;
