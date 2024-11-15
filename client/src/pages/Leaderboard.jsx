import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample static data
const leaderboardData = [
  { rank: 1, name: "Peter Parker", score: 19800 },
  { rank: 2, name: "Superman", score: 19200 },
  { rank: 3, name: "Tony Stark", score: 18600 },
  { rank: 4, name: "Flash", score: 13200 },
  { rank: 5, name: "Captain Rogers", score: 13200 },
  { rank: 6, name: "Steven Strange", score: 13200 },
  { rank: 7, name: "Zedi", score: 13000 },
  { rank: 8, name: "Nick Jonas", score: 12800 },
  { rank: 9, name: "Harry Potter", score: 12600 },
  { rank: 10, name: "Thanos", score: 12500 },
];

function Leaderboard() {
  const navigate = useNavigate();
  const [selectedScore, setSelectedScore] = useState("Overall Score");

  const handleScoreChange = (event) => {
    setSelectedScore(event.target.value);
  };

  const goBack = () => navigate('/dashboard');

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Leaderboard</h1>
        <button style={styles.backButton} onClick={goBack}>Back</button>
      </div>

      {/* Dropdown for Score Selection */}
      <div style={styles.dropdownContainer}>
        <select value={selectedScore} onChange={handleScoreChange} style={styles.dropdown}>
          <option value="Overall Score">Overall Score</option>
          <option value="Physical">Physical</option>
          <option value="Mental">Mental</option>
          <option value="Diet">Diet</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>
      </div>

      {/* Top 3 Winners */}
      <div style={styles.topThreeContainer}>
        {leaderboardData.slice(0, 3).map((user, index) => (
          <div 
            key={user.rank} 
            style={{
              ...styles.topThreeCard,
              backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
            }}
          >
            <div style={styles.rankTag}>{index === 0 ? 'FIRST' : index === 1 ? 'SECOND' : 'THIRD'}</div>
            <div style={styles.userIcon}>👤</div>
            <h3>{user.name}</h3>
            <p>Score: {user.score}</p>
          </div>
        ))}
      </div>

      {/* Other Rankings */}
      <div style={styles.rankingsList}>
        <div style={styles.rankingsTable}>
          {leaderboardData.slice(3, 10).map((user) => (
            <div key={user.rank} style={styles.row}>
              <span style={styles.cell}>{user.rank}</span>
              <span style={styles.cell}>{user.name}</span>
              <span style={styles.cell}>{user.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* More Button */}
      <div style={styles.moreButtonContainer}>
        <button style={styles.moreButton}>More</button>
      </div>
    </div>
  );
}

export default Leaderboard;

// Inline styling 
const styles = {
  container: {
    paddingTop: '80px', // Adjust to match navbar height
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
  },
  rankTag: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  userIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  rankingsList: {
    marginTop: '20px',
  },
  rankingsTable: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 2fr',
    gap: '10px',
    textAlign: 'left',
    marginBottom: '20px',
  },
  row: {
    display: 'contents',
  },
  cell: {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  moreButtonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  moreButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    transition: 'background-color 0.3s, transform 0.3s',
},
};