import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCrown, FaMedal, FaStar } from 'react-icons/fa';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedScore, setSelectedScore] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchLeaderboard = useCallback(async (category) => {
    setLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/leaderboard/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboardData(response.data.leaderboard);
      console.log({leaderboardData});
    } catch (error) {
      console.error('Error fetching leaderboard:', error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(selectedScore);

    // Inject keyframes for floating animation if not already present
    const styleSheet = document.styleSheets[0];
    const floatingKeyframes = `
      @keyframes floating {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
    `;
    if (!Array.from(styleSheet.cssRules).some((rule) => rule.cssText.includes('floating'))) {
      styleSheet.insertRule(floatingKeyframes, styleSheet.cssRules.length);
    }
  }, [fetchLeaderboard, selectedScore]);

  const handleScoreChange = (event) => {
    setSelectedScore(event.target.value);
  };

  const goBack = () => navigate('/dashboard');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Leaderboard</h1>
        <button
          style={styles.backButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
          onClick={goBack}
        >
          Back
        </button>
      </div>

      {/* Dropdown for Score Selection */}
      <div style={styles.dropdownContainer}>
        <select
          value={selectedScore}
          onChange={handleScoreChange}
          style={styles.dropdown}
          onMouseEnter={(e) => (e.target.style.borderColor = '#007bff')}
          onMouseLeave={(e) => (e.target.style.borderColor = '#ccc')}
        >
          <option value="overall">Overall Score</option>
          <option value="physical">Physical</option>
          <option value="mental">Mental</option>
          <option value="diet">Diet</option>
          <option value="lifestyle">Lifestyle</option>
        </select>
      </div>

      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : isError ? (
        <div className="min-h-screen flex justify-center items-center">
          <p style={{ color: 'red' }}>Error loading leaderboard. Please try again later.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Winners */}
          <div style={styles.topThreeContainer}>
            {leaderboardData.slice(0, 3).map((user, index) => (
              <div
                key={user.rank}
                style={{
                  ...styles.topThreeCard,
                  backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                }}
                className="floating"
              >
                <div style={styles.rankLabel}>
                  {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                </div>
                <div style={styles.rankTag}>
                  {index === 0 ? <FaCrown size={32} /> : index === 1 ? <FaMedal size={32} /> : <FaStar size={32} />}
                </div>
                <div style={styles.userIcon}>👤</div>
                <h3>{user.username}</h3>
                <p>Score: {user.score}</p>
              </div>
            ))}
          </div>

          {/* Other Rankings */}
          <div style={styles.otherRankingsContainer}>
            {leaderboardData.slice(3).map((user) => (
              <div
                key={user.rank}
                style={styles.otherRankingCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={styles.rankNumber}>{user.rank}</span>
                <div style={styles.details}>
                  <h4 style={styles.name}>{user.username}</h4>
                  <p style={styles.score}>Score: {user.score}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;

// Inline styling
const styles = {
  container: {
    paddingTop: '50px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dropdown: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
  },
  topThreeContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    margin: '20px 0',
  },
  topThreeCard: {
    padding: '20px',
    width: '150px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#333',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1)',
    transition: 'transform 0.2s',
    position: 'relative',
    animation: 'floating 3s ease-in-out infinite',
  },
  rankLabel: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '2px 5px',
    borderRadius: '5px',
    fontSize: '12px',
  },
  rankTag: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  userIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  otherRankingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px 0',
  },
  otherRankingCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    width: '80%',
    maxWidth: '400px',
    marginBottom: '10px',
  },
  rankNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: '15px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  score: {
    fontSize: '14px',
    color: '#666',
  },
};
