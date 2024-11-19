import * as Toast from "@radix-ui/react-toast";
import * as Progress from "@radix-ui/react-progress";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewUserAssessmentPage = () => {
  const user = useSelector(state => state.user);
  const userId = user.user._id;
  const navigate = useNavigate();
  const [ isNewRegistration, setIsNewRegistration ] = useState(false);
  const [ isNewAndIncomplete, setIsNewAndIncomplete ] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ completedCategories, setCompletedCategories ] = useState([]);
  const [ userCompletedCategoriesNames, setUserCompletedCategoriesNames ] = useState([]);

  const getStatus = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3000/user-assessment/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // userid: userId, // 6714f6b7e08a34409125cc0c
          "Authorization": `Bearer ${token}`
        },
      }
    );

    const status = await response.json();
    console.log({status});

    const completedCategoriesNumber = status.completedCategories?.length;
    setProgress(25 * completedCategoriesNumber);

    setCompletedCategories(status.completedCategories);
    console.log("completed categories: ", status.completedCategories)
    console.log({completedCategories});

    if(status.attemptNumber === 0) {
      setIsNewRegistration(true);
      console.log({status});
    } else if(status.attemptNumber === 1 && !status.isComplete) {
      setIsNewAndIncomplete(true);
      console.log({ status });
    } else if(status.isComplete) {
      navigate("/dashboard");
      console.log({ status })
    }

    getCategories();
  }

  const getCategories = async () => {
    const response = await fetch(`http://localhost:3000/categories`, {
      method: "GET"
    });

    const categories = await response.json();
    console.log({categories});

    const completedCategoriesNames = categories.map((category) => {
      if(completedCategories.includes(category._id)) {
        return category.categoryName.toUpperCase()
      }
    })

    console.log({completedCategoriesNames})
    setUserCompletedCategoriesNames(completedCategoriesNames);

    // console.log({categories});
    // console.log(categories.map((category) => category.categoryName.toUpperCase()));
    // setCompletedCategories(categories.map((category) => category.categoryName.toUpperCase()));
  }

  useEffect(() => {
    getStatus();
  }, [])

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r ">
        {" "}
        {/* from-green-300 to-blue-300 */}
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm max-w-4xl m-8 w-full">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <img
              src="../../health-assessment.png"
              alt="Doctor and patient interaction"
              className="rounded-xl w-full h-auto scale-90"
            />
          </div>
          {/* Right Section */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
            {isNewRegistration && (
              <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
                Welcome to Your Health Journey!
              </h2>
            )}
            {isNewAndIncomplete && (
              <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
                Great Start! Keep Going!
              </h2>
            )}

            {isNewRegistration && (
              <p className="text-gray-700 mb-4 text-center">
                Take your first assessment round to get personalized insights
              </p>
            )}
            {isNewAndIncomplete && (
              <p className="text-gray-700 mb-4 text-center">
                You&apos;ve made great progress! Complete the remaining
                assessments to get your overall health score.
              </p>
            )}

            <div className="flex items-center mb-10 space-x-4">
              <Progress.Root
                className="relative w-full bg-gray-200 rounded-full h-2.5 "
                value={progress}
              >
                <Progress.Indicator
                  className="absolute bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </Progress.Root>
              <div className="text-gray-500">{progress}%</div>
            </div>
            <p className="text-xs font-light text-gray-400 mb-3">
              Please complete the following assessments:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                className={
                  userCompletedCategoriesNames.includes("PHYSICAL")
                    ? "bg-green-100 text-blue-700 py-2 rounded-full cursor-default"
                    : "bg-red-100 hover:bg-blue-100 hover:shadow-sm text-blue-700 py-2 rounded-full"
                }
              >
                PHYSICAL
              </button>
              <button
                className={
                  userCompletedCategoriesNames.includes("MENTAL")
                    ? "bg-green-100 text-blue-700 py-2 rounded-full cursor-default"
                    : "bg-red-100 hover:bg-blue-100 hover:shadow-sm text-blue-700 py-2 rounded-full"
                }
              >
                MENTAL
              </button>
              <button
                className={
                  userCompletedCategoriesNames.includes("DIET")
                    ? "bg-green-100 text-blue-700 py-2 rounded-full cursor-default"
                    : "bg-red-100 hover:bg-blue-100 hover:shadow-sm text-blue-700 py-2 rounded-full"
                }
              >
                DIET
              </button>
              <button
                className={
                  userCompletedCategoriesNames.includes("LIFESTYLE")
                    ? "bg-green-100 text-blue-700 py-2 rounded-full cursor-default"
                    : "bg-red-100 hover:bg-blue-100 hover:shadow-sm text-blue-700 py-2 rounded-full"
                }
              >
                LIFESTYLE
              </button>
            </div>
            {isNewRegistration && (
              <button
                className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
                onClick={() => navigate("/assessment")}
              >
                Start Your Assessment
              </button>
            )}
            {isNewAndIncomplete && (
              <button
                className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
                onClick={() => navigate("/assessment")}
              >
                Continue Your Assessment
              </button>
            )}
          </div>
        </div>
        <Toast.Root
          open={false}
          onOpenChange={() => {}}
          className="fixed bottom-5 right-5 bg-white rounded-lg p-4 shadow-lg border border-gray-300"
        >
          <Toast.Title className="text-lg font-semibold text-gray-900">
            Success
          </Toast.Title>
          <Toast.Description className="mt-1 text-sm text-gray-600">
            Your progress has been saved.
          </Toast.Description>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-900">
            &times;
          </Toast.Close>
        </Toast.Root>
      </div>
    </Toast.Provider>
  );
};

export default NewUserAssessmentPage;
