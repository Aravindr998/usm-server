import { OtpModel } from "../models/otp.model"
import { OtpSchema } from "../types/models.types"

export const saveOtp = async (data: OtpSchema) => {
    const otpModel = new OtpModel(data)
    return otpModel.save()
}

export const getOtp = async (email: string) => {
    const requiredOtp = await OtpModel.findOne({email})
    return requiredOtp
}

export const updateOtp = async (email: string, otp: string) => {
    const updatedOtp = await OtpModel.findOneAndUpdate({email}, {otp}, {new: true, upsert: false})
    return updatedOtp
}