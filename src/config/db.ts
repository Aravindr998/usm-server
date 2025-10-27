import mongoose from "mongoose"
import { ENV } from "./env"
import { logger } from "../utils/logger"

const MONGODB_URI = ENV.MONGODB_URI

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI)
    logger.success("MongoDB connected successfully")
  } catch (err) {
    logger.error("MongoDB connection failed", err)
    process.exit(1)
  }
}
