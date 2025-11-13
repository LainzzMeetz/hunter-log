// frontend/src/components/PlayerStats.js
import React from 'react';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';

const gridStyles = {
  container: {
    width: '600px', // Back to a compact width
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', // --- 3 equal columns (the fix) ---
    gap: '20px',
  },
  statBlock: {},
};

function PlayerStats({ player }) { // No setPlayer needed here
  if (!player) {
    // We expect App.js to handle the initial loading state.
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
      <div style={gridStyles.container}>
        <h2 style={styles.title}>[ Player Stats ]</h2>
        
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
        
        <div style={gridStyles.statGrid}>
          
          <div style={gridStyles.statBlock}>
            <h3 style={styles.subtitle}>Physical Stats</h3>
            <div style={styles.statRow}><span style={styles.statLabel}>Strength</span><span style={styles.statValue}>{player.stats.strength}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Stamina</span><span style={styles.statValue}>{player.stats.stamina}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Vitality</span><span style={styles.statValue}>{player.stats.vitality}</span></div>
          </div>
          
          <div style={gridStyles.statBlock}>
            <h3 style={styles.subtitle}>Mental Stats</h3>
            <div style={styles.statRow}><span style={styles.statLabel}>Focus</span><span style={styles.statValue}>{player.stats.focus}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Clarity</span><span style={styles.statValue}>{player.stats.clarity}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Willpower</span><span style={styles.statValue}>{player.stats.willpower}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Confidence</span><span style={styles.statValue}>{player.stats.confidence}</span></div>
          </div>

          <div style={gridStyles.statBlock}>
            <h3 style={styles.subtitle}>Skill Stats</h3>
            <div style={styles.statRow}><span style={styles.statLabel}>Embedded</span><span style={styles.statValue}>{player.stats.embedded_skill}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>AI/ML</span><span style={styles.statValue}>{player.stats.ai_ml_skill}</span></div>
            <div style={styles.statRow}><span style={styles.statLabel}>Software Dev</span><span style={styles.statValue}>{player.stats.software_dev_skill}</span></div>
            {/* --- FIX: Quantum is now a row here --- */}
            <div style={styles.statRow}><span style={styles.statLabel}>Quantum</span><span style={styles.statValue}>{player.stats.quantum_computing}</span></div>
          </div>
          
        </div>
      </div>
    </SystemWindow>
  );
}

export default PlayerStats;