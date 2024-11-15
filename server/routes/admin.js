import express from "express"
import { addCategory, addQuestion, deleteQuestion, modifyQuestion } from "../controllers/admin.js"
import { isAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/categories/add", isAdmin, addCategory);
router.post("/questions/add", isAdmin, addQuestion);
router.delete("/questions/:id", isAdmin, deleteQuestion);
router.put("/questions/:id", isAdmin, modifyQuestion);

export default router;