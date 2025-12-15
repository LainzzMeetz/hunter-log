// frontend/src/pages/BossesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';

const styles = {
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '60vh',
    overflowY: 'auto',
    paddingRight: '5px'
  },
  bossCard: {
    backgroundColor: 'rgba(20, 0, 0, 0.6)', // Red tint for danger
    border: '1px solid #ff4444',
    padding: '15px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  defeatedCard: {
    backgroundColor: 'rgba(50, 50, 50, 0.4)',
    border: '1px solid #555',
    opacity: 0.7
  },
  bossName: {
    color: '#ff4444',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '0 0 10px rgba(255, 68, 68, 0.6)'
  },
  desc: {
    color: '#ccc',
    fontSize: '14px',
    fontFamily: 'Share Tech Mono, monospace'
  },
  button: {
    padding: '10px',
    backgroundColor: '#ff4444',
    color: '#000',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Share Tech Mono, monospace',
    marginTop: '5px',
    textTransform: 'uppercase'
  }
};

const BossesPage = () => {
  const [bosses, setBosses] = useState([]);

  useEffect(() => {
    fetchBosses();
  }, []);

  const fetchBosses = () => {
    axios.get('https://hunter-log.onrender.com/api/bosses')
      .then(res => setBosses(res.data))
      .catch(err => console.error(err));
  };

  const handleDefeat = async (bossId, bossName) => {
    if (!window.confirm(`CONFIRM ELIMINATION: ${bossName}?`)) return;

    try {
      // 1. Call API
      const res = await axios.put(`https://hunter-log.onrender.com/api/bosses/${bossId}/defeat`);
      
      // 2. IMMEDIATE UI UPDATE (Fixes the "Nothing changed" bug)
      setBosses(prevBosses => 
        prevBosses.map(boss => 
          boss._id === bossId ? { ...boss, defeated: true } : boss
        )
      );
      
      // Optional: Play sound
      try { new Audio('/audio/quest_complete.mp3').play(); } catch(e){}
      
    } catch (error) {
      console.error("Combat Error:", error);
      alert("System Error: Could not register defeat.");
    }
  };

  return (
    <SystemWindow title="[ DUNGEON BOSSES ]">
      <div style={styles.listContainer}>
        {bosses.length === 0 && <div style={{color:'#666', textAlign:'center'}}>NO HOSTILES DETECTED.</div>}
        
        {bosses.map(boss => (
          <motion.div 
            key={boss._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              ...styles.bossCard,
              ...(boss.defeated ? styles.defeatedCard : {})
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{
                  ...styles.bossName,
                  color: boss.defeated ? '#888' : '#ff4444',
                  textDecoration: boss.defeated ? 'line-through' : 'none'
              }}>
                {boss.name}
              </span>
              {boss.defeated && <span style={{color: '#00ff7f', fontSize: '12px'}}>[ELIMINATED]</span>}
            </div>
            
            <p style={styles.desc}>{boss.description}</p>
            
            {!boss.defeated && (
              <motion.button
                style={styles.button}
                whileHover={{ scale: 1.05, backgroundColor: '#ff0000' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDefeat(boss._id, boss.name)}
              >
                CONFIRM DEFEAT
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </SystemWindow>
  );
};

export default BossesPage;
