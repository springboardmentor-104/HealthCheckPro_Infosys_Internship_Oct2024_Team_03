import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/assessment.js";
import leaderBoardRoutes from "./routes/leaderboard.js";

dotenv.config();
const app = express(); // initialize express app instance

// middlewares
app.use(express.json()); // to parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // to enable cors

// routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/user-assessment", userRoutes);
app.use("/leaderboard", leaderBoardRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB :(", error));

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
