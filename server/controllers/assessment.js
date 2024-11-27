import UserAssessmentHistory from "../models/UserAssessmentHistory.js";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import { updateLeaderBoard } from "./leaderboard.js";
import Joi from "joi";
import mongoose from "mongoose"

// Validation Schema
const objectValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value))
    return helpers.message("Invalid ObjectId");
  return value;
};

const schema = Joi.object({
  categoryId: Joi.string().custom(objectValidation).required(),
  questions: Joi.array().items(
    Joi.object({
      questionId: Joi.string().custom(objectValidation).required(),
      selectedOptionId: Joi.string().custom(objectValidation).required()
    })
  ).required()
})

export const checkUserAssessmentStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
        if(userIdError)
          return res.status(400).json({ error: error.details[0].message })

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

/*
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
*/

export const submitCatgegoryTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const username = req.user.username;
    const { categoryId, questions } = req.body;

    const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
    if(userIdError)
      return res.status(400).json({ error: error.details[0].message })

    const { error } = schema.validate({ categoryId, questions }); 
    if(error)
      return res.status(400).json({ error: error.details[0].message });

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
    
    const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
    if(userIdError)
      return res.status(400).json({ error: error.details[0].message })
    
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

    const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
    if(userIdError)
      return res.status(400).json({ error: error.details[0].message })

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

export const getAttemptById = async(req, res) => {
  try {
    const userId = req.user._id;
    const attemptId = req.params.attemptId;

    const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
    if(userIdError)
      return res.status(400).json({ error: error.details[0].message })

    const { error: attemptIdError } = Joi.string().custom(objectValidation).required().validate(attemptId);
    if(attemptIdError)
      return res.status(400).json({ error: error.details[0].message });

    const attemptDoc = await UserAssessmentHistory.findOne({ _id: attemptId });

    if(!attemptDoc)
      return res.status(404).json({ message: "Attempt Not Found" });

    if(attemptDoc.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized Access! "});

    const { assessments, ...restFields } = attemptDoc.toObject(); // convert mongoose object to JS object for destructuring process

    const assessmentsScore = assessments.map((assessment) => ({
      categoryId: assessment.categoryId, 
      totalScore: assessment.totalScore
    }));

    res.status(200).json({...restFields, assessments: assessmentsScore});

  } catch(error) {
    res.status(500).json({ message: "Server Error", error });
  }
}

export const getAssessmentFromAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { attemptId, categoryId } = req.params;

    const { error: userIdError } = Joi.string().custom(objectValidation).required().validate(userId);
    if(userIdError)
      return res.status(400).json({ error: error.details[0].message })

    const { error: attemptIdError } = Joi.string().custom(objectValidation).required().validate(attemptId);
    const { error: categoryIdError } = Joi.string().custom(objectValidation).required().validate(categoryId);
    if(attemptIdError || categoryIdError)
      return res.status(400).json({ error: error.details[0].message });

    const assessmentDoc = await UserAssessmentHistory.findOne({ _id: attemptId });
    
    if(!assessmentDoc)
      return res.status(404).json({ message: "Attempt Not Found" });

    if(assessmentDoc.userId.toString() !== userId) // toString() is used to conver ObjectId into string for comparison
      return res.status(403).json({ message: "Unauthorized Access!" });

    const categoryAssessment = assessmentDoc.assessments.find(assessment => assessment.categoryId.toString() === categoryId);

    const userResponse = {
      categoryId,
      questions: [],
      totalScore: categoryAssessment.totalScore
    };

    for (const question of categoryAssessment.questions) {
      const questionDoc = await Question.findOne({ _id: question.questionId });
      const questionText = questionDoc.questionText;
      const selectedOption = questionDoc.options.find(
        (option) => 
          option._id.toString() === question.selectedOptionId.toString()
      );
      const selectedOptionText = selectedOption.optionText;
      const selectedOptionAdvice = selectedOption.advice
      userResponse.questions.push({ questionText, selectedOptionText, _id: questionDoc._id, advice: selectedOptionAdvice });
    }
    res.status(200).json({ userResponse });

  } catch(error) {
    res.status(500).json({ message: "Server Error!", error });
  }
}