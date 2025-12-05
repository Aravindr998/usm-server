import { ENV } from "../config/env";
import { IAuth, Auth } from "../models/auth.model";
import jwt from "jsonwebtoken";

export type UserInput = {
  name: string;
  email: string;
  password: number;
};

export const getAllUsers = async (): Promise<IAuth[]> => {
  return Auth.find();
};

export const createUser = async (data: UserInput): Promise<IAuth> => {
  const user = new Auth(data);
  return user.save();
};

export const verifyUser = async (email: string) => {
  await Auth.findOneAndUpdate({ email }, { isVerified: true });
};

export const getUserByEmail = async (email: string): Promise<IAuth | null> => {
  return Auth.findOne({ email });
};

export const createToken = async (data: Record<string, string>) => {
  const token = jwt.sign(data, ENV.JWT_SECRET);
  return token;
};

export const verifyToken = (token: string) => {
  console.log(token, "token")
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    console.log(decoded, "decoded")
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error", error);
    }
    throw new Error("Invalid token");
  }
};
