import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB connected");
};
