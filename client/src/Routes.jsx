
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import HomePage from "./pages/HomePage"
import ResetPassword from "./pages/ResetPassword"

const routes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    )
}

export default routes