import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"

dotenv.config()
const app = express() // initialize express app instance

// middlewares
app.use(express.json()); // to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // to enable cors

// routes
app.use("/auth", authRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Could not connect to MongoDB :(", error))

const PORT = 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))