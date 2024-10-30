import express from "express"
import { checkUserAssessmentStatus, startNewRound, submitCatgegoryTest } from "../controllers/assessment.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/status", isAuthenticated, checkUserAssessmentStatus);
router.post("/start-new-round", isAuthenticated, startNewRound);
router.patch("/submit", isAuthenticated, submitCatgegoryTest);

export default router;