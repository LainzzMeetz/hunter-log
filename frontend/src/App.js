// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// --- IMPORT YOUR "SHELL" AND "PAGES" ---
import Sidebar from './components/Sidebar';
import StatsPage from './pages/StatsPage';
import QuestsPage from './pages/QuestsPage';
import SkillsPage from './pages/SkillsPage';
import MapPage from './pages/MapPage';
import InventoryPage from './pages/InventoryPage';
import BossesPage from './pages/BossesPage';
import LogbookPage from './pages/LogbookPage';

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '10px 5px', // CRITICAL: Reduced side padding for mobile fit
    minHeight: '100vh',
    width: '100%',
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch the player data *once* when the app loads
  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/player')
      .then(res => setPlayer(res.data))
      .catch(err => console.error("Error fetching player data:", err));
  }, []);

  const renderWindow = () => {
    switch (activeWindow) {
      case 'STATS': return <StatsPage key="stats" player={player} setPlayer={setPlayer} />;
      case 'QUESTS': return <QuestsPage key="quests" player={player} setPlayer={setPlayer} />;
      case 'SKILLS': return <SkillsPage key="skills" player={player} setPlayer={setPlayer} />;
      case 'MAP': return <MapPage key="map" />;
      case 'INVENTORY': return <InventoryPage key="inventory" />;
      case 'BOSSES': return <BossesPage key="bosses" />;
      case 'LOGBOOK': return <LogbookPage key="logbook" />;
      default: return <StatsPage key="stats" player={player} setPlayer={setPlayer} />;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      
      {/* 1. The Mobile Sidebar (always fixed) */}
      <Sidebar 
        activeWindow={activeWindow} 
        setActiveWindow={setActiveWindow} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      {/* 2. Content Area */}
      <div style={styles.pageContainer}>
        
        {/* 3. The Hamburger Icon to open the menu */}
        <motion.button
            style={menuButtonStyles}
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
        >
            ☰ Menu
        </motion.button>

        {/* 4. The Content Window */}
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

// Simple styling for the fixed menu button
const menuButtonStyles = {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 2000,
    backgroundColor: 'rgba(0, 187, 255, 0.1)',
    color: '#00bfff',
    border: '1px solid #00bfff',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
};


export default App;
