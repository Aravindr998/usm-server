import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { authHandler } from "../middleware/authHandler";

const router = Router()

router.post("/", authHandler, getUser)

export default router