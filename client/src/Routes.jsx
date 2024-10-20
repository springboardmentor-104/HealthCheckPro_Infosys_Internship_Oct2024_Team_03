import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"

const routes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </Router>
    )
}

export default routes