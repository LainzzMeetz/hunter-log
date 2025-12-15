// frontend/src/pages/BossesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const theme = {
  danger: '#ff4444',
  success: '#00ff7f',
  muted: '#555',
  font: '"Share Tech Mono", monospace',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    paddingBottom: '20px'
  },
  card: {
    backgroundColor: 'rgba(20, 0, 0, 0.6)', // Dark Red Glass
    border: `1px solid ${theme.danger}`,
    padding: '15px',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden'
  },
  defeatedCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    border: `1px solid ${theme.muted}`,
    opacity: 0.6
  },
  name: {
    color: theme.danger,
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '5px'
  },
  desc: {
    color: '#aaa',
    fontSize: '14px',
    fontFamily: theme.font,
    marginBottom: '15px'
  },
  button: {
    backgroundColor: theme.danger,
    color: '#000',
    border: 'none',
    padding: '8px 12px',
    fontWeight: 'bold',
    fontFamily: theme.font,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    width: '100%'
  },
  status: {
    color: theme.success,
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  }
};

const BossesPage = () => {
  const [bosses, setBosses] = useState([]);

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/bosses')
      .then(res => setBosses(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDefeat = async (bossId, bossName) => {
    if (!window.confirm(`CONFIRM ELIMINATION: ${bossName}?`)) return;

    try {
      // 1. API Call
      await axios.put(`https://hunter-log.onrender.com/api/bosses/${bossId}/defeat`);
      
      // 2. Immediate UI Update
      setBosses(prev => prev.map(b => 
        b._id === bossId ? { ...b, defeated: true } : b
      ));
    } catch (error) {
      console.error("Error defeating boss:", error);
    }
  };

  return (
    <div style={styles.container}>
      {bosses.length === 0 && <div style={{color:'#666', textAlign:'center'}}>NO THREATS DETECTED</div>}

      {bosses.map(boss => (
        <motion.div 
          key={boss._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            ...styles.card,
            ...(boss.defeated ? styles.defeatedCard : {})
          }}
        >
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{...styles.name, color: boss.defeated ? '#666' : theme.danger}}>
              {boss.name}
            </div>
            {boss.defeated && <span style={styles.status}>[ELIMINATED]</span>}
          </div>

          <div style={styles.desc}>{boss.description}</div>

          {!boss.defeated && (
            <motion.button
              style={styles.button}
              whileHover={{ scale: 1.02, backgroundColor: '#ff0000' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDefeat(boss._id, boss.name)}
            >
              CONFIRM DEFEAT
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BossesPage;
