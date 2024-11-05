import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical, BsPerson } from 'react-icons/bs';
import axios from 'axios';

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
      <span className="font-semibold">{value}%</span>
      <BsThreeDotsVertical className="text-gray-400 cursor-pointer hover:text-gray-600" />
    </div>
  </div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [overallScore, setOverallScore] = useState(null);

  const user = {
    firstName: 'Samantha',
    lastName: 'Smith'
  };

  const userInitials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/health-scores'); // we have to replace with actual API endpoint
        const data = response.data;

        const updatedMetrics = [
          {
            title: 'Physical Fitness',
            value: data.physicalFitness,
            status: data.physicalFitness >= 80 ? 'Excellent' : 'Good',
            color: '#3498db'
          },
          {
            title: 'Mental Wellness',
            value: data.mentalWellness,
            status: data.mentalWellness >= 70 ? 'Good' : 'Average',
            color: '#9b59b6'
          },
          {
            title: 'Diet',
            value: data.diet,
            status: data.diet >= 80 ? 'Excellent' : 'Fair',
            color: '#e67e22'
          },
          {
            title: 'Daily Routine',
            value: data.dailyRoutine,
            status: data.dailyRoutine >= 50 ? 'Good' : 'Need to Improve',
            color: '#2ecc71'
          }
        ];

        setMetrics(updatedMetrics);

        //It Calculates overall score
        const totalScore = updatedMetrics.reduce((acc, metric) => acc + metric.value, 0);
        const averageScore = Math.round(totalScore / updatedMetrics.length);
        setOverallScore(averageScore);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex flex-col fixed h-full"
           style={{
             background: 'linear-gradient(180deg, #3498db 0%, #2ecc71 100%)'
           }}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
            </div>
            <div>
              <h2 className="text-white font-semibold">Health Check Pro</h2>
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
  
      {/* Main Content and Footer Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              {userInitials}
            </div> */}
            {/* <button className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
              Logout
            </button> */}
          </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">You can Re-Take Assessment to update your score</h3>
                <p className="text-gray-500 text-sm max-w-md">
                  Discover your health insights and unlock a better you with Health Check Pro!
                </p>
                <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300 hover:bg-gray-800">
                  Take Re-Test To Update Score
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
