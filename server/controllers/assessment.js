import UserAssessmentHistory from "../models/UserAssessmentHistory.js";
import Category from "../models/Category.js";
import Question from "../models/Question.js";

export const checkUserAssessmentStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await UserAssessmentHistory.find({ userId }).sort({ attemptNumber: -1 });
        const attemptNumber = history.length;

        if(attemptNumber === 0) {
            res.json({ attemptNumber, completedCategories: [] });
        } else {
            const currentAttempt = history[0];
            const completedCategories = currentAttempt.assessments.map(assessment => assessment.categoryId);
            res.json({
                isComplete: currentAttempt.isComplete,
                completedCategories,
                attemptNumber
            })
        }
    } catch(error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

export const startNewRound = async (req, res) => {
    try {
        const userId = req.user._id;
        const lastAttempt = await UserAssessmentHistory.findOne({ userId }).sort({ attemptNumber: -1 });

        if(lastAttempt && !lastAttempt.isComplete) 
          return res.status(400).json({ message: "Finish the current round before starting a new one." });

        const newAttemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

        const newAttempt = new UserAssessmentHistory({
            userId,
            attemptNumber: newAttemptNumber,
            assessments: [],
            isComplete: false
        });

        await newAttempt.save();
        res.json({ message: "New round started!", attempt: newAttempt });
    } catch (error) {
        res.status(500).json({ message: "Server Error!", error });
    }
}

export const submitCatgegoryTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { categoryId, questions } = req.body;

    // caculate total score of user in specific category assessment
    let totalScore = 0;
    for (const question of questions) {
      const questionDoc = await Question.findById(question.questionId);
      const selectedOption = questionDoc.options.find(option => option.optionId.equals(question.selectedOptionId));
      totalScore += selectedOption.score;
    }

    const lastAttempt = await UserAssessmentHistory.findOne({ userId }).sort({
      attemptNumber: -1,
    });

    let currentAttempt;
    if (!lastAttempt || lastAttempt.isComplete) {
      const newAttemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;
    
      currentAttempt = new UserAssessmentHistory({
        userId,
        attemptNumber: newAttemptNumber,
        assessments: [{ categoryId, questions, totalScore }],
        isComplete: false,
      });
    } else {
      currentAttempt = lastAttempt;

      if (
        currentAttempt.assessments.some((assessment) =>
          assessment.categoryId.equals(categoryId)
        )
      ) {
        return res.status(400).json({
          message: "This category test already submitted in the current round!",
        });
      }

      currentAttempt.assessments.push({ categoryId, questions, totalScore });
    }

    if (currentAttempt.assessments.length === 4) {
      currentAttempt.isComplete = true;
      currentAttempt.overallScore =
        currentAttempt.assessments.reduce((sum, assessment) => sum + assessment.totalScore, 0) / 4;
    }

    await currentAttempt.save();
    res
      .status(200)
      .json({ message: "Category test submitted!", attempt: currentAttempt });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
