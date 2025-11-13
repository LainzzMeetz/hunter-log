// frontend/src/pages/QuestsPage.js
import React from 'react';
import DailyQuests from '../components/DailyQuests';
import MainQuests from '../components/MainQuests';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap', // CRITICAL FIX: Allows columns to wrap/stack
    justifyContent: 'center',
    gap: '20px',
    width: '95vw', // Use viewport width instead of fixed pixels
    maxWidth: '1000px',
  },
  column: {
    flex: '1',
    minWidth: '300px', // Allow the column to shrink down to 300px
    maxWidth: '480px', // Stop it from getting too wide on a large screen
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }
};

function QuestsPage({ player, setPlayer }) { 
  return (
    <div style={styles.layout}>
      
      <div style={styles.column}>
        <DailyQuests player={player} setPlayer={setPlayer} />
      </div>
      
      <div style={styles.column}>
        <MainQuests setPlayer={setPlayer} />
      </div>

    </div>
  );
}

export default QuestsPage;
