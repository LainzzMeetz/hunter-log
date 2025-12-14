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

// --- STYLE FIX: SAFE ZONE PADDING ---
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // FIX: 80px top padding ensures content starts BELOW the menu button
    padding: '80px 5px 20px 5px', 
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
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
  const [allQuests, setAllQuests] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch Logic (Memoized to prevent loops)
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

  // Update Logic (Passed down to children)
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
        {/* MENU BUTTON */}
        <motion.button
            style={menuButtonStyles}
            onClick={() => setIsMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            ☰ SYSTEM MENU
        </motion.button>

        {/* PAGE CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWindow}
            initial="initial"
            animate="in"
            exit="out"
            variants={windowVariants}
            transition={pageTransition}
            style={{ width: '100%' }}
          >
            {renderWindow()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- STYLE FIX: GLASSMORPHISM BUTTON ---
const menuButtonStyles = {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 2000,
    // Darker, semi-transparent background
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    // Blurs content behind the button when scrolling
    backdropFilter: 'blur(8px)',
    color: '#00bfff',
    border: '1px solid #00bfff',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: '"Share Tech Mono", monospace',
    boxShadow: '0 0 10px rgba(0, 191, 255, 0.2)',
};

export default App;
