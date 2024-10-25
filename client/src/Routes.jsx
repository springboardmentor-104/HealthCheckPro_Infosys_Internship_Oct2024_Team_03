import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./Layout";

const routes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default routes;
