import bcrypt from "bcryptjs";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import crypto from "crypto";
import Joi from "joi";
import { generateToken } from "../utils/jwt.js";

let otpStore = {}; // temporary store for OTPs
let verifiedEmails = {}; // temporary store for verified mails

// Validation Schemas
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(8).required();
const otpSchema = Joi.string().length(6).required();
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(3).required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  dateOfBirth: Joi.date().iso().required()
})

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp; // store otp temporarily

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `HealthCheckPro email verification OTP: ${otp}`,
      text: `Your OTP for email verification is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("An error occured while sending email: ", err);
        return res.status(500).json({ err: err.message });
      }

      console.log("Email sent: ", info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const { error: emailError } = emailSchema.validate(email);
  const { error: otpError } = otpSchema.validate(otp);

  if(emailError || otpError)
    return res.status(400).json({ error: "Invalid input!" });

  if (otpStore[email] === otp) {
    verifiedEmails[email] = true;
    delete otpStore[email];
    res.status(200).json({ message: "Email verified successfully!" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
};

export const signup = async (req, res) => {
  let { username, email, password, name, gender, dateOfBirth } = req.body;

  const { error } = userSchema.validate({ username, email, password, name, gender, dateOfBirth });
  if(error) 
    return res.status(400).json({ error: error.details[0].message });

  if (!verifiedEmails[email]) {
    return res.status(400).json({ error: `${email} is not verified!` });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      gender,
      dateOfBirth: new Date(dateOfBirth),
    });

    await newUser.save();
    delete verifiedEmails[email];

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const { error } = emailSchema.validate(email);
  if(error) 
    return res.status(400).json({ error: "Invalid email format!" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: "invalid credentials: email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: "invalid credentials: password doesn't matched" });

    const token = generateToken(user);

    res.status(200).json({ message: "Logged in successfully!", user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const { error: emailError } = emailSchema.validate(email);
  const { error: passwordError } = passwordSchema.validate(newPassword);

  if(emailError || passwordError) 
    return res.status(400).json({ error: "Invalid Input!" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "user not found!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    delete otpStore[email];

    res.status(200).json({ message: "password reset successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
