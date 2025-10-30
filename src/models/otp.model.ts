import { model, Schema, SchemaTimestampsConfig } from "mongoose";


export interface IOtp extends Document {
    otp: string,
    expiresAt: Date,
    purpose: "signup" | "login" | "password_reset",
    email: string,
    createdAt?: Date,
    updatedAt?: Date
}

const otpSchema = new Schema<IOtp>(
    {
        otp: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => /^\d{6}$/.test(value),
                message: "OTP must be a 6-digit number"
            }
        },
        purpose: {
            type: String,
            enum: ["signup", "login", "password_reset"],
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 5 * 60 * 1000)
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    },
    { timestamps: true }
)

export const OtpModel = model("Otp", otpSchema)