import React, { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import doctorimage from './doctot.png'; // Ensure correct path and file name

const Stepper = ({ currentCategory, categories, completedSteps, onCategoryClick }) => {
  return (
    <div className="flex flex-col items-start p-6 space-y-4 bg-white rounded-2xl w-full sm:w-1/4 shadow-2xl transition-transform transform hover:scale-105 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => onCategoryClick(category.id)}
          className={`w-full py-3 px-4 text-left rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            currentCategory === category.id
              ? "bg-blue-600 text-white"
              : completedSteps.has(category.id)
              ? "bg-green-200 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {category.name}
        </div>
      ))}
      <p className="mt-6 text-gray-600">Progress: {categories.findIndex((cat) => cat.id === currentCategory) + 1} of {categories.length}</p>
    </div>
  );
};

const AssessmentPage = () => {
  const categories = [
    { id: "physical", name: "Physical" },
    { id: "mental", name: "Mental" },
    { id: "diet", name: "Diet" },
    { id: "lifestyle", name: "Lifestyle" },
  ];

  const questionsData = [
    {
      id: 1,
      text: "How often do you exercise?",
      options: [
        { id: 1, text: "Daily" },
        { id: 2, text: "Weekly" },
        { id: 3, text: "Rarely" },
        { id: 4, text: "Never" },
      ],
    },
    {
      id: 2,
      text: "Do you follow a healthy diet?",
      options: [
        { id: 1, text: "Always" },
        { id: 2, text: "Sometimes" },
        { id: 3, text: "Rarely" },
        { id: 4, text: "Never" },
      ],
    },
  ];

  const [currentCategory, setCurrentCategory] = useState("physical");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const currentQuestion = questionsData[currentQuestionIndex];

  const handleOptionChange = (value) => setSelectedOption(value);

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompletedSteps((prev) => new Set(prev).add(currentCategory));
      alert("Assessment submitted!");
    }
  };

  const handlePrevious = () => {
    setSelectedOption(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (completedSteps.has(currentCategory) || currentCategory === categoryId) {
      setCurrentCategory(categoryId);
      setCurrentQuestionIndex(0); // Reset to first question of new category
      setSelectedOption(null); // Clear selected option
    } else {
      alert("Please complete the current category first.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 p-6 sm:p-10">
      <Stepper
        currentCategory={currentCategory}
        categories={categories}
        completedSteps={completedSteps}
        onCategoryClick={handleCategoryClick}
      />
      <div
        className="flex flex-col flex-grow bg-white bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden mt-6 sm:mt-0 sm:ml-8 transform transition-all duration-500 hover:scale-105"
        style={{
          backgroundImage: `url(${doctorimage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-pulse">Assessment</h2>
          <p className="text-base sm:text-lg text-gray-200 mb-6">Question {currentQuestionIndex + 1} of {questionsData.length}</p>
          <h3 className="text-xl sm:text-2xl font-medium text-white mb-10">{currentQuestion.text}</h3>
          <RadioGroup.Root className="flex flex-col space-y-4 w-full sm:w-3/4" value={selectedOption} onValueChange={handleOptionChange}>
            {currentQuestion.options.map((option) => (
              <RadioGroup.Item
                key={option.id}
                value={option.id.toString()}
                className={`flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  selectedOption === option.id.toString() ? "bg-blue-100 border-blue-400" : "bg-white"
                }`}
              >
                <RadioGroup.Indicator className="mr-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      selectedOption === option.id.toString() ? "bg-blue-400" : "bg-gray-300"
                    }`}
                  ></div>
                </RadioGroup.Indicator>
                <span className="text-sm sm:text-lg text-gray-800">{option.text}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <div className="flex justify-between mt-10 w-full sm:w-3/4">
            {currentQuestionIndex > 0 && (
              <button
                className="w-1/3 bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-300 transition duration-300 transform hover:scale-105"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < questionsData.length - 1 ? (
              <button
                className="w-1/3 bg-blue-600 text-white py-2 sm:py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="w-1/3 bg-green-500 text-white py-2 sm:py-3 rounded-full font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105"
                onClick={handleNext}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
