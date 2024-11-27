import mongoose from "mongoose";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import Joi from "joi";

// Validation Schema
const objectValidation = (value, helpers) => {
  if(!mongoose.Types.ObjectId.isValid(value)) 
    return helpers.message("Invalid ObjectId");
  return value;
}

const validIdSchema = Joi.string().custom(objectValidation).required();

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

  const { error } = validIdSchema.validate(id);
  if(error)
    return res.status(400).json({ error: error.details[0].message })

  try {
    const questions = await Question.find({ categoryId: id });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
};
