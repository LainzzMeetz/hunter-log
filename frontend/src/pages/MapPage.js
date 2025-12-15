// frontend/src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingRight: '10px',
    maxHeight: '65vh',
    overflowY: 'auto'
  },
  chapterCard: {
    padding: '15px',
    borderLeft: '4px solid #333',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: '10px',
    position: 'relative'
  },
  activeCard: {
    borderLeft: '4px solid #00bfff', // Cyan for Active
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    boxShadow: '0 0 15px rgba(0, 191, 255, 0.1)'
  },
  completedCard: {
    borderLeft: '4px solid #00ff7f', // Green for Completed
    opacity: 0.6
  },
  title: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Share Tech Mono, monospace',
    marginBottom: '5px'
  },
  status: {
    fontSize: '12px',
    textTransform: 'uppercase',
    float: 'right',
    fontWeight: 'bold'
  },
  desc: {
    color: '#aaa',
    fontSize: '14px',
    lineHeight: '1.4'
  },
  button: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #00bfff',
    color: '#00bfff',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'Share Tech Mono, monospace'
  }
};

const MapPage = () => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = () => {
    axios.get('https://hunter-log.onrender.com/api/map')
      .then(res => setChapters(res.data))
      .catch(err => console.error(err));
  };

  const handleStatusChange = async (chapterId, newStatus) => {
    try {
      // 1. Call API
      const res = await axios.put(`https://hunter-log.onrender.com/api/map/${chapterId}/status`, {
        status: newStatus
      });

      // 2. IMMEDIATE UI UPDATE
      // We map through chapters and update the specific one we changed
      setChapters(prev => prev.map(ch => 
        ch._id === chapterId ? { ...ch, status: newStatus } : ch
      ));

    } catch (error) {
      console.error("Map Update Error:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#00bfff';
      case 'completed': return '#00ff7f';
      default: return '#555';
    }
  };

  return (
    <SystemWindow title="[ SYSTEM ROADMAP ]">
      <div style={styles.container}>
        {chapters.map((chapter) => (
          <motion.div
            key={chapter._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...styles.chapterCard,
              ...(chapter.status === 'active' ? styles.activeCard : {}),
              ...(chapter.status === 'completed' ? styles.completedCard : {})
            }}
          >
            <span style={{...styles.status, color: getStatusColor(chapter.status)}}>
              [{chapter.status}]
            </span>
            <div style={styles.title}>
              CH.{chapter.chapter} : {chapter.title}
            </div>
            <div style={styles.desc}>{chapter.description}</div>

            {/* Controls for Manual Progression */}
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              {chapter.status !== 'active' && (
                <motion.button 
                  style={styles.button}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,191,255,0.2)' }}
                  onClick={() => handleStatusChange(chapter._id, 'active')}
                >
                  SET ACTIVE
                </motion.button>
              )}
              
              {chapter.status !== 'completed' && (
                <motion.button 
                  style={{...styles.button, borderColor: '#00ff7f', color: '#00ff7f'}}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,255,127,0.2)' }}
                  onClick={() => handleStatusChange(chapter._id, 'completed')}
                >
                  COMPLETE
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SystemWindow>
  );
};

export default MapPage;
