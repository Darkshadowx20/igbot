import mongoose from "mongoose";
import { UserDocument } from "../../types";

const userSchema = new mongoose.Schema<UserDocument>({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type: String,
        required: false,
        unique: false,
        default: null
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    referrer: {
        type: String,
        required: false,
        unique: false,
        default: null
    },
    role: {
        type: String,
        required: true,
        unique: false,
        default: "user",
        enum: ["user","admin","mod"]
    }
});

export const User = mongoose.model<UserDocument>("User", userSchema);