// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import StatsPage from './pages/StatsPage';
import QuestsPage from './pages/QuestsPage';
import SkillsPage from './pages/SkillsPage';
import MapPage from './pages/MapPage';
import InventoryPage from './pages/InventoryPage';
import BossesPage from './pages/BossesPage';
import LogbookPage from './pages/LogbookPage';

// --- STYLES DEFINED AT THE TOP ---

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // 50px top padding ensures content isn't hidden behind the menu
    padding: '50px 5px 20px 5px', 
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
  }
};

const menuButtonStyles = {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 2000,
    
    // Transparent & Borderless
    backgroundColor: 'transparent', 
    border: 'none',
    
    // Icon Styling
    color: '#00bfff',
    fontSize: '32px', 
    cursor: 'pointer',
    padding: '0',
    
    // Subtle Glow
    textShadow: '0 0 10px rgba(0, 191, 255, 0.5)',
};

const windowVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9, },
  in: { opacity: 1, y: 0, scale: 1, },
  out: { opacity: 0, y: 50, scale: 0.9, }
};

const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };

// --- MAIN COMPONENT ---

function App() {
  const [activeWindow, setActiveWindow] = useState('STATS');
  const [player, setPlayer] = useState(null);
  const [allQuests, setAllQuests] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Optimized data fetching
  const fetchAllData = useCallback(() => {
    axios.get('https://hunter-log.onrender.com/api/player')
      .then(res => setPlayer(res.data))
      .catch(err => console.error("Error fetching player data:", err));
      
    axios.get('https://hunter-log.onrender.com/api/quests')
      .then(res => setAllQuests(res.data))
      .catch(err => console.error("Error fetching quests:", err));
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Stable update function
  const updatePlayerAndQuests = useCallback((newPlayerData) => {
    setPlayer(newPlayerData);
    axios.get('https://hunter-log.onrender.com/api/quests')
      .then(res => setAllQuests(res.data))
      .catch(err => console.error("Error fetching quests:", err));
  }, []);

  const renderWindow = () => {
    switch (activeWindow) {
      case 'STATS':
        return <StatsPage key="stats" player={player} />;
      case 'QUESTS':
        return <QuestsPage 
                  key="quests" 
                  player={player} 
                  setPlayer={updatePlayerAndQuests} 
                  allQuests={allQuests} 
                />;
      case 'SKILLS':
        return <SkillsPage key="skills" player={player} setPlayer={setPlayer} />;
      case 'MAP':
        return <MapPage key="map" />;
      case 'INVENTORY':
        return <InventoryPage key="inventory" />;
      case 'BOSSES':
        return <BossesPage key="bosses" />;
      case 'LOGBOOK':
        return <LogbookPage key="logbook" />;
      default:
        return <StatsPage key="stats" player={player} />;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Sidebar 
        activeWindow={activeWindow} 
        setActiveWindow={setActiveWindow} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div style={styles.pageContainer}>
        {/* THE MENU ICON BUTTON */}
        <motion.button
            style={menuButtonStyles}
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
        >
            ☰
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeWindow}
            initial="initial"
            animate="in"
            exit="out"
            variants={windowVariants}
            transition={pageTransition}
            style={{ width: '100%', maxWidth: '500px' }}
          >
            {renderWindow()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
