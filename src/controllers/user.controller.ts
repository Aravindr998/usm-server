import { NextFunction, Request, Response } from "express"
import { createUser, getAllUsers, UserInput } from "../services/user.service"
import { userFormItems } from "../models/user.model"
import {  validateFormEntryBody } from "../utils/validation"
import { generateOtp } from "../utils/common"
import { sendMail } from "../services/email.service"
import { getOtp, saveOtp, updateOtp } from "../services/otp.service"
import { OtpSchema } from "../types/models.types"
import { logger } from "../utils/logger"

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
    return res.status(201).json({ success: true, user: savedUser })
  } catch (error) {
    logger.error("Email send error here", error)
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

export const resendOtp = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {email} = _req.body
    if (!email) {
      const error = {
        status: 400,
        message: "Email not found"
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
    
    if (otpData.updatedAt && new Date().getTime() <= new Date(otpData.updatedAt).getTime() + 1 * 60 * 1000) {
      const error = {
        status: 400,
        message: "Please wait before requesting new otp"
      }
      return next(error)
    }
    const newOtp = generateOtp()
    const savedUser = await updateOtp(email, newOtp)
    if (savedUser) {
      await sendMail({
        to: savedUser.email,
        subject: "OTP for email verification",
        text: `Your OTP for email verification is ${newOtp}`
      })
      return res.status(200).json({success: true})
    } else {
      const error = {
        status: 400,
        message: "User not found"
      }
      next(error)
    }
  } catch (error) {
    next(error)
  }
}