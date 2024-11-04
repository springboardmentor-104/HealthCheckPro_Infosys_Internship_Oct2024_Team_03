import React, { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

const Stepper = ({ currentCategory, categories, completedSteps }) => {
  return (
    <div className="flex justify-around mb-8">
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
              currentCategory === category.id
                ? "bg-blue-500 animate-pulse"
                : completedSteps.has(category.id)
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
          <span
            className={`mt-3 text-lg ${
              currentCategory === category.id ? "text-blue-500 font-semibold" : "text-gray-700"
            }`}
          >
            {category.name}
          </span>
        </div>
      ))}
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

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="max-w-6xl w-full p-8">
        <Stepper
          currentCategory={currentCategory}
          categories={categories}
          completedSteps={completedSteps}
        />
        <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Categories</h2>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`w-full py-3 px-4 mb-3 text-center rounded-full cursor-pointer shadow-md transition-transform transform ${
                currentCategory === category.id
                  ? "bg-blue-400 text-white scale-105"
                  : "bg-white text-gray-700 hover:scale-105 hover:bg-blue-200"
              }`}
              onClick={() => {
                if (!completedSteps.has(currentCategory)) {
                  alert("Please complete the current category first.");
                  return;
                }
                setCurrentCategory(category.id);
              }}
            >
              {category.name}
            </div>
          ))}
          <div className="mt-6 w-full text-center">
            <p className="text-gray-600">
              Progress:{" "}
              {categories.findIndex((cat) => cat.id === currentCategory) + 1} of{" "}
              {categories.length}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm max-w-4xl m-8 w-full">
        <div className="w-full md:w-1/3 flex items-center justify-center p-10">
          <img
            src="../../health-assessment.png"
            alt="Health Assessment"
            className="rounded-xl w-full h-auto shadow-md"
          />
        </div>
        <div className="w-full md:w-2/3 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 text-center md:text-left">
            Assessment
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Question {currentQuestionIndex + 1} of {questionsData.length}
          </p>
          <h3 className="text-xl font-medium mb-8 text-gray-900">
            {currentQuestion.text}
          </h3>
          <RadioGroup.Root
            className="flex flex-col space-y-4"
            value={selectedOption}
            onValueChange={handleOptionChange}
          >
            {currentQuestion.options.map((option) => (
              <RadioGroup.Item
                key={option.id}
                value={option.id.toString()}
                className={`flex items-center p-4 border border-gray-300 rounded-full cursor-pointer transition-shadow transform ${
                  selectedOption === option.id.toString()
                    ? "bg-blue-100 border-blue-400 shadow-lg"
                    : "bg-white hover:shadow-md"
                }`}
              >
                <RadioGroup.Indicator className="mr-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      selectedOption === option.id.toString()
                        ? "bg-blue-400"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </RadioGroup.Indicator>
                <span className="text-gray-700">{option.text}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <div className="flex justify-between mt-8">
            {currentQuestionIndex > 0 && (
              <button
                className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mr-2"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < questionsData.length - 1 ? (
              <button
                className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 ml-2"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 ml-2"
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

