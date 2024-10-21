import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    dob: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Signup Successful!');
  };

  return (
    <div className="signup-container">
      <div className="left-section">
        <img 
          src="/fitness.jpg" 
          alt="Fitness Illustration" 
          className="illustration"
        />
      </div>

      <div className="right-section">
        <div className="back-container">
          <button className="back-button">&larr; Back</button>
        </div>

        <h2>Account Signup</h2>
        <p>Your commitment to health is paying off. Keep it up!</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Gender</label>
          <input
            type="text"
            name="gender"
            placeholder="Male / Female"
            value={formData.gender}
            onChange={handleChange}
          />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <button type="submit" className="continue-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
