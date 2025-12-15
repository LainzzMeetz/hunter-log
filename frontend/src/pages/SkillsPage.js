// frontend/src/pages/SkillsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const theme = {
  primary: '#00bfff',
  font: '"Share Tech Mono", monospace',
  cardBg: 'rgba(10, 20, 30, 0.6)',
  selectedBorder: '1px solid #00bfff',
  defaultBorder: '1px solid #333'
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: '20px'
  },
  trackSection: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#888',
    fontSize: '12px',
    marginBottom: '10px',
    letterSpacing: '1px',
    borderBottom: '1px solid #333',
    paddingBottom: '5px'
  },
  trackButton: {
    width: '100%',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: theme.cardBg,
    color: '#ccc',
    border: theme.defaultBorder,
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: theme.font,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeTrack: {
    borderColor: theme.primary,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    color: '#fff',
    boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)'
  },
  skillCard: {
    padding: '10px',
    borderLeft: '2px solid #555',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: '5px',
    fontSize: '14px'
  }
};

const tracks = [
  { id: 'software_dev_skill', label: 'SOFTWARE DEV', class: 'SHADOW DEV' },
  { id: 'ai_ml_skill', label: 'AI / ML', class: 'AI ARCHITECT' },
  { id: 'embedded_skill', label: 'EMBEDDED SYS', class: 'IRON ENGINEER' },
  { id: 'cybersecurity', label: 'CYBERSEC', class: 'GATEKEEPER' },
];

const SkillsPage = ({ player, setPlayer }) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleTrackChange = async (trackId) => {
    try {
      // 1. Update Backend
      const res = await axios.put('https://hunter-log.onrender.com/api/player/set-track', {
        track: trackId
      });
      // 2. Update Global Player State (Changes Class Title instantly)
      setPlayer(res.data);
    } catch (error) {
      console.error("Error setting track:", error);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. CLASS SELECTION */}
      <div style={styles.trackSection}>
        <div style={styles.sectionTitle}>SELECT ACTIVE CLASS (FOCUS)</div>
        {tracks.map(track => (
          <motion.button
            key={track.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTrackChange(track.id)}
            style={{
              ...styles.trackButton,
              ...(player?.active_skill_track === track.id ? styles.activeTrack : {})
            }}
          >
            <div>
              <div style={{fontWeight:'bold', fontSize:'16px'}}>{track.label}</div>
              <div style={{fontSize:'12px', color:'#888'}}>CLASS: {track.class}</div>
            </div>
            {player?.active_skill_track === track.id && <div style={{color: theme.primary}}>● ACTIVE</div>}
          </motion.button>
        ))}
      </div>

      {/* 2. SKILL LOG */}
      <div>
        <div style={styles.sectionTitle}>ACQUIRED SKILL DATABASE</div>
        {skills.length === 0 && <div style={{color: '#555', fontSize: '12px'}}>NO SKILLS LOGGED. START STUDYING.</div>}
        
        {skills.map(skill => (
          <motion.div 
            key={skill._id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={styles.skillCard}
          >
            <div style={{color: '#fff', fontWeight: 'bold'}}>{skill.name}</div>
            <div style={{color: '#888', fontSize: '12px'}}>{skill.tree.toUpperCase()} TREE</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
