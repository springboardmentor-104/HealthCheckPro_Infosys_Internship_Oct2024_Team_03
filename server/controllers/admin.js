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

export const addAdviceManually = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const data = [
      [
        "Start small with 5 to 10 minutes daily and build up gradually",
        "Try increasing frequency to see better results",
        "Great Aim for consistency most days of the week",
        "Fantastic You are on the right track for excellent fitness",
        "Perfect Daily exercise enhances overall health",
      ],
      [
        "Start with simple activities like walking or stretching",
        "Incorporate regular physical activity to build stamina",
        "You are improving Keep up the progress",
        "Great Consistency will help maintain your fitness",
        "Fantastic Keep challenging yourself to improve further",
      ],
      [
        "Consult a healthcare provider for evaluation and relief",
        "Consider exercises or therapies to reduce discomfort",
        "You are doing well Address any specific issues proactively",
        "Great Maintain your current habits to stay pain-free",
        "Excellent Keep prioritizing your health",
      ],
      [
        "Incorporate short breaks to move and stretch during the day",
        "Try reducing sitting time by standing or walking more",
        "Good Aim for frequent activity to offset sitting time",
        "Great Keep up the balance of activity and rest",
        "Perfect Low sedentary time supports better health ",
      ],
      [
        "Schedule a checkup to monitor your health status",
        "Regular checkups can help catch issues early",
        "Consider annual visits for optimal care",
        "Good You are maintaining a healthy checkup routine",
        "Excellent Regular visits ensure proactive health management",
      ],
    ];

    const questions = await Question.find({ categoryId });

    for(let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const advices = data[i];

      if (question.options.length !== advices.length) {
        throw new Error(
          `Mismatch between options and advices for question with ID ${question._id}`
        );
      }

      for(let j = 0; j < question.options.length; j++) {
        question.options[j].advice = advices[j];
      }

      await question.save();
    }
    res.status(200).json({ message: "Advices added successfully!" });
  } catch(error) {
    console.log({error});
  }
}
