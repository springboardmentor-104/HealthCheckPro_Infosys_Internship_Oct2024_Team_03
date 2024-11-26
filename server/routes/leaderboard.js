import express from "express"
import { getLeaderboard } from "../controllers/leaderboard.js";
import { authentiateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:category", authentiateToken, getLeaderboard);

export default router