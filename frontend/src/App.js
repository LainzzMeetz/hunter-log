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

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // FIXED: Added 50px top padding so the first window isn't hidden
    padding: '50px 5px 20px 5px', 
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

  // Optimized data fetching (prevents lag)
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

  // Stable update function (prevents crashes/re-renders)
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
