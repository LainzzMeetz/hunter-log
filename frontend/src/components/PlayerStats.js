// frontend/src/components/PlayerStats.js
import React from 'react';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';

const statStyles = {
  // Simple full width container
  container: {
    width: '100%',
  },
  // The block for each stat category (Physical, Mental, Skill)
  statBlock: {
    marginBottom: '20px',
    padding: '10px 0',
  },
  // Subtitle styling is used for Physical/Mental/Skill Stats
  subtitle: {
    ...styles.subtitle,
    marginTop: '10px',
    borderBottom: `1px solid ${styles.title.color}33`,
  }
};

function PlayerStats({ player }) {
  if (!player) {
    return (
      <SystemWindow>
        <h2 style={styles.title}>[ Player Stats ]</h2>
        <div>Loading Stats...</div>
      </SystemWindow>
    );
  }

  const expPercentage = (player.exp / player.exp_to_next_level) * 100;

  return (
    <SystemWindow layout>
      <div style={statStyles.container}>
        <h2 style={styles.title}>[ Player Stats ]</h2>
        
        {/* --- TOP-LEVEL STATS (Always single column) --- */}
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Level</span>
          <span style={styles.statValue}>{player.level}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>EXP</span>
          <span style={styles.statValue}>{player.exp} / {player.exp_to_next_level}</span>
        </div>
        <div style={styles.expBar}>
          <motion.div 
            style={{ ...styles.expProgress, width: `${expPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${expPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        {/* --- STAT BLOCKS (Single Column Stacked) --- */}
        <div style={statStyles.statBlock}>
          <h3 style={statStyles.subtitle}>Physical Stats</h3>
          <div style={styles.statRow}><span style={styles.statLabel}>Strength</span><span style={styles.statValue}>{player.stats.strength}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Stamina</span><span style={styles.statValue}>{player.stats.stamina}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Vitality</span><span style={styles.statValue}>{player.stats.vitality}</span></div>
        </div>
        
        <div style={statStyles.statBlock}>
          <h3 style={statStyles.subtitle}>Mental Stats</h3>
          <div style={styles.statRow}><span style={styles.statLabel}>Focus</span><span style={styles.statValue}>{player.stats.focus}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Clarity</span><span style={styles.statValue}>{player.stats.clarity}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Willpower</span><span style={styles.statValue}>{player.stats.willpower}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Confidence</span><span style={styles.statValue}>{player.stats.confidence}</span></div>
        </div>

        <div style={statStyles.statBlock}>
          <h3 style={statStyles.subtitle}>Skill Stats</h3>
          <div style={styles.statRow}><span style={styles.statLabel}>Embedded</span><span style={styles.statValue}>{player.stats.embedded_skill}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>AI/ML</span><span style={styles.statValue}>{player.stats.ai_ml_skill}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Software Dev</span><span style={styles.statValue}>{player.stats.software_dev_skill}</span></div>
          <div style={styles.statRow}><span style={styles.statLabel}>Quantum</span><span style={styles.statValue}>{player.stats.quantum_computing}</span></div>
        </div>
        
      </div>
    </SystemWindow>
  );
}

export default PlayerStats;
