import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendOTPClicked, setIsSendOTPClicked] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const sendOTP = async () => {
    const response = await fetch(`http://localhost:3000/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      console.log("sendotp: success");
      setOtpSuccess(true);
      setStep(2);
      setIsSendOTPClicked(true);
    }
  };

  const resetPassword = async () => {
    const response = await fetch(`http://localhost:3000/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });

    if(response.status === 200) {
        setResetPasswordSuccess(true)
        setStep(3)
    }
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
          <Link to="/signin" className="back-link">
            ← Back
          </Link>
          <h2>Pasword Reset</h2>

          {step === 1 && (
            <>
              <p className="auth-description">
                Verify your email to reset password
              </p>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              {/* <p>Enter your email: </p>
                        <input type="email" value={ email } onChange={(e) => setEmail(e.target.value)} /> */}
              <button className="" onClick={sendOTP}>
                Send OTP
              </button>
            </>
          )}

          {step === 2 && isSendOTPClicked && (
            <>
              {otpSuccess ? (
                <>
                  <div className="form-group">
                    <label htmlFor="password">Create new password</label>
                    <input
                      type="password"
                      id="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Confirm password</label>
                    <input
                      type="password"
                      id="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="otp">OTP</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                    />
                  </div>

                  <button onClick={resetPassword} className="submit-btn">
                    Reset Password
                  </button>
                  {/* <button onClick={ registerUser }>Register</button> */}
                </>
              ) : (
                <p>something went wrong while sending the OTP</p>
              )}
            </>
          )}

          {step == 3 && resetPasswordSuccess && (
            <>
              <p>Password reset successfully!</p>
              <button
                onClick={() => navigate("/signin")}
                className="submit-btn"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
