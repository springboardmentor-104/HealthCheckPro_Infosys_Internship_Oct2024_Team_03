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

  const fetchAttempt = useCallback(async () => {
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
  }, [attemptId, categories, attemptData]);

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
  }, [attemptId, currentAssessmentContent]);
  
  useEffect(() => {
    if(!attemptId) {
      navigate("/dashboard");
    }
    fetchAttempt();
  }, [fetchAttempt]);

  useEffect(() => {
    if(selectedCategory) {
      fetchCurrentAssessmentUserQuestions(selectedCategory)
    }
  }, [selectedCategory, fetchCurrentAssessmentUserQuestions])


  const defaultResponses = [
    {
      question: "How often do you exercise?",
      choice: "3-4 times a week",
      advice: "Great job! Consistency is key to staying fit.",
    },
    {
      question: "How often do you experience stress?",
      choice: "Frequently",
      advice:
        "Consider practicing mindfulness or yoga to manage stress better.",
    },
    {
      question: "Do you eat vegetables daily?",
      choice: "Sometimes",
      advice:
        "Try to include more vegetables in your meals for better nutrition.",
    },
    {
      question: "How many hours do you sleep daily?",
      choice: "5-6 hours",
      advice: "Aim for 7-8 hours of sleep to improve overall health.",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 m-8 md:mt-20">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 text-center">
            Assessment Report
          </h2>

          <div className="text-center w-auto max-w-md">
            <p className="font-normal text-gray-800">
              Attempt Number:
              <span className="font-medium text-gray-900">
                {attemptData.attemptNumber}
              </span>
            </p>
            <p className="font-normal text-gray-800">
              Date: <span className="font-medium text-gray-900">{date}</span>
            </p>
          </div>
        </div>

        {/* Health Insights Section */}
        <div className="bg-gradient-to-r from-yellow-200 via-orange-300 to-pink-400 rounded-3xl p-8 mt-6 shadow-sm transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center space-x-4 mb-4">
            <FaHeartbeat size={32} className="text-red-600" />
            <h3 className="text-2xl font-semibold text-red-800">
              Health Insights
            </h3>
          </div>
          <p className="text-gray-700">
            Based on your responses, we recommend focusing on maintaining a
            balanced diet and regular exercise to improve your overall health.
          </p>
        </div>

        {/* Category Scores Section */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 ml-3">
            Category Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col items-center justify-center p-6  rounded-2xl shadow-md transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer ${selectedCategory && selectedCategory === category.id ? "bg-green-100" : "bg-gray-100"}`}
                onClick={() => setSelectedCateogry(category.id)}
              >
                {category.icon}
                <h4 className="text-xl font-medium text-gray-800 mt-2">
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
        <div className="mt-8  bg-gray-100  p-6 rounded-3xl shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Responses
          </h3>
          <div className="space-y-4">
            {currentAssessmentContent.questions &&
              currentAssessmentContent.questions.map((question, index) => (
                <div
                  key={question._id}
                  className="p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-400"
                >
                  <p className="text-lg font-medium text-gray-800">
                    <span className="mr-4">Q.{index + 1}&#41;</span>
                    {question.questionText}
                  </p>
                  <div className="ml-14">
                    <p className="text-gray-700 mt-1">
                      <span className="font-semibold">Selected Answer: </span>
                      {question.selectedOptionText}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-semibold">Advice:</span> -
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="mt-8 bg-gray-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Comparison Chart
          </h3>
          <div className="h-64 w-full">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            className="w-full bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
            onClick={() => window.location.reload()}
          >
            Retake Assessment
          </button>
          <button
            className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
            onClick={() => alert("Thank you for using Health Check Pro!")}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
