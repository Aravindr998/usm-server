import { IUser, User } from "../models/user.model"

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