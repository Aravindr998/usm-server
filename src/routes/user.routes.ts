import { Router } from "express"
import { getUsers, registerUser, verifyOtp, resendOtp } from "../controllers/user.controller"

const router = Router()

router.post("/", getUsers)
router.post("/register", registerUser)
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)

export default router