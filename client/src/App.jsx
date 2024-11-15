import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Landing Page Sections
import HeroSection from './components/HeroSection';
import ArticleSection from './components/ArticleSection';
import InputSection from './components/InputSection';
import QuoteSection from './components/QuoteSection';

// Page Components
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';
import Homepage from './pages/Homepage';
import NewUserAssessmentPage from './pages/NewUserAssessmentPage';
import Assessment from './pages/AssessmentPage';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard'; // Importing Leaderboard

// Layout Component
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Landing Page Sections */}
        <Route path="/" element={
          <>
            <HeroSection />
            <InputSection />
            <QuoteSection />
            <ArticleSection />
          </>
        } />
        
        {/* Additional Routes */}
        <Route path="/articles" element={<ArticleSection />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> {/* New Leaderboard Route */}

        {/* Nested Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/new-user-assessment" element={<NewUserAssessmentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
