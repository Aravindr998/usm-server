import { NextFunction, Request, Response } from "express"
import { createUser, getAllUsers, UserInput } from "../services/user.service"
import { userFormItems } from "../models/user.model"
import { validateAlphaNumeric, validateEmail, validateFormEntryBody } from "../utils/validation"
import { generateOtp } from "../utils/common"
import { sendMail } from "../services/email.service"
import { saveOtp } from "../services/otp.service"

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
    console.log(savedUser)
    res.status(201).json({ success: true, user: savedUser })
    const otp = generateOtp()
    await sendMail({
      to: savedUser.email,
      subject: "OTP for email verification",
      text: `Your OTP for email verification is ${otp}`
    })
    const otpSchema = {
      otp,
      email: savedUser.email
    }
    await saveOtp(otpSchema)
  } catch (error) {
    next(error)
  }
}