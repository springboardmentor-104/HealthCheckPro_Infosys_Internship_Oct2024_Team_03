import Category from "../models/Category.js";
import Question from "../models/Question.js";

export const addCategory = async (req, res) => {
  const { categoryName, description } = req.body;

  try {
    const category = new Category({
      categoryName,
      description,
      totalScore: 0
    });

    await category.save();

    res.status(201).json({ message: "Category added successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured while adding category!", error });
  }
};

export const addQuestion = async (req, res) => {
  const { categoryId, questionText, options } = req.body;

  let bestOptionScore = 0;
  options.forEach(option => {
    if(option.score > bestOptionScore)
      bestOptionScore = option.score
  });

  try {
    const question = new Question({
      categoryId,
      questionText,
      options,
    });

    await question.save();

    res.status(201).json({ message: "Question added successfully!" });

    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      { $inc: { totalScore: bestOptionScore }},
      { new: true }
    );

    console.log({category});

    if (!category) 
      return res.status(404).json({ message: "Category not found!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured while adding a question!", error });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured while deleting the question", error });
  }
};

export const modifyQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options } = req.body;

  try {
    await Question.findByIdAndUpdate(id, { questionText, options });
    res.status(200).json({ message: "Question updated successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating the question", error });
  }
};
