// src/components/Navbar2.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar2 = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">HealthCheckPro</h1>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-400">Home</Link>
          <Link to="/articles" className="text-white hover:text-gray-400">Articles</Link>
          <Link to="/assessment" className="text-white hover:text-gray-400">Assessment</Link>
          <Link to="/dashboard" className="text-white hover:text-gray-400">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
