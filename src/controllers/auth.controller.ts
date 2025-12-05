import { NextFunction, Request, Response } from "express"
import { createToken, createUser, getAllUsers, getUserByEmail, UserInput, verifyUser } from "../services/auth.service"
import { userFormItems } from "../models/auth.model"
import {  validateFormEntryBody } from "../utils/validation"
import { generateOtp } from "../utils/common"
import { sendMail } from "../services/email.service"
import { deleteOtp, getOtp, saveOtp, sendOtp, updateOtp } from "../services/otp.service"
import { OtpSchema } from "../types/models.types"
import { logger } from "../utils/logger"
  import { saveUser } from "../services/user.service"
import mongoose, { mongo } from "mongoose"

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
    await sendOtp(savedUser.email)
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
    const userData = await getUserByEmail(email)
    if (!userData) {
      const error = {
        status: 400,
        message: "Invalid Request"
      }
      return next(error)
    }
    if (userData.isVerified) {
      const error = {
        status: 400,
        message: "User already verified, Please sign in"
      }
      next(error)
    }
    const otpData = await getOtp(email)
    if (!otpData) {
      const error = {
        status: 400,
        message: "OTP Expired, Please enter the latest OTP"
      }
      await sendOtp(userData.email)
      return next(error)
    }
    if (otp === otpData.otp && new Date() <= otpData.expiresAt) {
      await deleteOtp(email)
      await verifyUser(email)
      await saveUser({
        email: userData.email,
        name: userData.name,
        authId: (userData._id as mongoose.Types.ObjectId).toString()
      })
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

export const loginUser = async(_req: Request, res: Response, next: NextFunction) => {
  try {
    const invalidCredentialError = {
        status: 401,
        message: "Invalid Credentials"
      }
    const {email, password} = _req.body
    if (!email || !password) {
      return next(invalidCredentialError)
    }
    const user = await getUserByEmail(email)
    if (!user) {
      const error = {
        status: 400,
        message: "Please register to continue"
      }
      return next(error)
    }
  const comparison = await user.comparePassword(password)
  if (!comparison) {
    return next(invalidCredentialError)
  }
  console.log(user)
  const tokenData = {
    id: user.id,
    email: user.email
  }
  const token = await createToken(tokenData)
  return res.json({
    success: true,
    token
  })
  } catch (error) {
    
  }
}