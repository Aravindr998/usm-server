import { OtpModel } from "../models/otp.model";
import { OtpSchema } from "../types/models.types";
import { generateOtp } from "../utils/common";
import { sendMail } from "./email.service";

export const saveOtp = async (data: OtpSchema) => {
  const otpModel = new OtpModel(data);
  return otpModel.save();
};

export const getOtp = async (email: string) => {
  const requiredOtp = await OtpModel.findOne({ email });
  return requiredOtp;
};

export const updateOtp = async (email: string, otp: string) => {
  const updatedOtp = await OtpModel.findOneAndUpdate({ email }, { otp }, { new: true, upsert: false });
  return updatedOtp;
};

export const deleteOtp = async (email: string) => {
  await OtpModel.deleteOne({ email });
};

export const sendOtp = async (email: string) => {
  const otp = generateOtp().toString();
  await sendMail({
    to: email,
    subject: "OTP for email verification",
    text: `Your OTP for email verification is ${otp}`,
  });
  const otpSchema = {
    otp,
    email: email,
    purpose: "signup",
  } as OtpSchema;
  await saveOtp(otpSchema);
};
