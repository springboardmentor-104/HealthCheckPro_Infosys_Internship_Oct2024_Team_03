import * as Toast from "@radix-ui/react-toast";
import * as Progress from "@radix-ui/react-progress";
import { useState } from "react";

const NewUserAssessmentPage = () => {
  const [ isNewRegistration, setIsNewRegistration ] = useState(false);
  const [progress, setProgress] = useState(25);

  const getStatus = async (req, res) => {
    const response = await fetch(`http://localhost:3000/user-assessment/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "userid": "6714f6b7e08a34409125cc0c"
      }
    });

    const status = await response.json();
    console.log({status});

    if(status.attemptNumber === 0) {
      
    } else if(status.attemptNumber === 1 && !status.isComplete) {

    } else if(status.isComplete) {
      
    }

    
  }

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r "> {/* from-green-300 to-blue-300 */}
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
            <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
              Great Start! Keep Going!
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              You&apos;ve made great progress! Complete the remaining
              assessments to get your overall health score.
            </p>
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
              <button className="bg-green-100 text-blue-700 py-2 rounded-full">
                PHYSICAL
              </button>
              <button className="bg-red-100 text-blue-700 py-2 rounded-full">
                MENTAL
              </button>
              <button className="bg-red-100 text-blue-700 py-2 rounded-full">
                DIET
              </button>
              <button className="bg-red-100 text-blue-700 py-2 rounded-full">
                LIFESTYLE
              </button>
            </div>
            <button className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200">
              Continue Your Assessment
            </button>
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
