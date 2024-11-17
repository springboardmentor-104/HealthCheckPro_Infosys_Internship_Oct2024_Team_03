import UserAssessmentHistory from "../models/UserAssessmentHistory.js";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import { updateLeaderBoard } from "./leaderboard.js";

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
    const username = req.user.username;
    const { categoryId, questions } = req.body;

    // caculate total score of user in specific category assessment
    let totalScore = 0;
    for (const question of questions) {
      const questionDoc = await Question.findById(question.questionId);
      const selectedOption = questionDoc.options.find(option => option._id.equals(question.selectedOptionId));
      totalScore += selectedOption.score;
    }

    // find totalScore percent
    const categoryTotalScore = await Category.findOne({_id: categoryId});
    console.log(categoryTotalScore);
    totalScore = (totalScore / categoryTotalScore.totalScore) * 100;
    totalScore = parseFloat(totalScore.toFixed(2));

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

    const allCategories = await Category.find();
    const totalNumberOfCategories = allCategories.length;
    console.log({totalNumberOfCategories})

    if (currentAttempt.assessments.length === totalNumberOfCategories) {
      currentAttempt.isComplete = true;
      // currentAttempt.overallScore =
      //   currentAttempt.assessments.reduce((sum, assessment) => sum + assessment.totalScore, 0);

      // find percentage of overall scores percentage
      currentAttempt.overallScore =
        currentAttempt.assessments.reduce((sum, assessment) => sum + assessment.totalScore, 0) / totalNumberOfCategories;
      
      currentAttempt.overallScore = parseFloat(currentAttempt.overallScore.toFixed(2));
    }

    await currentAttempt.save();
    res
      .status(200)
      .json({ message: "Category test submitted!", attempt: currentAttempt });

    if (currentAttempt.isComplete) {
      const attemptNumber = lastAttempt ? lastAttempt.attemptNumber : 0;
      updateLeaderBoard(userId, username, attemptNumber);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Fetch the latest assessment attempts
export const fetchUserLatestAssessment = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is attached to the req object
    const latestAttempts = await UserAssessmentHistory.find({ userId }).sort({ attemptNumber: -1 }).limit(2);

    // Process the latest attempts to exclude the questions array
    const processedAttempts = latestAttempts.map(attempt => {
      const processedAssessments = attempt.assessments.map(assessment => {
        const { questions, ...rest } = assessment._doc; // Exclude questions array and get the rest of the properties
        return rest; // Return the new assessment object without the questions array
      });
      return { ...attempt._doc, assessments: processedAssessments }; // Return the new attempt object with processed assessments
    });

    const latestCompleteAttempt = processedAttempts.find(attempt => attempt.isComplete);
    const latestIncompleteAttempt = processedAttempts.find(attempt => !attempt.isComplete);

    if (latestCompleteAttempt || latestIncompleteAttempt) {
      res.status(200).json({ 
        latestCompleteAttempt,
        latestIncompleteAttempt 
      });
    } else {
      res.status(200).json({ message: "User has not submitted any tests!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all assessment attempts
export const fetchUserAssessmentHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is attached to the req object
    const allAttempts = await UserAssessmentHistory.find({ userId }).sort({ attemptNumber: -1 });

    if (allAttempts && allAttempts.length > 0) {
      const shortInfo = allAttempts.map(attempt => {
        return ({
          _id: attempt._id, 
          userId: attempt.userId, 
          attemptNumber: attempt.attemptNumber,
          overallScore: attempt.overallScore,
          isComplete: attempt.isComplete,
          date: attempt.date
        })
      });

      res.status(200).json( {attemptHistory: shortInfo} );
    } else {
      res.status(200).json({ message: "User has not submitted any tests!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAssessmentById = async(req, res) => {
  try {
    const userId = req.user._id;
    const assessmentId = req.params.assessmentId;

    const assessment = await UserAssessmentHistory.findOne({ _id: assessmentId });
    res.status(200).json({assessment});

  } catch(error) {
    res.status(500).json({ message: "Server Error", error });
  }
}