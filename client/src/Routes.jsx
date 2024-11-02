import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./Layout";
import NewUserAssessmentPage from "./pages/NewUserAssessmentPage";
import AssessmentPage from "./pages/AssessmentPage";
import Dashboard from "./pages/Dashboard";

const routes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/new-user-assessment" element={<NewUserAssessmentPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default routes;
