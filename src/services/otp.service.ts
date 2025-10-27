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