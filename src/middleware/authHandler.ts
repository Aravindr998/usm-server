import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth.service";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/logger";

declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const authHandler = (_req: Request, res: Response, next: NextFunction) => {
    try {
        const authenticationError = {
            status: 401,
            message: "Unauthenticated"
        }
        const authHeader = _req.headers["authorization"]
        if (!authHeader) return next(authenticationError)
        const token = authHeader?.split(" ")[1]
        if (!token) return next(authenticationError)
        try {
            const decoded = verifyToken(token)
            _req.user = decoded
            return next()
        } catch (error) {
            return next(authenticationError)
        }
    } catch (error) {
        logger.error("Authentication error: ", error)
        return next({
            status: 500,
            message: "Something went wrong, please try again later"
        })
    }
}