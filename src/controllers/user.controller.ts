import { NextFunction, Request, Response } from "express";

export const getUser = (_req: Request, res: Response, next: NextFunction) => {
    return res.json({success: true})
}