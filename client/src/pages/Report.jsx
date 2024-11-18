import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Complete Question Data
const questions = [
  // Diet Questions
  {
    category: "Diet",
    question: "How many servings of fruits and vegetables do you eat per day?",
    options: ["0-1 servings", "2-3 servings", "3-4 servings", "5+ servings"],
  },
  {
    category: "Diet",
    question: "How often do you consume fast food or processed snacks?",
    options: ["Daily", "3-4 times a week", "Once a week", "Rarely"],
  },
  {
    category: "Diet",
    question: "How much water do you drink per day?",
    options: ["Less than 4 cups", "4-7 cups", "8-10 cups", "11+ cups"],
  },
  {
    category: "Diet",
    question: "How often do you eat breakfast?",
    options: ["Rarely", "1-2 times a week", "3-4 times a week", "Every day"],
  },
  {
    category: "Diet",
    question: "How often do you consume sugary drinks?",
    options: ["Several times a day", "Once a day", "A few times a week", "Rarely"],
  },

  // Mental Well-being Questions
  {
    category: "Mental Well-being",
    question: "How often do you feel stressed or anxious?",
    options: ["Daily", "Often", "Occasionally", "Rarely"],
  },
  {
    category: "Mental Well-being",
    question: "How often do you feel rested after sleep?",
    options: ["Never", "Occasionally", "Most of the time", "Always"],
  },
  {
    category: "Mental Well-being",
    question: "How often do you engage in activities that help you relax?",
    options: ["Never", "Rarely", "Occasionally", "Every day"],
  },
  {
    category: "Mental Well-being",
    question: "How would you rate your overall mood in the past week?",
    options: ["Very poor", "Poor", "Neutral", "Good", "Excellent"],
  },
  {
    category: "Mental Well-being",
    question: "How often do you feel supported by family or friends?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },

  // Lifestyle Questions
  {
    category: "Lifestyle",
    question: "How many hours of sleep do you get per night?",
    options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "9+ hours"],
  },
  {
    category: "Lifestyle",
    question: "How often do you consume alcohol?",
    options: ["Daily", "Often", "Occasionally", "Rarely", "Never"],
  },
  {
    category: "Lifestyle",
    question: "How often do you smoke or use tobacco products?",
    options: ["Daily", "Often", "Occasionally", "Rarely", "Never"],
  },
  {
    category: "Lifestyle",
    question: "How would you describe your work-life balance?",
    options: ["Very unbalanced", "Mostly unbalanced", "Somewhat balanced", "Mostly balanced", "Very balanced"],
  },
  {
    category: "Lifestyle",
    question: "How often do you engage in screen-free leisure activities?",
    options: ["Never", "Rarely", "Occasionally", "Often", "Every day"],
  },

  // Physical Health Questions
  {
    category: "Physical Health",
    question: "How often do you engage in physical exercise?",
    options: ["Never", "Once a week", "Most days", "Daily"],
  },
  {
    category: "Physical Health",
    question: "How would you rate your overall physical fitness?",
    options: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
  },
  {
    category: "Physical Health",
    question: "How often do you experience physical pain or discomfort?",
    options: ["Every day", "A few times a week", "Occasionally", "Rarely", "Never"],
  },
  {
    category: "Physical Health",
    question: "How much time do you spend sitting each day?",
    options: ["More than 10 hours", "8-10 hours", "6-8 hours", "4-6 hours", "Less than 4 hours"],
  },
  {
    category: "Physical Health",
    question: "How often do you check in with a healthcare provider?",
    options: ["Never", "Only when sick", "Once every few years", "Once a year", "More than once a year"],
  },
];

