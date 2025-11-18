import { ENV } from "../config/env"
import { IUser, User } from "../models/user.model"
import jwt from "jsonwebtoken"

export type UserInput = {
  name: string
  email: string
  password: number
}

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find()
}

export const createUser = async (data: UserInput): Promise<IUser> => {
  const user = new User(data)
  return user.save()
}

export const verifyUser = async (email: string) => {
  await User.findOneAndUpdate({email}, {isVerified: true})
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({email})
}

export const createToken = async (data: Record<string, string>) => {
  const token = jwt.sign(data, ENV.JWT_SECRET)
  return token
}