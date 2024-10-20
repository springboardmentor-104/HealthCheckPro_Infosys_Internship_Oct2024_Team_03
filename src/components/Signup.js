import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log('Signup submitted', { fullName, email, gender, dateOfBirth });
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        
        <div className="placeholder-image">
        
        <img src="/gymman.png" alt="Person in a Gym" />
        </div>
      </div>
      <div className="auth-form">
        <Link to="/" className="back-link">← Back</Link>
        <h2>Account Signup</h2>
        <p className="auth-description">
          Your commitment to health is paying off. Keep it up!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Full Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sampleuser@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <input
              type="text"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Enter Gender"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="Enter Date of Birth"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;