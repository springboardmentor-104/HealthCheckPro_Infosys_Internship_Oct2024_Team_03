import bcrypt from "bcryptjs"
import User from "../models/User.js"
import transporter from "../config/nodemailer.js"
import crypto from "crypto"

let otpStore = {} // temporary store for OTPs   
let verifiedEmails = {} // temporary store for verified mails

export const sendOTP = async(req, res) => {
    const { email } = req.body
    console.log("sending OTP")

    try {
        const otp = crypto.randomInt(100000, 999999).toString()
        otpStore[email] = otp // store otp temporarily
        // console.log(otpStore[email])

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "HealthCheckPro email verification OTP",
            text: `Your OTP for email verification is ${otp}`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log("An error occured while sending email: ", err)
                return res.status(500).json({ err: err.message })
            }

            console.log("Email sent: ", info.response)
            res.status(200).json({ message: "OTP sent successfully" })
        })
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
}

export const verifyOTP = async(req, res) => {
    const { email, otp } = req.body

    if(otpStore[email] === otp) {
        verifiedEmails[email] = true
        delete otpStore[email]
        res.status(200).json({ message: "Email verified successfully!" })
    } else {
        res.status(400).json({ error: "Invalid OTP" })
    }
}

export const signup = async(req, res) => {
    console.log("reg")
    const { username, email, password, name, gender, dateOfBirth } = req.body
    console.log(req.body)

    if(!verifiedEmails[email])
        return res.status(400).json({ error: `${email} is not verified!` })

    try {
        console.log("entered")
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email, 
            password: hashedPassword,
            name,
            gender,
            dateOfBirth
        })

        await newUser.save()
        delete verifiedEmails[email]

        res.status(201).json({ message: "User registered successfully!" })
    } catch(error) {
        res.status(400).json({ error: error.message })
    }
}