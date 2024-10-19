import express from "express"
import { sendOTP, signup, verifyOTP } from "../controllers/auth.js"

const router = express.Router()

router.post("/send-otp", sendOTP)
router.post("/email-verification", verifyOTP)
router.post("/signup", signup)

export default router
