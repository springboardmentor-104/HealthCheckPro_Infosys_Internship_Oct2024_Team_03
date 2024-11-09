import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical, BsPerson } from 'react-icons/bs';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; //for navigation 

//metricRow for displaying scores
const MetricRow = ({ icon, title, value, status, color }) => (
    <div className="flex items-center justify-between mb-6 p-4 transition-transform transform hover:scale-105 rounded-lg shadow-md bg-white hover:shadow-lg">
        <div className="flex items-center gap-4">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
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
    // const user = useSelector(state => state.user);
    const userId = "6714f6b7e08a34409125cc0c";
    const [metrics, setMetrics] = useState([]);
    const [overallScore, setOverallScore] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [latestCompleteAttempt, setLatestCompleteAttempt] = useState(null);

    const navigate = useNavigate(); // Used for navigation between pages

    //function to fetch data from API
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/user-assessment/latest-attempt",
                    {
                        headers: { userid: userId }
                    }
                );
                const { latestCompleteAttempt } = response.data;

                if (latestCompleteAttempt) {
                    // Map category IDs to titles and colors
                    setLatestCompleteAttempt(true);
                    const categoryTitles = {
                        "6720b4b7138ac4c27924dbf2": "Physical Fitness",
                        "6722653e8aebf1c473d1672b": "Mental Wellness",
                        "67226bc38dec3d17c5368bd2": "Diet",
                        "67226bdf8dec3d17c5368bd5": "Daily Routine"
                    };

                    const categoryColors = {
                        "6720b4b7138ac4c27924dbf2": "#3498db",
                        "6722653e8aebf1c473d1672b": "#9b59b6",
                        "67226bc38dec3d17c5368bd2": "#e67e22",
                        "67226bdf8dec3d17c5368bd5": "#2ecc71"
                    };

                    const updatedMetrics = latestCompleteAttempt.assessments.map((assessment) => {
                        const title = categoryTitles[assessment.categoryId] || "Unknown Category";
                        const color = categoryColors[assessment.categoryId] || "#34495e";
                        const status = assessment.totalScore >= 80 ? 'Excellent' : assessment.totalScore >= 50 ? 'Good' : 'Needs Improvement';

                        return { title, value: assessment.totalScore, status, color };
                    });

                    setMetrics(updatedMetrics);
                    setOverallScore(latestCompleteAttempt.overallScore);
                } else {
                    setLatestCompleteAttempt(false);
                }
            } catch (error) {
                console.error('Error fetching latest assessment attempt:', error.message);
                alert('Unable to fetch assessment data. Please check if the server is running.');
            }
        };

        fetchMetrics();
    }, []);

    const handleButtonClick = () => {
        if (latestCompleteAttempt) {
            navigate('/NewUserAssessmentPage'); //for navigation to NewUserAssessmentPage
        } else {
            navigate('/AssessmentPage'); //for navigation to AssessmentPage
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed h-full w-64 z-20 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0`}
                style={{
                    background: 'linear-gradient(180deg, #3498db 0%, #2ecc71 100%)',
                    top: '64px',
                    zIndex: 30
                }}>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            {/* Any content, such as an avatar or user name, can go here */}
                        </div>
                    </div>
                    <nav className="space-y-4">
                        {['Home', 'Assessment Report', 'Your Score History', 'Leaderboard', 'Accounts', 'Settings'].map((item, i) => (
                            <a
                                key={i}
                                href="#"
                                className={`block px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors ${i === 0 ? 'bg-white/10' : ''}`}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Toggle button for sidebar */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="bg-white p-2 rounded-full shadow-lg"
                >
                    {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <header className="flex justify-between items-center p-4 bg-white shadow-md">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                </header>

                <main className="p-8 flex-1 overflow-y-auto">
                    {/* Current Score */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Your Current Score</h2>
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
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h2>
                            <MetricRow
                                icon={<BsPerson className="text-2xl text-gray-600" />}
                                title="Overall Health Score"
                                value={overallScore}
                                status={overallScore >= 75 ? 'Great' : overallScore >= 50 ? 'Good' : 'Needs Improvement'}
                                color="#34495e"
                            />
                        </div>
                    )}

                    {/* Consult Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {latestCompleteAttempt
                                        ? "You can Re-Take Assessment to update your score"
                                        : "Complete the remaining tests to get your score!"}
                                </h3>
                                <p className="text-gray-500 text-sm max-w-md">
                                    Discover your health insights and unlock a better you with Health Check Pro!
                                </p>
                                <button
                                    className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300 hover:bg-gray-800"
                                    onClick={handleButtonClick}
                                >
                                    {latestCompleteAttempt ? "Take Re-Test To Update Score" : "Continue Assessment"}
                                </button>
                            </div>
                            <img
                                src="https://media.licdn.com/dms/image/D4D12AQGHf3cXB-a_Pw/article-cover_image-shrink_720_1280/0/1679989721915?e=2147483647&v=beta&t=gSRxaHbmONY15TSKarHDWWZEiSYzFeOHCL-OaXyQ2ns"
                                style={{ width: "300px", borderRadius: "15px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}
                                alt="Doctor consultation"
                            />
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
                                <a href="#" className="text-blue-400 hover:text-blue-500">Facebook</a>
                                <a href="#" className="text-blue-300 hover:text-blue-400">Twitter</a>
                                <a href="#" className="text-pink-400 hover:text-pink-500">Instagram</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
