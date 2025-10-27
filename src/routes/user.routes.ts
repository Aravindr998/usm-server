import { Router } from "express"
import { getUsers, registerUser, verifyOtp } from "../controllers/user.controller"

const router = Router()

router.post("/", getUsers)
router.post("/register", registerUser)
router.post("/verify-otp", verifyOtp)

export default router