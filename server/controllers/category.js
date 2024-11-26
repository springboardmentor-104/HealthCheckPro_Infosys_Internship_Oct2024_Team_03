import Category from "../models/Category.js";
import Question from "../models/Question.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const getQuestionsByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const questions = await Question.find({ categoryId: id });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};
