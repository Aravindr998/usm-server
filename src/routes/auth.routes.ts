import { Router } from "express"
import { getUsers, registerUser, verifyOtp, resendOtp, loginUser } from "../controllers/auth.controller"

const router = Router()

router.post("/", getUsers)

//registration
router.post("/register", registerUser)
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)

//login
router.post("/login", loginUser)

export default router