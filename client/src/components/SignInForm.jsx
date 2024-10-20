import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:3000/auth/signin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) navigate("/home");
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-image">
          <div className="placeholder-image">
            <img src="/runningman.png" alt="Person on a treadmill" />
          </div>
        </div>
        <div className="auth-form">
          {/* <Link to="/" className="back-link">
            ← Back
          </Link> */}
          <h2>Account Login</h2>
          <p className="auth-description">
            If you are already a member you can login with your email address
            and password.
          </p>
          <form onSubmit={handleSignin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </div>
            <Link to="/reset-password" className="forgot-password">
              Forgot Password?
            </Link>
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
      
    </>
  );
};

export default SignInForm;
