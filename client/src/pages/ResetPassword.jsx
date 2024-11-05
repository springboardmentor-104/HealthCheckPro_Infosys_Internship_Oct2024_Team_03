import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSendOtp = async () => {
    const response = await fetch(`http://localhost:3000/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      setShowOtpInput(true);
      setToastMessage("OTP sent successfully.");
      setShowSuccessNotification(true);
      setOtpSent(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    }
  };

  const handleVerifyOtp = async () => {
    const response = await fetch(
      `http://localhost:3000/auth/email-verification`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (response.status === 200) {
      setToastMessage("OTP verified successfully.");
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      setOtpVerified(true);
    }
  };

  const handleResetpassword = async () => {
    const response = await fetch(`http://localhost:3000/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword: password,
      }),
    });

    if (response.status === 200) {
      setResetPasswordSuccess(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm max-w-4xl m-8 w-full">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <img
              src="../../reset-pass.webp"
              alt="graphic of man working out in gym"
              className="rounded-xl w-full h-auto"
            />
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-50">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
              Reset Password
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              Check your email for an OTP to reset your password securely.
            </p>
            {!isOtpVerified && !otpSent && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
                >
                  Send OTP
                </button>
                <p className="text-gray-700 mb-4 text-center font-light mt-2 text-sm">
                  Back to
                  <span
                    className="font-normal text-blue-500 hover:underline hover:cursor-pointer ml-1"
                    onClick={() => navigate("/signin")}
                  >
                    Sign In
                  </span>
                </p>
              </>
            )}

            {otpSent && !isOtpVerified && (
              <div className="mb-4">
                <h3 className="justify-center">
                  Enter OTP that sent to {email}
                </h3>
              </div>
            )}

            {showOtpInput && !isOtpVerified && (
              <div className="mt-4">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-medium mb-2"
                >
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mt-4"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {isOtpVerified && !resetPasswordSuccess && (
              <>
                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Create new password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetpassword}
                  className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mt-4"
                >
                  Reset Password
                </button>
              </>
            )}

            {resetPasswordSuccess && (
              <>
                <p>Successfully resetted password for email {email}</p>
                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mt-4"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
        <Toast.Root
          open={showSuccessNotification}
          onOpenChange={(open) => setShowSuccessNotification(open)}
          className="fixed bottom-5 right-5 bg-white rounded-lg p-4 shadow-lg border border-gray-300"
        >
          <Toast.Title className="text-lg font-semibold text-gray-900">
            Success
          </Toast.Title>
          <Toast.Description className="mt-1 text-sm text-gray-600">
            {toastMessage}
          </Toast.Description>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-900">
            &times;
          </Toast.Close>
        </Toast.Root>
      </div>
    </Toast.Provider>
  );
};

export default ResetPassword;
