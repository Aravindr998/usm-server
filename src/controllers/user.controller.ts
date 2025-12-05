import { NextFunction, Request, Response } from "express";
import { getUserByEmail, updateUser } from "../services/user.service";

export const getUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(_req.user)
        const user = await getUserByEmail(_req.user?.email!)
        if (!user) {
            return next({
                status: 404,
                message: "User not found"
            })
        }
        return res.json({success: true, user})
    } catch (error) {
        console.log(error)
        return next({
            status: 500,
            message: "Something went wrong, please try again later"
        })
    }
}

export const saveUserDetails = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, phone, dob, profilePicture} = _req.body
        // Assuming there's a service function to update user details
        const user = await updateUser(_req.user?.id!, {name, phone, dob, profilePicture})
        return res.json({success: true, user})
    } catch (error) {
        console.log(error)
        return next({
            status: 500,
            message: "Something went wrong, please try again later"
        })
    }
}