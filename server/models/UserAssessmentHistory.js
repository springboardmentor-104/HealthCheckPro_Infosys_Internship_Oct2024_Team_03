import mongoose from "mongoose";

const assessmentScoreSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedOptionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
  totalScore: {
    type: Number,
    default: 0,
  },
});

const UserAssessmentHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    assessments: [assessmentScoreSchema],
    overallScore: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userAssessmentHistory = mongoose.model(
  "UserAssessmentHistory",
  UserAssessmentHistorySchema
);
export default userAssessmentHistory;
