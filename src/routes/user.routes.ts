import { Router } from "express"
import { getUsers, saveUser } from "../controllers/user.controller"

const router = Router()

router.get("/", saveUser)
router.post("/", getUsers)

export default router