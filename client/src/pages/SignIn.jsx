import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSignIn = async () => {
    const response = await fetch(`http://localhost:3000/auth/signin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    console.log({responseJson})

    if (response.status === 200) {
      console.log("loggedIn successfully!");
      setToastMessage("LoggedIn successfully!");
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      localStorage.setItem("token", responseJson.token)
      dispatch(setUser(responseJson.user));
      
      navigate("/dashboard");
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm max-w-4xl m-8 w-full">
          {/* Left Section */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <img
              src="../../runningman.png"
              alt="Man running with water bottle"
              className="rounded-xl w-full h-auto scale-150"
            />
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-50">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900 text-center md:text-left">
              Sign In
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              Welcome back! Please enter your email and password to sign in.
            </p>
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
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link
              to="/reset-password"
              className="text-blue-500 text-sm hover:underline mt-2 inline-block text-right mr-4"
            >
              Forgot Password?
            </Link>

            <button
              type="button"
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-blue-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mt-4"
            >
              Sign In
            </button>
            <p className="text-gray-700 mb-4 text-center font-light mt-2 text-sm">
              Don&apos;t have an account?{" "}
              <span
                className="font-normal text-blue-500 hover:underline hover:cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
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

export default SignIn;
