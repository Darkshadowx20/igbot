import mongoose from "mongoose";
import { ActiveUserDocument } from "../../types";

const activeSchema = new mongoose.Schema<ActiveUserDocument>({
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
    lastActive: {
        type: Date,
        default: Date.now
    },
    downloads: {
        type: Number,
        default: 0
    }
});

export const activeUsers = mongoose.model<ActiveUserDocument>("Active", activeSchema);