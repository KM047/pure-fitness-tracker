import mongoose, { Document, Schema, Model } from "mongoose";

interface TemplateMeal {
    name: string;
    items: { foodItem: string; quantity: string }[];
    calories?: number;
    macros?: { protein: number; carbs: number; fats: number };
}

interface DietTemplate extends Document {
    templateName: string;
    type: string; // e.g., "Weight Loss", "Muscle Gain"
    meals: {
        breakfast: TemplateMeal;
        preWorkout?: TemplateMeal;
        postWorkout?: TemplateMeal;
        lunch: TemplateMeal;
        dinner: TemplateMeal;
    };
    notes?: string;
}

const dietTemplateSchema = new Schema(
    {
        templateName: { type: String, required: true },
        type: { type: String, required: true },
        meals: {
            breakfast: { type: Object, required: true },
            preWorkout: { type: Object },
            postWorkout: { type: Object },
            lunch: { type: Object, required: true },
            dinner: { type: Object, required: true },
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

const DietTemplateModel: Model<DietTemplate> =
    mongoose.models.DietTemplate ||
    mongoose.model<DietTemplate>("DietTemplate", dietTemplateSchema);
export default DietTemplateModel;
