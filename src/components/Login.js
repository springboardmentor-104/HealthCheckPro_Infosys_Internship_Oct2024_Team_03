import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted', { email, password, rememberMe });
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        
        <div className="placeholder-image">
        <img src="/runningman.png" alt="Person on a treadmill" />
        </div>
      </div>
      <div className="auth-form">
        <Link to="/" className="back-link">← Back</Link>
        <h2>Account Login</h2>
        <p className="auth-description">
          If you are already a member you can login with your email address and password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Sampleuser@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group checkbox-forgot-wrapper">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className='remember-me' htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;