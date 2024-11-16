import express from "express"
import { getLeaderboard } from "../controllers/leaderboard.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:category", isAuthenticated, getLeaderboard);

export default router