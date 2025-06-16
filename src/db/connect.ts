import mongoose from "mongoose";
import { config } from "../config";

export async function connectDB(){
    try{
        console.log("Connecting to MongoDB...");
        await mongoose.connect(config.MongoDBURI!);
        console.log("Connected to MongoDB successfully!");
    }catch(err){
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}