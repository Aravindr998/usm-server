import { Router } from "express";
import { getUser, saveUserDetails } from "../controllers/user.controller";
import { authHandler } from "../middleware/authHandler";

const router = Router()

router.get("/details", authHandler, getUser)
router.get("/save", authHandler, saveUserDetails)

export default router