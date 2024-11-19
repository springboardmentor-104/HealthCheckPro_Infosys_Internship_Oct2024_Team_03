import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  console.log("ISAUTH: ", isAuthenticated)
  console.log("isAuthen-prot: ", isAuthenticated);
  
  const navigate = useNavigate();

  // Temporary Solution
  // ERROR: don't use function here.....
  // Fix it....
  const goToSignIn = () => {
    navigate("/signin");
  };
  

    return isAuthenticated ? children : <Navigate to="/signin" replace />; // use this only
  // return isAuthenticated ? children : goToSignIn;
};

export default ProtectedRoute;
