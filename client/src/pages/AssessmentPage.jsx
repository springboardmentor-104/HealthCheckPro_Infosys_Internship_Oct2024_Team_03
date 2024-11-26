import { useEffect, useState, useCallback } from "react";
import Stepper from "../components/Stepper";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

const AssessmentPage = () => {
  console.log("assessment page...............")
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userId = user.user._id;
  // const userId = "671a2da9af9bcc1085287531"; //user.user._id;

  const [loading, setLoading] = useState(true);
  const [isErrorWhileFetchingData, setIsErrorWhileFetchingData] = useState(true);

  // store all fetched categories
  const [assessmentCategories, setAssessmentCategories] = useState([]);

  // store incomplete assessments by fetching status
  const [incompleteAssessments, setIncompleteAssessments] = useState([]);

  // store current assessment category's id
  const [currentCategory, setCurrentCategory] = useState(null);

  // store fetched questions of current assessment category
  const [currentCategoryQuestions, setCurrentCategoryQuestions] = useState([]);

  // index of current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // selected option of that question
  const [selectedOption, setSelectedOption] = useState(null);

  // map each question with selected answer
  const [questionAnswers, setQuestionAnswers] = useState({});

  const [attemptNumber, setAttemptNumber] = useState(0);

  const [status, setStatus] = useState({});

  const [gotoAssessment, setGotoAssessment] = useState(false);

  const [isOpen, setIsOpen] = useState(true);

  const [completedSteps, setCompletedSteps] = useState(new Set());

  // --------------- functions --------------------------
  // 1. fetch all categories from the database
  const getCategories = useCallback(async () => {
    try {
      setLoading(true)
      setIsErrorWhileFetchingData(false);
      const response = await fetch(`http://localhost:3000/categories`);
      const allCategories = await response.json();
      setAssessmentCategories(allCategories);
      setLoading(false);
      return allCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
      setIsErrorWhileFetchingData(true);
      return [];
    }
  }, []);

  const startAssessment = useCallback(async (categoryId) => {
    setLoading(true)
    setIsErrorWhileFetchingData(false);
    console.log({ categoryId });
    setCurrentCategory(categoryId);
    setQuestionAnswers({}); // Reset answers for new category
    try {
      const response = await fetch(
        `http://localhost:3000/categories/${categoryId}/questions`
      );
      const questions = await response.json();
      setCurrentCategoryQuestions(questions);
      console.log({ currentCategoryQuestions: questions });
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
      setIsErrorWhileFetchingData(true);
    }
  }, []);

  // 2. fetch status of user to get incomplete categories in an assessment round
  const getStatus = useCallback(
    async (categories) => {
      try {
        setLoading(true);
        setIsErrorWhileFetchingData(false);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/user-assessment/status`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );
        const status = await response.json();
        console.log({ status });
        setStatus(status);

        if (status.isComplete || status.attemptNumber === 0) {
          setIncompleteAssessments(categories);
          console.log(
            "Starting new assessment round with all categories:",
            categories
          );

          if(status.isComplete) {
            setAttemptNumber(status.attemptNumber + 1);
          }

          if (categories.length > 0) {
            await startAssessment(categories[0]._id);
          }
        } else {
          setCompletedSteps(new Set(status.completedCategories));
          const incompleteCategories = categories.filter(
            (category) => !status.completedCategories.includes(category._id)
          );
          console.log({ incompleteCategories });
          setIncompleteAssessments(incompleteCategories);
          setAttemptNumber(status.attemptNumber);
          if (incompleteCategories.length > 0) {
            await startAssessment(incompleteCategories[0]._id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
        setLoading(false);
        setIsErrorWhileFetchingData(true);
      }
    },
    [startAssessment]
  );

  useEffect(() => {
    const initializeAssessment = async () => {
      const categories = await getCategories();
      if (categories.length > 0) {
        await getStatus(categories);
      }
    };
    initializeAssessment();
  }, [getCategories, getStatus]);

  const handleCompleteStep = (currentCategory) => { 
    // Create a new Set based on the current state 
    const updatedCompletedSteps = new Set(completedSteps); 
    // Add the current category to the new set 
    updatedCompletedSteps.add(currentCategory); 
    // Update the state with the new set 
    setCompletedSteps(updatedCompletedSteps);
  }

  const submitAssessment = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/user-assessment/submit`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            categoryId: currentCategory,
            questions: currentCategoryQuestions.map((question) => ({
              questionId: question._id,
              selectedOptionId: questionAnswers[question._id] || null,
            })),
          }),
        }
      );

      const submitStatus = await response.json();
      console.log({ submitStatus });
      if (response.ok) {
        console.log("Assessment submitted successfully.");
        handleCompleteStep(currentCategory);
        moveToNextIncompleteAssessment();
      } else {
        console.error("Error submitting assessment.");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };

  const moveToNextIncompleteAssessment = () => {
    const updatedIncomplete = incompleteAssessments.filter(
      (cat) => cat._id !== currentCategory
    );
    setIncompleteAssessments(updatedIncomplete);

    if (updatedIncomplete.length > 0) {
      startAssessment(updatedIncomplete[0]._id);
    } else {
      console.log("All assessments completed in this round");
      navigate("/dashboard");
    }
  };

  const handleOptionChange = (id) => {
    const currentQuestionId =
      currentCategoryQuestions[currentQuestionIndex]._id;
    // const selectedOption = currentCategoryQuestions[
    //   currentQuestionIndex
    // ].options.find((option) => option._id === id);

    setQuestionAnswers((prev) => ({
      ...prev,
      // [currentQuestionId]: {
      //   id: selectedOption._id,
      //   text: selectedOption.optionText,
      // },
      [currentQuestionId]: id,
    }));

    setSelectedOption(id);
    console.log({questionAnswers});
  };


  const handleNext = () => {
    if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQuestionId =
        currentCategoryQuestions[currentQuestionIndex + 1]._id;
      setSelectedOption(questionAnswers[nextQuestionId] || null);
    } else {
      submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestionId =
        currentCategoryQuestions[currentQuestionIndex - 1]._id;
      setSelectedOption(questionAnswers[prevQuestionId] || null);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (completedSteps.has(currentCategory) || currentCategory === categoryId) {
      startAssessment(categoryId);
    } else {
      alert("Please complete the current category first.");
    }
  };

  const getButtonLabel = () => {
    if (status.isComplete) {
      return "Start New Assessment Round";
    } else if (status.attemptNumber === 0) {
      return `Start Assessment Round ${status.attemptNumber + 1}`;
    } else {
      return `Continue Assessment Round ${status.attemptNumber}`;
    }
  };

  const handleClick = () => {
    setGotoAssessment(true);
    setIsOpen(false);
  }

  if(!status) return;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 p-6 sm:p-10 flex items-center justify-center md:mt-10">
      <>
        {loading ? (
          // <img src="../../loading.gif" alt="Loading ....." /> // Your loading indicator here
          <video autoPlay loop>
            <source src="../../loading2.webm" type="video/webm" />
          </video>
        ) : isErrorWhileFetchingData ? (
          <Dialog.Root
            open={isErrorWhileFetchingData}
            onOpenChange={setIsErrorWhileFetchingData}
          >
            {" "}
            <Dialog.Trigger className="hidden" />{" "}
            <Dialog.Overlay className="bg-black bg-opacity-30 fixed inset-0" />{" "}
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-9 rounded-3xl shadow-lg">
              {" "}
              <Dialog.Title className="text-2xl font-bold">
                Error
              </Dialog.Title>{" "}
              <Dialog.Description className="mt-2 mb-4">
                {" "}
                Unable to fetch assessment data. Please check if the server is
                running.{" "}
              </Dialog.Description>{" "}
              <div className="flex justify-center">
                {" "}
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
                  onClick={() => setIsErrorWhileFetchingData(false)}
                >
                  {" "}
                  Close{" "}
                </button>{" "}
              </div>{" "}
            </Dialog.Content>{" "}
          </Dialog.Root>
        ) : (
          <>
            {gotoAssessment || !isOpen ? (
              <div className="flex flex-col sm:flex-row gap-6 max-w-5xl w-full">
                <div className="w-full sm:w-1/4 max-w-[280px]">
                  <Stepper
                    currentCategory={currentCategory}
                    categories={assessmentCategories}
                    completedSteps={completedSteps}
                    onCategoryClick={handleCategoryClick}
                    attemptNumber={attemptNumber}
                  />
                </div>
                <div className="flex-1 max-w-2xl">
                  {currentCategoryQuestions.length > 0 ? (
                    <div className="bg-white bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
                      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 animate-pulse">
                          {
                            assessmentCategories.find(
                              (cat) => cat._id === currentCategory
                            )?.categoryName
                          }{" "}
                          Assessment
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          Question {currentQuestionIndex + 1} of{" "}
                          {currentCategoryQuestions.length}
                        </p>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-8">
                          {
                            currentCategoryQuestions[currentQuestionIndex]
                              ?.questionText
                          }
                        </h3>
                        <RadioGroup.Root
                          className="flex flex-col space-y-3 w-full sm:w-3/4"
                          value={selectedOption}
                          onValueChange={handleOptionChange}
                        >
                          {currentCategoryQuestions[
                            currentQuestionIndex
                          ]?.options.map((option) => (
                            <RadioGroup.Item
                              key={option._id}
                              value={option._id}
                              className={`flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                selectedOption === option._id
                                  ? "bg-blue-100 border-blue-400"
                                  : "bg-white"
                              }`}
                            >
                              <RadioGroup.Indicator className="mr-3">
                                <div
                                  className={`w-4 h-4 rounded-full ${
                                    selectedOption === option._id
                                      ? "bg-blue-400"
                                      : "bg-gray-300"
                                  }`}
                                ></div>
                              </RadioGroup.Indicator>
                              <span className="text-sm sm:text-base text-gray-800">
                                {option.optionText}
                              </span>
                            </RadioGroup.Item>
                          ))}
                        </RadioGroup.Root>

                        <div className="flex justify-between mt-8 w-full sm:w-3/4">
                          {currentQuestionIndex > 0 && (
                            <button
                              className="w-1/3 bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-semibold hover:bg-gray-300 transition duration-300 transform hover:scale-105"
                              onClick={handlePrevious}
                            >
                              Previous
                            </button>
                          )}
                          <button
                            className={`w-1/3 ${
                              currentQuestionIndex <
                              currentCategoryQuestions.length - 1
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white hover:opacity-90 "
                            } text-white py-2 px-4 rounded-full text-sm font-semibold transition duration-300 transform hover:scale-105`}
                            onClick={handleNext}
                          >
                            {currentQuestionIndex <
                            currentCategoryQuestions.length - 1
                              ? "Next"
                              : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Loading Assessment...
                      </h2>
                      <p className="text-gray-600">
                        Please wait while we prepare your assessment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Trigger className="hidden" />
                <Dialog.Overlay className="bg-black bg-opacity-30 fixed inset-0" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-9 rounded-3xl shadow-lg">
                  <Dialog.Title className="text-2xl font-bold">
                    Assessment
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 mb-4">
                    {status.isComplete
                      ? `You have completed all tests in latest round number ${status.attemptNumber}`
                      : `You have incomplete assessments in round number ${status.attemptNumber}`}
                  </Dialog.Description>
                  <div className="flex space-x-4">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600"
                      onClick={() => handleClick()}
                    >
                      {getButtonLabel()}
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Root>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default AssessmentPage;
