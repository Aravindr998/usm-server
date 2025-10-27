import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model"

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User(_req.body)
        await user.save()
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

export const saveUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find()
        res.json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}