// Advice generator function
const generateAdvice = (question, answer) => {
  switch (question) {
    //Physical Health
      case "How often do you engage in physical exercise?":
        if (answer === "Never") return "Consider incorporating at least 10-15 minutes of daily exercise to improve your fitness level.";
        if (answer === "Once a week") return "Try to increase your activity to at least 3 times a week for better physical health.";
        if (answer === "Most days") return "Good work! Regular exercise is key to maintaining physical health.";
        if (answer === "Daily") return "Excellent! Keep up the great routine.";
        break;
  
      case "How would you rate your overall physical fitness?":
        if (answer === "Very poor") return "Start with light exercises, such as walking or stretching, and gradually increase intensity.";
        if (answer === "Poor") return "Aim to incorporate more physical activities into your routine, like yoga or swimming.";
        if (answer === "Fair") return "You're doing okay. Continue to work on consistency and increase intensity over time.";
        if (answer === "Good") return "Great job! Maintain your fitness through regular workouts and a balanced diet.";
        if (answer === "Excellent") return "Fantastic! Keep up the excellent fitness practices.";
        break;
  
      case "How often do you experience physical pain or discomfort?":
        if (answer === "Every day") return "Consider consulting a healthcare provider to address any underlying issues.";
        if (answer === "A few times a week") return "Monitor your discomfort and take breaks or perform light stretches.";
        if (answer === "Occasionally") return "It’s good that the discomfort is minimal. Ensure you're not overexerting.";
        if (answer === "Rarely") return "Great! Continue maintaining your healthy lifestyle.";
        if (answer === "Never") return "Fantastic! You’re doing an excellent job of taking care of your body.";
        break;
  
      case "How much time do you spend sitting each day?":
        if (answer === "More than 10 hours") return "Prolonged sitting can lead to health issues. Try to take a 5-minute break to stretch every hour.";
        if (answer === "8-10 hours") return "Consider incorporating short breaks and light stretches to reduce sedentary time.";
        if (answer === "6-8 hours") return "You're doing well, but reducing sitting time can further improve your health.";
        if (answer === "4-6 hours") return "Good job! Keep balancing sitting with physical activity.";
        if (answer === "Less than 4 hours") return "Excellent! You’re maintaining an active lifestyle.";
        break;
  
      case "How often do you check in with a healthcare provider?":
        if (answer === "Never") return "It’s important to schedule regular checkups to monitor your health.";
        if (answer === "Only when sick") return "Consider making routine health checkups a habit to stay ahead of potential issues.";
        if (answer === "Once every few years") return "Try to visit a healthcare provider at least once a year for preventive care.";
        if (answer === "Once a year") return "Great! Annual checkups are a key part of maintaining good health.";
        if (answer === "More than once a year") return "Excellent! Regular checkups ensure you stay on top of your health.";
        break;
        // Diet 
        case "How many servings of fruits and vegetables do you eat per day?":
          if (answer === "0-1 servings") return "Increase your intake of fruits and vegetables to at least 5 servings daily for essential nutrients.";
          if (answer === "2-3 servings") return "Good start! Aim for 5 servings of fruits and vegetables daily.";
          if (answer === "3-4 servings") return "You're doing well! Try to add one more serving to meet the daily recommendation.";
          if (answer === "5+ servings") return "Excellent! Keep maintaining this healthy habit.";
          break;
    
        case "How often do you consume fast food or processed snacks?":
          if (answer === "Daily") return "Limit your fast food intake to improve overall health and avoid excess calories.";
          if (answer === "3-4 times a week") return "Consider reducing processed snacks and fast food to once a week or less.";
          if (answer === "Once a week") return "Good job! Keep it up by replacing processed snacks with healthier options.";
          if (answer === "Rarely") return "Excellent! Minimizing fast food consumption benefits your health greatly.";
          break;
    
        case "How much water do you drink per day?":
          if (answer === "Less than 4 cups") return "Increase your water intake to at least 8 cups daily to stay hydrated.";
          if (answer === "4-7 cups") return "You're on the right track. Aim for 8-10 cups of water per day.";
          if (answer === "8-10 cups") return "Great job! You're meeting the daily hydration needs.";
          if (answer === "11+ cups") return "Excellent! Staying well-hydrated supports overall health.";
          break;
    
        case "How often do you eat breakfast?":
          if (answer === "Rarely") return "Make breakfast a daily habit to kickstart your metabolism and improve focus.";
          if (answer === "1-2 times a week") return "Try to include breakfast at least 4-5 times a week for better energy levels.";
          if (answer === "3-4 times a week") return "You're on the right track. Aim to make breakfast a daily routine.";
          if (answer === "Every day") return "Great job! Consistent breakfast habits lead to better overall health.";
          break;
    
        case "How often do you consume sugary drinks?":
          if (answer === "Several times a day") return "Reduce sugary drinks to avoid excessive sugar intake and maintain good health.";
          if (answer === "Once a day") return "Consider replacing sugary drinks with water or natural alternatives.";
          if (answer === "A few times a week") return "You're doing well. Minimize sugary drinks further for optimal health.";
          if (answer === "Rarely") return "Excellent! Limiting sugary drinks is great for your overall well-being.";
          break;
          // Lifestyle
    case "How many hours of sleep do you get per night?":
      if (answer === "Less than 5 hours") return "Aim for 7-8 hours of quality sleep to improve overall health and productivity.";
      if (answer === "5-6 hours") return "Try to extend your sleep by an hour to feel more rested and energetic.";
      if (answer === "7-8 hours") return "Great job! You're getting the recommended amount of sleep.";
      if (answer === "9+ hours") return "While sleep is essential, too much can also affect energy levels. Maintain balance.";
      break;

    case "How often do you consume alcohol?":
      if (answer === "Daily") return "Consider reducing your alcohol intake to improve your overall well-being.";
      if (answer === "Often") return "Try to limit alcohol consumption to special occasions for better health.";
      if (answer === "Occasionally") return "You're doing well; occasional consumption is generally fine in moderation.";
      if (answer === "Rarely") return "Great! Limiting alcohol is beneficial for your health.";
      if (answer === "Never") return "Fantastic! Avoiding alcohol supports a healthy lifestyle.";
      break;

    case "How often do you smoke or use tobacco products?":
      if (answer === "Daily") return "Quitting tobacco can significantly improve your health; consider seeking support.";
      if (answer === "Often") return "Reducing your usage is a positive step; aim to quit entirely for long-term benefits.";
      if (answer === "Occasionally") return "Even occasional use can be harmful; work toward eliminating it completely.";
      if (answer === "Rarely") return "It's great you're limiting use; avoid it entirely for optimal health.";
      if (answer === "Never") return "Excellent! Avoiding tobacco keeps your body healthier.";
      break;

    case "How would you describe your work-life balance?":
      if (answer === "Very unbalanced") return "Identify key stressors and allocate time for personal activities to restore balance.";
      if (answer === "Mostly unbalanced") return "Make a conscious effort to separate work and personal time for better well-being.";
      if (answer === "Somewhat balanced") return "You're on the right track; strive for consistent work-life harmony.";
      if (answer === "Mostly balanced") return "Well done! Maintain this balance to sustain overall wellness.";
      if (answer === "Very balanced") return "Fantastic! A balanced life is key to happiness and health.";
      break;

    case "How often do you engage in screen-free leisure activities?":
      if (answer === "Never") return "Take small steps to unplug and enjoy offline hobbies or nature.";
      if (answer === "Rarely") return "Try to set aside time each week for screen-free activities to recharge.";
      if (answer === "Occasionally") return "Good! Keep finding opportunities to step away from screens.";
      if (answer === "Often") return "Great! Regular screen-free time benefits mental and physical health.";
      if (answer === "Every day") return "Excellent! Engaging in screen-free activities daily is highly beneficial.";
      break;
      // Mental Well-being
    case "How often do you feel stressed or anxious?":
      if (answer === "Daily") return "Consider practicing mindfulness or seeking professional help to manage stress.";
      if (answer === "Often") return "Engage in relaxation techniques like meditation or yoga to reduce stress.";
      if (answer === "Occasionally") return "You’re managing well. Continue to find balance and unwind when needed.";
      if (answer === "Rarely") return "Great! Keep maintaining your mental well-being.";
      break;

    case "How often do you feel rested after sleep?":
      if (answer === "Never") return "Review your sleep habits and consider a consistent bedtime routine.";
      if (answer === "Occasionally") return "Try improving your sleep hygiene by avoiding screens before bed.";
      if (answer === "Most of the time") return "Good job! Continue following your healthy sleep habits.";
      if (answer === "Always") return "Excellent! Keep prioritizing your sleep.";
      break;

    case "How often do you engage in activities that help you relax?":
      if (answer === "Never") return "Start incorporating relaxation activities like reading or meditation into your routine.";
      if (answer === "Rarely") return "Consider scheduling time for activities you enjoy to help recharge.";
      if (answer === "Occasionally") return "Good effort! Try to make relaxation a regular part of your day.";
      if (answer === "Every day") return "Great work! Regular relaxation helps maintain mental balance.";
      break;

    case "How would you rate your overall mood in the past week?":
      if (answer === "Very poor") return "Reflect on triggers affecting your mood and consider speaking with a counselor.";
      if (answer === "Poor") return "Focus on activities that bring you joy and talk to someone you trust.";
      if (answer === "Neutral") return "You're stable. Look for small ways to improve your mood daily.";
      if (answer === "Good") return "Great! Keep nurturing activities that positively influence your mood.";
      if (answer === "Excellent") return "Fantastic! Continue doing what makes you happy.";
      break;

    case "How often do you feel supported by family or friends?":
      if (answer === "Never") return "Reach out to support groups or professionals to build a network.";
      if (answer === "Rarely") return "Consider opening up to friends or family to strengthen connections.";
      if (answer === "Sometimes") return "You're on the right track. Keep nurturing your relationships.";
      if (answer === "Often") return "Good job! Having supportive relationships is vital for mental well-being.";
      if (answer === "Always") return "Excellent! Cherish and maintain these strong relationships.";
      break;
    default:
      return "Keep focusing on a balanced lifestyle.";
  }
};

