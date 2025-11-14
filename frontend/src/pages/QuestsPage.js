// frontend/src/pages/QuestsPage.js
import React from 'react';
import DailyQuests from '../components/DailyQuests';
import MainQuests from '../components/MainQuests';

const styles = {
  // CRITICAL FIX: The layout now enforces a single column
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '95vw', // Full width of viewport
    maxWidth: '500px', // Maximum desktop width
  }
};

function QuestsPage({ player, setPlayer }) { 
  return (
    <div style={styles.layout}>
      
      {/* Daily Quests (with Sub-Tasks & Timers) */}
      <DailyQuests player={player} setPlayer={setPlayer} />
      
      {/* Main Quests (below Daily Quests) */}
      <MainQuests setPlayer={setPlayer} />

      {/* We can add a Weekly Quests component here later */}

    </div>
  );
}

export default QuestsPage;
