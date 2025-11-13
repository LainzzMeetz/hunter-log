// frontend/src/components/PenaltyWindow.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { styles } from './styles'; // Import shared styles

const PENALTY_RED = '#ff0000';

const penaltyStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
  window: {
    ...styles.font,
    width: '800px',
    backgroundColor: 'rgba(20, 0, 0, 0.9)', // Dark red transparent
    borderRadius: '10px',
    border: `2px solid ${PENALTY_RED}`,
    boxShadow: `0 0 30px ${PENALTY_RED}`, // Strong red glow
    padding: '30px',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    ...styles.title,
    color: PENALTY_RED,
    textShadow: `0 0 10px ${PENALTY_RED}`,
    fontSize: '36px',
    borderBottom: `2px solid ${PENALTY_RED}88`,
  },
  questTitle: {
    ...styles.font,
    fontSize: '24px',
    color: '#fff',
    marginTop: '20px',
  },
  questDesc: {
    ...styles.statLabel,
    fontSize: '18px',
    marginTop: '10px',
    marginBottom: '30px',
  },
  button: {
    ...styles.button,
    borderColor: PENALTY_RED,
    color: PENALTY_RED,
    fontSize: '18px',
  }
};

function PenaltyWindow({ player, setPlayer, setIsInPenalty }) {
  const [penaltyQuest, setPenaltyQuest] = useState(null);

  // Fetch the one, true penalty quest from the database
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/quests?type=penalty')
      .then(res => {
        if (res.data.length > 0) {
          setPenaltyQuest(res.data[0]);
        }
      })
      .catch(err => console.error("Error fetching penalty quest:", err));
  }, []);

  const handleCompletePenalty = async () => {
    try {
      // 1. Mark the *quest* as complete in the DB
      await axios.put(`http://127.0.0.1:8000/api/quests/${penaltyQuest._id}/complete`);
      
      // 2. Tell the "System" the penalty is over
      const res = await axios.post('http://127.0.0.1:8000/api/penalty/complete');
      
      setPlayer(res.data); // Update player (penalty_active is now false)
      setIsInPenalty(false); // This will close the window
      
    } catch (error) { // <-- THIS IS THE FIX. Was 'catch (error).'
      console.error("Error completing penalty:", error);
    }
  };

  return (
    <motion.div 
      style={penaltyStyles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        style={penaltyStyles.window}
        // Flashing "alert" animation
        animate={{ 
          borderColor: [PENALTY_RED, '#ff8888', PENALTY_RED],
          boxShadow: [`0 0 30px ${PENALTY_RED}`, `0 0 40px ${PENALTY_RED}`, `0 0 30px ${PENALTY_RED}`]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <h1 style={penaltyStyles.title}>[ ! ] P E N A L T Y [ ! ]</h1>
        {penaltyQuest ? (
          <>
            <h2 style={penaltyStyles.questTitle}>{penaltyQuest.title}</h2>
            <p style={penaltyStyles.questDesc}>{penaltyQuest.description}</p>
            <motion.button
              style={penaltyStyles.button}
              whileHover={{ scale: 1.1, backgroundColor: PENALTY_RED, color: '#000' }}
              onClick={handleCompletePenalty}
            >
              [ Complete Penalty ]
            </motion.button>
          </>
        ) : (
          <p>Loading penalty...</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default PenaltyWindow;