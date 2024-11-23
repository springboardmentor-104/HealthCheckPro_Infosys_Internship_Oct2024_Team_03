import { useState, useEffect, useCallback } from "react";
import { BsThreeDotsVertical, BsPerson } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; //for navigation
import * as Dialog from "@radix-ui/react-dialog";
import { changeDateFormatToNLN } from "../utils/convertDate";

//metricRow for displaying scores
const MetricRow = ({ icon, title, value, status, color }) => (
  <div className="flex items-center justify-between mb-2 md:mb-6 p-4 transition-transform transform hover:scale-105 rounded-3xl shadow-md bg-white hover:shadow-lg">
    <div className="flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 font-medium">{title}</h3>
        <p className="text-gray-500 text-sm">{status}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-semibold">{value}</span>
      <BsThreeDotsVertical className="text-gray-400 cursor-pointer hover:text-gray-600" />
    </div>
  </div>
);

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const userId = user.user._id;
  console.log({ userId }, "dash");
  const [metrics, setMetrics] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [overallScore, setOverallScore] = useState(null);
  const [latestCompleteAttempt, setLatestCompleteAttempt] = useState(null);
  const [anyIncompleteAttempt, setAnyIncompleteAttempt] = useState(null);
  const [isErrorWhileFetchingData, setIsErrorWhileFetchingData] =
    useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Used for navigation between pages

  const checkUserStatusAndRedirect = useCallback(async () => {
    try {
      setLoading(true);
      setIsErrorWhileFetchingData(false);
      const token = localStorage.getItem("token");
      const userStatus = await fetch(
        `http://localhost:3000/user-assessment/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ userStatus });

      if (!userStatus.ok) {
        setIsErrorWhileFetchingData(true);
      } else {
        setIsErrorWhileFetchingData(false);
      }

      const status = await userStatus.json();
      console.log({ status });

      if (
        status.attemptNumber === 0 ||
        (!status.isComplete && status.attemptNumber === 1)
      ) {
        navigate("/new-user-assessment");
      }
    } catch (error) {
      console.log(error);
      setIsErrorWhileFetchingData(true);
      setLoading(false);
    }
  }, [navigate]);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setIsErrorWhileFetchingData(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/user-assessment/latest-attempt",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { latestCompleteAttempt, latestIncompleteAttempt } = response.data;
      console.log("res: ", response.data);
      console.log({ latestIncompleteAttempt });

      if (latestIncompleteAttempt) {
        setAnyIncompleteAttempt(true);
      }

      if (latestCompleteAttempt) {
        // Map category IDs to titles and colors
        setLatestCompleteAttempt(true);
        const categoryTitles = {
          "6720b4b7138ac4c27924dbf2": "Physical Fitness",
          "6722653e8aebf1c473d1672b": "Mental Wellness",
          "67226bc38dec3d17c5368bd2": "Diet",
          "67226bdf8dec3d17c5368bd5": "Daily Routine",
        };

        const categoryColors = {
          "6720b4b7138ac4c27924dbf2": "#3498db",
          "6722653e8aebf1c473d1672b": "#9b59b6",
          "67226bc38dec3d17c5368bd2": "#e67e22",
          "67226bdf8dec3d17c5368bd5": "#2ecc71",
        };

        const updatedMetrics = latestCompleteAttempt.assessments.map(
          (assessment) => {
            const title =
              categoryTitles[assessment.categoryId] || "Unknown Category";
            const color = categoryColors[assessment.categoryId] || "#34495e";
            const status =
              assessment.totalScore >= 80
                ? "Excellent"
                : assessment.totalScore >= 50
                  ? "Good"
                  : "Needs Improvement";

            return { title, value: assessment.totalScore, status, color };
          }
        );

        setMetrics(updatedMetrics);
        setOverallScore(latestCompleteAttempt.overallScore);
      } else {
        setLatestCompleteAttempt(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching latest assessment attempt:", error.message);
      setIsErrorWhileFetchingData(true);
      setLoading(false);
    }
  }, []);

  const fetchHistoryOfAllAttempts = async() => {
    try {
      console.log("HIIIIII")
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/user-assessment/all-attempts", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const attempts = await response.json();
      console.log({attempts});

      setAttemptHistory(attempts.attemptHistory);

    } catch (error) {
      console.log(error);
    }
  }

  //function to fetch data from API
  useEffect(() => {
    checkUserStatusAndRedirect();
    fetchMetrics();
    fetchHistoryOfAllAttempts();
  }, [checkUserStatusAndRedirect, fetchMetrics]);

  const handleButtonClick = () => {
    navigate("/assessment"); //for navigation to AssessmentPage
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <video autoPlay loop>
            <source src="../../loading2.webm" type="video/webm" />
          </video>
        </div>
      ) : isErrorWhileFetchingData ? (
        <Dialog.Root
          open={isErrorWhileFetchingData}
          onOpenChange={setIsErrorWhileFetchingData}
        >
          <Dialog.Trigger className="hidden" />
          <Dialog.Overlay className="bg-black bg-opacity-30 fixed inset-0" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-9 rounded-3xl shadow-lg">
            <Dialog.Title className="text-2xl font-bold">Error</Dialog.Title>
            <Dialog.Description className="mt-2 mb-4">
              Unable to fetch assessment data. Please check if the server is
              running.
            </Dialog.Description>
            <div className="flex justify-center">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
                onClick={() => setIsErrorWhileFetchingData(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Sidebar */}
          {/* <div className={`fixed h-full w-64 z-20 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0`}
                style={{
                    background: 'linear-gradient(180deg, #3498db 0%, #2ecc71 100%)',
                    top: '64px',
                    zIndex: 30
                }}> */}
          {/* <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative"> */}
          {/* Any content, such as an avatar or user name, can go here */}
          {/* </div>
                    </div>
                    <nav className="space-y-4"> */}

          {/* {['Home', 'Assessment Report', 'Your Score History', 'Leaderboard', 'Accounts', 'Settings'].map((item, i) => (
                            <a
                                key={i}
                                href="#"
                                className={`block px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors ${i === 0 ? 'bg-white/10' : ''}`}
                            >
                                {item}
                            </a>
                        ))} */}
          {/* </nav>
                </div>
            </div> */}

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:mt-12">
            {/* md:ml-64 */}
            <header className="flex md:flex-row justify-between items-center p-4 bg-white">
              <h1 className="text-xl font-semibold text-gray-800 md:ml-4">
                Dashboard
                {/* <div className="bg-white mt-4 font-medium text-lg">
                  Hello {user.user.username}! Welcome to{" "}
                  <span className="">HealthCheckPro</span>
                </div> */}
              </h1>
              {/* <div className="flex flex-row items-center bg-gray-50 p-4 rounded-3xl mr-4 mt-4 md:mt-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                  <BsPerson className="text-3xl text-gray-600" />
                </div>
                <div className="flex-col ml-3 text-sm font-light">
                  <p>
                    Username:{" "}
                    <span className="font-normal">{user.user.username}</span>
                  </p>
                  <p>
                    Gender:{" "}
                    <span className="font-normal">{user.user.gender}</span>
                  </p>
                </div>
              </div> */}
              {/* <div className="flex justify-end mb-4 md:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="bg-white p-2 rounded-full shadow-lg"
                        >
                            {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                        </button>
                    </div> */}
            </header>
            <main className="p-8 flex-1 overflow-y-auto">
              {/* Current Score */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Current Score
                </h2>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <MetricRow
                    key={index}
                    icon={<BsPerson className="text-2xl text-gray-600" />}
                    title={metric.title}
                    value={metric.value}
                    status={metric.status}
                    color={metric.color}
                  />
                ))}
              </div>

              {/* Overall Score */}
              {overallScore !== null && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Overall Score
                  </h2>
                  <MetricRow
                    icon={<BsPerson className="text-2xl text-gray-600" />}
                    title="Overall Health Score"
                    value={overallScore}
                    status={
                      overallScore >= 75
                        ? "Great"
                        : overallScore >= 50
                        ? "Good"
                        : "Needs Improvement"
                    }
                    color="#34495e"
                  />
                </div>
              )}

              {/* Consult Card */}
              <div className="bg-white p-6 rounded-3xl shadow-md mt-6">
                <div className="flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {anyIncompleteAttempt
                        ? "Complete the remaining tests to get your score!"
                        : "You can Re-Take Assessment to update your score"}
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md">
                      Discover your health insights and unlock a better you with
                      Health Check Pro!
                    </p>
                    <button
                      className={`mt-4 px-4 text-sm bg-gradient-to-r text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 ${
                        anyIncompleteAttempt
                          ? "from-red-400 via-pink-500 to-purple-600"
                          : "from-green-400 via-blue-400 to-blue-600"
                      }`}
                      onClick={handleButtonClick}
                    >
                      {anyIncompleteAttempt
                        ? "Continue Assessment"
                        : "Take Re-Test To Update Score"}
                    </button>
                  </div>
                  <img
                    src="https://media.licdn.com/dms/image/D4D12AQGHf3cXB-a_Pw/article-cover_image-shrink_720_1280/0/1679989721915?e=2147483647&v=beta&t=gSRxaHbmONY15TSKarHDWWZEiSYzFeOHCL-OaXyQ2ns"
                    className="mx-auto md:mx-0 mt-5 md:mt-0"
                    style={{
                      width: "300px",
                      borderRadius: "15px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                    alt="Doctor consultation"
                  />
                </div>
              </div>

              {/* Table for Assessment History */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Assessment History
                </h2>
                <div className="rounded-3xl overflow-x-auto border-slate-400">
                  <table className="min-w-full table-auto border-collapse text-md bg-white">
                    <thead className="bg-green-50 text-gray-700">
                      <tr>
                        <th className="py-3 px-4 border border-gray-300">
                          Attempt Number
                        </th>
                        <th className="py-3 px-4 border border-gray-300">
                          Time Stamp
                        </th>
                        <th className="py-3 px-4 border border-gray-300">
                          Overall Score
                        </th>
                        <th className="py-3 px-4 border border-gray-300">
                          View Board
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attemptHistory.map((attempt) => (
                        <tr
                          key={attempt._id}
                          className="hover:bg-gray-100 text-center"
                        >
                          <td className="py-3 px-4 border border-gray-300">
                            {attempt.attemptNumber}
                          </td>
                          <td className="py-3 px-4 border border-gray-300">
                            {changeDateFormatToNLN(attempt.date)}
                          </td>
                          <td className="py-3 px-4 border border-gray-300">
                            {attempt.isComplete ? attempt.overallScore : "-"}
                          </td>
                          <td className="py-3 px-4 border border-gray-300">
                            <button
                              className={`py-1 px-3 rounded-full  ${
                                attempt.isComplete
                                  ? "bg-blue-500 hover:bg-green-400 text-white"
                                  : "text-black bg-red-50 cursor-default"
                              }`}
                              onClick={() =>
                                navigate(
                                  `/report/attempt/${attempt.attemptNumber}/`,
                                  { state: { attemptId: attempt._id } }
                                )
                              }
                            >
                              {attempt.isComplete ? "View" : "Incomplete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4">
              <div className="container mx-auto flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">About Us</h3>
                  <p className="text-sm">We are a leading company in...</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Contact Us</h3>
                  <p className="text-sm">Email: contact@example.com</p>
                  <p className="text-sm">Phone: (123) 456-7890</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Follow Us</h3>
                  <div className="flex space-x-2">
                    <a href="#" className="text-blue-400 hover:text-blue-500">
                      Facebook
                    </a>
                    <a href="#" className="text-blue-300 hover:text-blue-400">
                      Twitter
                    </a>
                    <a href="#" className="text-pink-400 hover:text-pink-500">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;