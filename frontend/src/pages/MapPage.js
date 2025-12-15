// frontend/src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { playSound } from '../App';

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
  addSection: {
    marginBottom: '20px',
    border: '1px dashed #333',
    padding: '15px',
    borderRadius: '5px'
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    border: '1px solid #555', 
    color: '#fff', 
    padding: '10px', 
    width: '100%', 
    marginBottom: '10px', 
    fontFamily: theme.font,
    boxSizing: 'border-box'
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
  },
  mainBtn: {
    backgroundColor: theme.active,
    color: '#000',
    border: 'none',
    padding: '8px 15px',
    fontWeight: 'bold',
    fontFamily: theme.font,
    cursor: 'pointer',
    width: '100%',
    textTransform: 'uppercase'
  }
};

const MapPage = () => {
  const [chapters, setChapters] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/map')
      .then(res => setChapters(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleStatus = async (id, newStatus) => {
    try {
      playSound('click');
      await axios.put(`https://hunter-log.onrender.com/api/map/${id}/status`, { status: newStatus });
      
      setChapters(prev => prev.map(ch => 
        ch._id === id ? { ...ch, status: newStatus } : ch
      ));
    } catch (error) {
      console.error("Map update failed", error);
    }
  };

  const handleAddChapter = async () => {
    if (!newTitle || !newDesc) return;
    try {
      playSound('complete');
      const res = await axios.post('https://hunter-log.onrender.com/api/map', {
        title: newTitle,
        description: newDesc
      });
      // Add new chapter to list
      setChapters([...chapters, res.data]);
      // Reset form
      setNewTitle("");
      setNewDesc("");
      setShowAdd(false);
    } catch (error) {
      console.error("Failed to add chapter", error);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. ADD CHAPTER TOGGLE */}
      {!showAdd ? (
        <button 
          onClick={() => setShowAdd(true)} 
          style={{...styles.btn, border: '1px dashed #555', width: '100%', padding: '10px'}}
        >
          [ + NEW OPERATION ]
        </button>
      ) : (
        <motion.div 
          style={styles.addSection}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{color: theme.active, marginBottom: '10px', fontWeight:'bold'}}>DEFINE NEW OPERATION</div>
          <input 
            style={styles.input} 
            placeholder="OPERATION NAME (e.g. The Job Hunt)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea 
            style={{...styles.input, height: '80px', resize: 'none'}} 
            placeholder="MISSION OBJECTIVE..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div style={{display: 'flex', gap: '10px'}}>
             <button style={styles.mainBtn} onClick={handleAddChapter}>INITIALIZE</button>
             <button 
               style={{...styles.mainBtn, backgroundColor: '#333', color: '#fff'}} 
               onClick={() => setShowAdd(false)}
             >
               CANCEL
             </button>
          </div>
        </motion.div>
      )}

      {/* 2. CHAPTER LIST */}
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
