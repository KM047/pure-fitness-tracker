import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IUserMembership extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    membershipId: mongoose.Schema.Types.ObjectId;
    membership_status: boolean;
    membership_validity: number;
    membership_start_date?: Date;
    membership_end_date?: Date;
}

const userMembershipSchema: Schema<IUserMembership> =
    new Schema<IUserMembership>({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        membershipId: {
            type: Schema.Types.ObjectId,
            ref: "Membership",
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
    });

// this pre middleware will set the membership_end_date based on membership_validity
userMembershipSchema.pre("save", function (next: any) {
    // Only set dates if this is a new document or the membershipId has changed
    if (this.isNew || this.isModified("membershipId")) {
        if (this.membership_start_date && this.membership_validity) {
            const startDate = new Date(this.membership_start_date);
            startDate.setMonth(startDate.getMonth() + this.membership_validity);
            this.membership_end_date = startDate;
        }
    }
    next();
});

const UserMembershipModel =
    models.UserMembership ||
    model<IUserMembership>("UserMembership", userMembershipSchema);

export default UserMembershipModel;
