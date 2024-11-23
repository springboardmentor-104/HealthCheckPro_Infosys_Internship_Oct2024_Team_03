import express from "express"
import { addAdviceManually, addCategory, addQuestion, deleteQuestion, modifyQuestion } from "../controllers/admin.js"
import { isAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/categories/add", isAdmin, addCategory);
router.post("/questions/add", isAdmin, addQuestion);
router.delete("/questions/:id", isAdmin, deleteQuestion);
router.put("/questions/:id", isAdmin, modifyQuestion);
router.patch("/:categoryId/add-advice",isAdmin, addAdviceManually);

export default router;