import express from "express"
import { checkUserAssessmentStatus, fetchUserAssessmentHistory, fetchUserLatestAssessment, getAssessmentFromAttempt, getAttemptById, startNewRound, submitCatgegoryTest } from "../controllers/assessment.js"
import { authentiateToken } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/status", authentiateToken, checkUserAssessmentStatus);
router.post("/start-new-round", authentiateToken, startNewRound);
router.patch("/submit", authentiateToken, submitCatgegoryTest);
router.get("/latest-attempt",authentiateToken, fetchUserLatestAssessment);
router.get("/all-attempts",authentiateToken, fetchUserAssessmentHistory);
router.get("/attempt/:attemptId", authentiateToken, getAttemptById);
router.get("/attempt/:attemptId/:categoryId", authentiateToken, getAssessmentFromAttempt);

export default router;