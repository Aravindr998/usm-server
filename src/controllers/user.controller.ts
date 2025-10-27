import { NextFunction, Request, Response } from "express"
import { createUser, getAllUsers, UserInput } from "../services/user.service"
import { userFormItems } from "../models/user.model"
import { validateAlphaNumeric, validateEmail, validateFormEntryBody } from "../utils/validation"
import { generateOtp } from "../utils/common"
import { sendMail } from "../services/email.service"
import { getOtp, saveOtp } from "../services/otp.service"
import { OtpSchema } from "../types/models.types"

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsers()
        res.json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {obj: user, formError} = validateFormEntryBody(_req.body, userFormItems)
    if (Object.keys(formError).length) {
      const error: Record<string, any> = { message: formError }
      error.status = 400
      return next(error)
    }
    const savedUser = await createUser(user as UserInput)
    res.status(201).json({ success: true, user: savedUser })
    const otp = generateOtp().toString()
    await sendMail({
      to: savedUser.email,
      subject: "OTP for email verification",
      text: `Your OTP for email verification is ${otp}`
    })
    const otpSchema = {
      otp,
      email: savedUser.email,
      purpose: "signup"
    } as OtpSchema

    await saveOtp(otpSchema)
  } catch (error) {
    next(error)
  }
}

export const verifyOtp = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, otp} = _req.body
    if (!email || !otp) {
      const error = {
        status: 400,
        message: "Invalid request"
      }
      return next(error)
    }
    const otpData = await getOtp(email)
    if (!otpData) {
      const error = {
        status: 400,
        message: "Invalid request"
      }
      return next(error)
    }
    if (otp === otpData.otp && new Date() <= otpData.expiresAt) {
      return res.status(200).json({success: true})
    } else {
      return next({
        status: 400,
        message: "Invalid OTP"
      })
    }
  } catch (error) {
    next(error)
  }
}