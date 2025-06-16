import mongoose from "mongoose";
import { DownloadStats as DownloadStatsType } from "../../types";

const downloadStatsSchema = new mongoose.Schema<DownloadStatsType>({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
    unique: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
});

export const DownloadStats = mongoose.model<DownloadStatsType>("DownloadStats", downloadStatsSchema);
