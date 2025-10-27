import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error: ", err.message)
  if (err.status) {
    return res.status(err.status).json({
        success: false,
        message: err.message || "Internal Server Error",
    })
  }
  
  if (err instanceof mongoose.Error) {
    const field = Object.keys((err as any).keyValue || {})[0]
    return res.status(400).json({
      success: false,
      message: err.message || `${field} already exists`,
    })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    })
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
}
