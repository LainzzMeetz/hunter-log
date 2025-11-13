// frontend/src/pages/QuestsPage.js
import React from 'react';
import DailyQuests from '../components/DailyQuests';
import MainQuests from '../components/MainQuests';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    width: '90vw',
    maxWidth: '1000px',
  },
  column: {
    flex: '1',
    minWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  }
};

// --- FIX: Now passes setPlayer down to MainQuests ---
function QuestsPage({ player, setPlayer }) { 
  return (
    <div style={styles.layout}>
      
      <div style={styles.column}>
        <DailyQuests player={player} setPlayer={setPlayer} />
      </div>
      
      <div style={styles.column}>
        {/* Pass setPlayer down for achievement reward */}
        <MainQuests setPlayer={setPlayer} />
      </div>

    </div>
  );
}

export default QuestsPage;