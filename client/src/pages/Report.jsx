import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MdFitnessCenter } from "react-icons/md";
import { FaBrain, FaHeartbeat } from "react-icons/fa";
import { GiFruitBowl } from "react-icons/gi";
import { IoMdBicycle } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { changeDateFormatToNLN } from "../utils/convertDate";
import { useLocation, useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { attemptId } = location.state || {}

  // To store attempt data
  const [attemptData, setAttemptData] = useState({});

  // To store scores of all categories after fetching attempt
  // const [assessmentScores, setAssessmentScores] = useState([]);

  const [overallScoreKey, setOverallScoreKey] = useState("");

  // To store Id of particular cateogry from categories
  const [selectedCategory, setSelectedCateogry] = useState(null);

  // To store all question-answers of selected category assessment
  const [currentAssessmentContent, setCurrentAssessmentContent] = useState({});

  // To store date
  const [date, setDate] = useState("");

  // To store overall score advices
  const [overallAdvices, setOverallAdvices] = useState([]);

  // Store all categories statically
  const [categories, setCategories] = useState([
    {
      id: "6720b4b7138ac4c27924dbf2",
      name: "Physical",
      icon: <MdFitnessCenter size={32} className="text-blue-500" />,
      score: 0,
    },
    {
      id: "6722653e8aebf1c473d1672b",
      name: "Mental",
      icon: <FaBrain size={32} className="text-purple-500" />,
      score: 0,
    },
    {
      id: "67226bc38dec3d17c5368bd2",
      name: "Diet",
      icon: <GiFruitBowl size={32} className="text-green-500" />,
      score: 0,
    },
    {
      id: "67226bdf8dec3d17c5368bd5",
      name: "Lifestyle",
      icon: <IoMdBicycle size={32} className="text-orange-500" />,
      score: 0,
    },
  ]);

  const [chartData, setChartData] = useState({
    labels: categories.map((category) => category.name),
    datasets: [
      {
        label: "Category Scores (out of 100%)",
        data: categories.map((category) => category.score),
        backgroundColor: ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99"],
        borderWidth: 1,
      },
    ],
  });

  // const fetchOverallAdvice = useCallback(async(forScore) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/categories/`)
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }, [])

  const fetchAttempt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/user-assessment/attempt/${attemptId}`,
        { 
          method: "GET", 
          headers: { 
            "Authorization": `Bearer ${token}` 
          } 
        }
      );

      const attemptDataJson = await response.json();
      setAttemptData(attemptDataJson);
      console.log({attemptData})
      // setAssessmentScores(attemptData.assessments);

      if(attemptData.overallScore <= 33.33) {
        setOverallScoreKey("poor");
      } else if(attemptData.overallScore <= 66.66 && attemptData.overallScore > 33.33) {
        setOverallScoreKey("average")
      } else {
        setOverallScoreKey("excellent");
      }

      // update scores of each category
      const updatedCategories = categories.map((category) => {
        const assessment = attemptData.assessments.find((assessment) => assessment.categoryId.toString() === category.id)
        return assessment ? {...category, score: assessment.totalScore} : category;
      })
      setCategories(updatedCategories);

      // update chart data
      setChartData({
        labels: updatedCategories.map((category) => category.name),
        datasets: [
          {
            label: "Category Scores (out of 100%)",
            data: updatedCategories.map((category) => category.score),
            backgroundColor: ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99"],
            borderWidth: 1,
          },
        ],
      });

      setDate(changeDateFormatToNLN(attemptData.date));
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchCurrentAssessmentUserQuestions = useCallback(async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/user-assessment/attempt/${attemptId}/${categoryId}`,
        { method: "GET", headers: { "Authorization": `Bearer ${token}` } }
      );
      console.log({response});
      const currentAssessmentData = await response.json();
      console.log({currentAssessmentData});
      setCurrentAssessmentContent(currentAssessmentData.userResponse);
      console.log({currentAssessmentContent});
    } catch (error) {
      console.log({ error });
    }
  }, [selectedCategory]);
  
  useEffect(() => {
    if(!attemptId) {
      navigate("/dashboard");
    }
    fetchAttempt();
  }, [attemptId, fetchAttempt]);

  useEffect(() => {
    if(selectedCategory) {
      fetchCurrentAssessmentUserQuestions(selectedCategory)
    }
  }, [selectedCategory, fetchCurrentAssessmentUserQuestions])

  const overallAdvice = {
      poor: [
        {
          heading: "Start Small",
          description: "Incorporate more fruits and veggies into your diet",
        },
        {
          heading: "Stay Active",
          description: "Aim for short daily exercise sessions",
        },
        {
          heading: "Hydration",
          description: "Drink plenty of water daily.",
        },
        {
          heading: "Mindfulness",
          description: "Practice stress-relief activities like meditation",
        },
      ],
      average: [
        {
          heading: "Consistency",
          description: "Stick to your healthy habits regularly",
        },
        {
          heading: "Balanced Diet",
          description: "Add variety to your meals",
        },
        {
          heading: "Regular Exercise",
          description: "Include both cardio and strength training",
        },
        {
          heading: "Mental Wellness",
          description: "Include both cardio and strength training",
        },
      ],
      excellent: [
        {
          heading: "Maintain Habits",
          description: "Keep up your good work!",
        },
        {
          heading: "Explore",
          description: "Try new exercises or activities",
        },
        {
          heading: "Inspire",
          description: "Share your journey with others",
        },
        {
          heading: "Monitor",
          description: "Regularly check your progress and adjust as needed.",
        },
      ],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 p-4 md:p-0">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-4 md:p-8 m-8 md:mt-20">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 text-center">
            Assessment Report
          </h2>

          <div className="text-left w-auto max-w-md text-sm md:text-base">
            <p className="font-normal text-gray-800">
              Attempt Number:
              <span className="font-medium text-gray-900 ml-1">
                {attemptData.attemptNumber}
              </span>
            </p>
            <p className="font-normal text-gray-800">
              Date:{" "}
              <span className="font-medium text-gray-900 ml-1">{date}</span>
            </p>
          </div>
        </div>

        {/* Health Insights Section */}
        <div className="bg-gradient-to-r from-yellow-200 via-orange-300 to-pink-400 rounded-3xl p-5 md:p-8 mt-6 shadow-sm transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4 mb-4">
            <FaHeartbeat size={32} className="text-red-600" />
            <h3 className="text-xl md:text-2xl font-medium text-red-800">
              Health Insights
            </h3>
          </div>
          <p className="text-xl">
            Overall Score {attemptData.overallScore}
          </p>
          {/* <p className="text-gray-700 text-base text-center">
            Your Overall score is excellent
          </p> */}
          <div className="mt-4">
            {overallScoreKey &&
              overallAdvice[overallScoreKey].map((advice, index) => (
                <div key={index} className="mb-2 flex space-x-2">
                  <p className="text-base font-semibold text-gray-800">
                    {advice.heading}
                  </p>
                  <p className="text-base text-gray-700">
                    {advice.description}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Category Scores Section */}
        <div className="mt-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 ml-3">
            Category Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center justify-center p-3 md:p-6  rounded-2xl shadow-md transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selectedCategory && selectedCategory === category.id
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
                onClick={() => setSelectedCateogry(category.id)}
              >
                {category.icon}
                <h4 className="text-base md:text-xl font-medium text-gray-800 mt-2">
                  {category.name}
                </h4>
                <p className="text-gray-600">
                  {/* Score: */}
                  <span className="font-semibold">{category.score}%</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Your Responses Section */}
        <div className="mt-8  bg-gray-100 px-3 py-6 md:p-6 rounded-3xl shadow-sm">
          <h3 className="ml-2 md:ml-0 text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Your Responses
          </h3>
          {!selectedCategory ? (
            <>
              <p className="text-center text-sm text-red-500 mt-2">
                Select any category from above boxes to see your answers and
                advice based on that answer
              </p>
            </>
          ) : (
            <>
              <div className="space-y-4 text-sm md:text-base">
                {currentAssessmentContent.questions &&
                  currentAssessmentContent.questions.map((question, index) => (
                    <div
                      key={question._id}
                      className="p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-400"
                    >
                      <p className="font-medium text-gray-800">
                        <span className="mr-4">Q.{index + 1}&#41;</span>
                        {question.questionText}
                      </p>
                      <div className="mt-4 md:mt-0 md:ml-14">
                        <p className="text-gray-700 mt-1">
                          <span className="font-semibold">
                            Selected Answer:{" "}
                          </span>
                          {question.selectedOptionText}
                        </p>
                        <p className="text-gray-700 mt-1">
                          <span className="font-semibold">Advice:</span>
                          {question.advice}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Comparison Chart */}
        <div className="mt-8 bg-gray-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Comparison Chart
          </h3>
          <div className="h-64 w-full">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            className="text-sm md:text-base w-full bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
            onClick={() => navigate("/dashboard")}
          >
            Back to dashboard
          </button>
          <button
            className="text-sm md:text-base w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
            onClick={() => navigate("/assessment")}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
