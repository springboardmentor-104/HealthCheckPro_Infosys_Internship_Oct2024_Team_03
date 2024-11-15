import React from 'react';
import { useNavigate } from 'react-router-dom';

const userResponses = [
  {
    question: "How often do you exercise?",
    selectedAnswer: "3-4 times a week",
    advice: "Great job! Maintain consistency and consider adding strength training to your routine.",
  },
  {
    question: "How balanced is your diet?",
    selectedAnswer: "Mostly healthy with occasional treats",
    advice: "You're on the right track! Try meal planning to improve further.",
  },
  {
    question: "How well do you sleep at night?",
    selectedAnswer: "6-7 hours",
    advice: "Aim for 7-8 hours of quality sleep to enhance overall health.",
  },
  {
    question: "How often do you meditate or practice mindfulness?",
    selectedAnswer: "Rarely",
    advice: "Consider starting with 5 minutes a day to reduce stress and improve focus.",
  },
];

function Report() {
  const navigate = useNavigate();

  const goBack = () => navigate('/dashboard');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Your Responses and Advice</h1>
        <button style={styles.backButton} onClick={goBack}>
          Back to Dashboard
        </button>
      </div>

      <div style={styles.summary}>
        <h2>Summary</h2>
        <p>
          Based on your responses, here are insights tailored to help you improve your overall well-being.
        </p>
      </div>

      <div style={styles.responseSection}>
        {userResponses.map((response, index) => (
          <div key={index} style={styles.responseCard}>
            <h3 style={styles.question}>{response.question}</h3>
            <p style={styles.answer}>
              <strong>Your Answer:</strong> {response.selectedAnswer}
            </p>
            <p style={styles.advice}>
              <strong>Advice:</strong> {response.advice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Report;

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  summary: {
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  responseSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  responseCard: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
  },
  question: {
    marginBottom: '10px',
    color: '#007bff',
  },
  answer: {
    marginBottom: '8px',
    fontSize: '16px',
  },
  advice: {
    fontSize: '14px',
    color: '#555',
  },
};


