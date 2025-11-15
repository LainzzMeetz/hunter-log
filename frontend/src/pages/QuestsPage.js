// frontend/src/pages/QuestsPage.js
import React from 'react';
import DailyQuests from '../components/DailyQuests';
import MainQuests from '../components/MainQuests';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '95vw',
    maxWidth: '500px',
  }
};

// This component is now just a "filter"
function QuestsPage({ player, setPlayer, allQuests }) { 
  
  // Filter the master list
  const dailyQuests = allQuests.filter(q => q.type === 'daily');
  const mainQuests = allQuests.filter(q => q.type === 'main');
  
  return (
    <div style={styles.layout}>
      <DailyQuests 
        player={player} 
        setPlayer={setPlayer} // Pass the main update function
        quests={dailyQuests} // Pass the filtered list
      />
      <MainQuests 
        setPlayer={setPlayer} // Pass the main update function
        quests={mainQuests} // Pass the filtered list
      />
    </div>
  );
}

export default QuestsPage;
