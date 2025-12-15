// frontend/src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const theme = {
  active: '#00bfff', // Cyan
  completed: '#00ff7f', // Green
  locked: '#444', // Dark Gray
  font: '"Share Tech Mono", monospace',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: '20px'
  },
  chapterCard: {
    borderLeft: `4px solid ${theme.locked}`,
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    padding: '15px',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  activeCard: {
    borderLeft: `4px solid ${theme.active}`,
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    boxShadow: `0 0 15px rgba(0, 191, 255, 0.1)`
  },
  completedCard: {
    borderLeft: `4px solid ${theme.completed}`,
    opacity: 0.5
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  status: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  desc: {
    color: '#aaa',
    fontSize: '14px',
    fontFamily: theme.font,
    lineHeight: '1.4'
  },
  controls: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px'
  },
  btn: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#888',
    padding: '5px 10px',
    cursor: 'pointer',
    fontFamily: theme.font,
    fontSize: '12px',
    textTransform: 'uppercase'
  },
  activeBtn: {
    borderColor: theme.active,
    color: theme.active,
  },
  completeBtn: {
    borderColor: theme.completed,
    color: theme.completed,
  }
};

const MapPage = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/map')
      .then(res => setChapters(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleStatus = async (id, newStatus) => {
    try {
      // 1. API Call
      await axios.put(`https://hunter-log.onrender.com/api/map/${id}/status`, { status: newStatus });
      
      // 2. UI Update
      setChapters(prev => prev.map(ch => 
        ch._id === id ? { ...ch, status: newStatus } : ch
      ));
    } catch (error) {
      console.error("Map update failed", error);
    }
  };

  return (
    <div style={styles.container}>
      {chapters.map(ch => (
        <motion.div
          key={ch._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...styles.chapterCard,
            ...(ch.status === 'active' ? styles.activeCard : {}),
            ...(ch.status === 'completed' ? styles.completedCard : {})
          }}
        >
          <div style={styles.header}>
            <span style={styles.title}>CH.{ch.chapter} : {ch.title}</span>
            <span style={{
              ...styles.status,
              color: ch.status === 'active' ? theme.active : ch.status === 'completed' ? theme.completed : theme.locked
            }}>
              [{ch.status}]
            </span>
          </div>
          
          <div style={styles.desc}>{ch.description}</div>

          <div style={styles.controls}>
            {ch.status !== 'active' && (
              <motion.button 
                style={{...styles.btn, ...styles.activeBtn}}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,191,255,0.1)' }}
                onClick={() => handleStatus(ch._id, 'active')}
              >
                SET ACTIVE
              </motion.button>
            )}
            {ch.status !== 'completed' && (
              <motion.button 
                style={{...styles.btn, ...styles.completeBtn}}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,255,127,0.1)' }}
                onClick={() => handleStatus(ch._id, 'completed')}
              >
                COMPLETE
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MapPage;
