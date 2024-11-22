import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./Layout";
import NewUserAssessmentPage from "./pages/NewUserAssessmentPage";
import AssessmentPage from "./pages/AssessmentPage";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard"
import Report from "./pages/Report"
import ProtectedRoute from "./components/ProtectedRoute";

const routes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/new-user-assessment"
            element={
              <ProtectedRoute>
                <NewUserAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
            } 
          />
          <Route path="/report/attempt/:attemptNumber" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default routes;