function Report() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [responses, setResponses] = useState({});

  const goBack = () => navigate("/dashboard");

  const filteredQuestions =
    selectedCategory === "All"
      ? questions
      : questions.filter((q) => q.category === selectedCategory);

  const handleResponseChange = (question, answer) => {
    setResponses({ ...responses, [question]: answer });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Your Responses and Advice</h1>
        <button style={styles.backButton} onClick={goBack}>
          Back to Dashboard
        </button>
      </div>

      <div style={styles.filter}>
        <label htmlFor="category" style={styles.filterLabel}>
          Filter by Category:
        </label>
        <select
          id="category"
          style={styles.dropdown}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Diet">Diet</option>
          <option value="Mental Well-being">Mental Well-being</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Physical Health">Physical Health</option>
        </select>
      </div>

      <div style={styles.responseSection}>
        {filteredQuestions.map((q, index) => (
          <div key={index} style={styles.responseCard}>
            <h3 style={styles.question}>{q.question}</h3>
            <select
              style={styles.dropdown}
              value={responses[q.question] || ""}
              onChange={(e) => handleResponseChange(q.question, e.target.value)}
            >
              <option value="" disabled>
                Select your answer
              </option>
              {q.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {responses[q.question] && (
              <p style={styles.advice}>
                <strong>Advice:</strong>{" "}
                {generateAdvice(q.question, responses[q.question])}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Report;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  filter: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontWeight: "bold",
  },
  dropdown: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  responseSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  responseCard: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  question: {
    margin: "0 0 10px",
  },
  advice: {
    marginTop: "10px",
    color: "#007bff",
  },
};
