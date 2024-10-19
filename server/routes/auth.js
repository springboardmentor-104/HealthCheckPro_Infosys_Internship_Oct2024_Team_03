import express from "express"
import { resetPassword, sendOTP, signIn, signup, verifyOTP } from "../controllers/auth.js"

const router = express.Router()

router.post("/send-otp", sendOTP)
router.post("/email-verification", verifyOTP)
router.post("/signup", signup)
router.post("/signin", signIn)
router.post("/reset-password", resetPassword)

export default router
