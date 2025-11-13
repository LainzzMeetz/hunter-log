// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// --- IMPORT YOUR "SHELL" AND "PAGES" ---
import Navbar from './components/Navbar';
import StatsPage from './pages/StatsPage';
import QuestsPage from './pages/QuestsPage';
import SkillsPage from './pages/SkillsPage';
import MapPage from './pages/MapPage';
import InventoryPage from './pages/InventoryPage';
import BossesPage from './pages/BossesPage';
import LogbookPage from './pages/LogbookPage'; // <-- IMPORT THE NEW PAGE

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    minHeight: 'calc(100vh - 100px)',
  }
};

const windowVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9, },
  in: { opacity: 1, y: 0, scale: 1, },
  out: { opacity: 0, y: 50, scale: 0.9, }
};

const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };

function App() {
  const [activeWindow, setActiveWindow] = useState('STATS');
  const [player, setPlayer] = useState(null);

  // Fetch the player data *once* when the app loads
  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/player')
      .then(res => setPlayer(res.data))
      .catch(err => console.error("Error fetching player data:", err));
  }, []);


  const renderWindow = () => {
    switch (activeWindow) {
      case 'STATS':
        return <StatsPage key="stats" player={player} setPlayer={setPlayer} />;
      case 'QUESTS':
        return <QuestsPage key="quests" player={player} setPlayer={setPlayer} />;
      case 'SKILLS':
        return <SkillsPage key="skills" />;
      case 'MAP':
        return <MapPage key="map" />;
      case 'INVENTORY':
        return <InventoryPage key="inventory" />;
      case 'BOSSES':
        return <BossesPage key="bosses" />;
      case 'LOGBOOK': // <-- ADD THE NEW CASE
        return <LogbookPage key="logbook" />;
      default:
        return <StatsPage key="stats" player={player} setPlayer={setPlayer} />;
    }
  };
  
  // This is the old v8.1 Penalty system logic. We'll leave it out for now.
  // if (isInPenalty) { ... }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Navbar activeWindow={activeWindow} setActiveWindow={setActiveWindow} />
      <div style={styles.pageContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWindow}
            initial="initial"
            animate="in"
            exit="out"
            variants={windowVariants}
            transition={pageTransition}
          >
            {renderWindow()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;