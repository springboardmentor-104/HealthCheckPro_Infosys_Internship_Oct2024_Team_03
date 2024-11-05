import React, { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

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
    // Add more questions as needed
  ];

  const [currentCategory, setCurrentCategory] = useState("physical");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = questionsData[currentQuestionIndex];

  const getStatus = async () => {
    const response = await fetch(
      `http://localhost:3000/user-assessment/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userId, // 6714f6b7e08a34409125cc0c
        },
      }
    );

    const status = await response.json();
    console.log({ status });

    
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle submit logic here
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r">
      <div>
        <div className="flex flex-col items-center p-6 bg-gray-50 rounded-3xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Categories
          </h2>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`w-full py-2 px-4 mb-2 text-center rounded-full cursor-pointer transition ${
                currentCategory === category.id
                  ? "bg-blue-400 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setCurrentCategory(category.id)}
            >
              {category.name}
            </div>
          ))}
          {/* Progress Indicator */}
          <div className="mt-4 w-full text-center">
            <p className="text-gray-600">
              Progress:{" "}
              {categories.findIndex((cat) => cat.id === currentCategory) + 1} of{" "}
              {categories.length}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm max-w-4xl m-8 w-full">
        {/* Left Section: Graphic */}
        {/* <div className="w-full md:w-1/3 flex items-center justify-center p-8 scale-125">
          <img
            src="../../health-assessment.png"
            alt="Health Assessment"
            className="rounded-xl w-full h-auto scale-90"
          />
        </div> */}
        {/* Right Section: Question and Options */}
        <div className="w-full md:w-3/3 p-8 flex flex-col justify-center bg-gray-50">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
            Assessment
          </h2>
          <p className="text-gray-700 mb-4 text-center">
            Question {currentQuestionIndex + 1} of {questionsData.length}
          </p>
          <h3 className="text-xl font-medium mb-6 text-gray-900">
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
                className={`flex items-center p-4 border border-gray-300 rounded-full cursor-pointer transition ${
                  selectedOption === option.id.toString()
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white"
                }`}
              >
                <RadioGroup.Indicator className="mr-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
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
          <div className="flex justify-between mt-6">
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
