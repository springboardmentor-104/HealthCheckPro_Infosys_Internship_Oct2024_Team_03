import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Email server configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export default transporter