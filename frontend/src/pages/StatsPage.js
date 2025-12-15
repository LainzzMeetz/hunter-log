// frontend/src/pages/StatsPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import axios from 'axios';

const styles = {
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    borderBottom: '1px solid #333',
    paddingBottom: '2px'
  },
  label: {
    color: '#888',
    fontFamily: 'Share Tech Mono, monospace'
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Share Tech Mono, monospace'
  },
  sectionTitle: {
    color: '#00bfff',
    borderBottom: '1px solid #00bfff',
    paddingBottom: '5px',
    marginTop: '20px',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  expBarContainer: {
    width: '100%',
    height: '10px',
    backgroundColor: '#222',
    borderRadius: '5px',
    marginTop: '5px',
    overflow: 'hidden',
    border: '1px solid #444'
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#00bfff',
    boxShadow: '0 0 10px #00bfff'
  },
  activeChapterBox: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #00bfff',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    textAlign: 'center'
  },
  chapterLabel: {
    color: '#00bfff',
    fontSize: '12px',
    letterSpacing: '2px',
    marginBottom: '5px'
  },
  chapterTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadow: '0 0 10px rgba(0, 191, 255, 0.5)'
  }
};

const StatsPage = ({ player }) => {
  const [activeChapter, setActiveChapter] = useState(null);

  // FETCH THE ACTIVE CHAPTER AUTOMATICALLY
  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/map')
      .then(res => {
        // Find the one marked "active"
        const current = res.data.find(ch => ch.status === 'active');
        setActiveChapter(current);
      })
      .catch(err => console.error("Error fetching map:", err));
  }, []);

  if (!player) return <div style={{color: '#fff'}}>LOADING SYSTEM...</div>;

  // Calculate Progress Percentage
  const progress = Math.min((player.exp / player.exp_to_next_level) * 100, 100);

  return (
    <SystemWindow title="[ PLAYER STATUS ]">
      
      {/* 1. NEW: CURRENT MISSION DISPLAY */}
      {activeChapter && (
        <motion.div 
          style={styles.activeChapterBox}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={styles.chapterLabel}>CURRENT STORY ARC</div>
          <div style={styles.chapterTitle}>{activeChapter.title}</div>
        </motion.div>
      )}

      {/* 2. LEVEL & EXP */}
      <div style={{ marginBottom: '20px', marginTop: activeChapter ? '20px' : '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
            LVL. {player.level}
          </span>
          <span style={{ color: '#00bfff' }}>
            {player.username.toUpperCase()}
          </span>
        </div>
        
        <div style={styles.expBarContainer}>
          <motion.div 
            style={{...styles.expBarFill, width: `${progress}%`}} 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#888', marginTop: '5px' }}>
          EXP: {player.exp} / {player.exp_to_next_level}
        </div>
      </div>

      {/* 3. PHYSICAL STATS */}
      <div style={styles.sectionTitle}>PHYSICAL PARAMETERS</div>
      <div style={styles.statRow}>
        <span style={styles.label}>STRENGTH</span>
        <span style={styles.value}>{player.stats.strength}</span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>STAMINA</span>
        <span style={styles.value}>{player.stats.stamina}</span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>VITALITY</span>
        <span style={styles.value}>{player.stats.vitality}</span>
      </div>

      {/* 4. MENTAL STATS */}
      <div style={styles.sectionTitle}>MENTAL PARAMETERS</div>
      <div style={styles.statRow}>
        <span style={styles.label}>FOCUS</span>
        <span style={styles.value}>{player.stats.focus}</span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>CLARITY</span>
        <span style={styles.value}>{player.stats.clarity}</span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>WILLPOWER</span>
        <span style={styles.value}>{player.stats.willpower}</span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>CONFIDENCE</span>
        <span style={styles.value}>{player.stats.confidence}</span>
      </div>

      {/* 5. JOB / SKILL TRACK */}
      <div style={styles.sectionTitle}>CLASS / JOB</div>
      <div style={styles.statRow}>
        <span style={styles.label}>CLASS</span>
        <span style={{...styles.value, color: '#00ff7f'}}>
           {player.active_skill_track === 'software_dev_skill' ? 'SHADOW DEVELOPER' : 
            player.active_skill_track === 'ai_ml_skill' ? 'AI ARCHITECT' : 
            player.active_skill_track.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div style={styles.statRow}>
        <span style={styles.label}>MASTERY</span>
        <span style={styles.value}>
          {player.stats[player.active_skill_track] || 1} PTS
        </span>
      </div>

    </SystemWindow>
  );
};

export default StatsPage;
