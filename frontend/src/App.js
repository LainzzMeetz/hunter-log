// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// --- COMPONENTS ---
import StatsPage from './pages/StatsPage';
import DailyQuests from './components/DailyQuests'; // Reusing your DailyQuests component
import BossesPage from './pages/BossesPage';
import MapPage from './pages/MapPage';
import SkillsPage from './pages/SkillsPage';

// --- THE TACTICAL THEME ---
const theme = {
  bg: '#050505', // Void Black
  panel: 'rgba(15, 15, 20, 0.85)', // Glass
  primary: '#00bfff', // Cyan
  success: '#00ff7f', // Green
  danger: '#ff4444', // Red
  text: '#e0e0e0', // Off-white
  font: '"Share Tech Mono", monospace',
};

// --- STYLES ---
const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: theme.font,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    padding: '20px',
    paddingBottom: '80px', // Space for bottom nav
    overflowY: 'auto',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '70px',
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    borderTop: `1px solid ${theme.primary}`,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: theme.font,
    cursor: 'pointer',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  activeNav: {
    color: theme.primary,
    textShadow: `0 0 10px ${theme.primary}`,
  }
};

// --- DYNAMIC CLASS EVOLUTION LOGIC ---
const getEvolvedClassName = (track, level) => {
  let baseTitle = "NOVICE";
  let midTitle = "ADVENTURER";
  let eliteTitle = "EXPERT";
  let masterTitle = "MASTER";

  // 1. Define Titles per Track
  if (track === 'software_dev_skill') {
    midTitle = "SHADOW DEV"; eliteTitle = "ARCHITECT"; masterTitle = "CODE MONARCH";
  } else if (track === 'ai_ml_skill') {
    midTitle = "DATA HUNTER"; eliteTitle = "AI ARCHITECT"; masterTitle = "SINGULARITY";
  } else if (track === 'embedded_skill') {
    midTitle = "IRON CODER"; eliteTitle = "SYSTEM ENGR"; masterTitle = "MACHINE GOD";
  } else if (track === 'cybersecurity') {
    midTitle = "GATEKEEPER"; eliteTitle = "NETRUNNER"; masterTitle = "VOID WALKER";
  }

  // 2. Determine Rank based on Level
  if (level < 10) return `NOVICE`; // Lvl 1-9
  if (level < 30) return midTitle; // Lvl 10-29
  if (level < 50) return eliteTitle; // Lvl 30-49
  return masterTitle; // Lvl 50+
};

// --- MAIN APP COMPONENT ---
function App() {
  const [activeTab, setActiveTab] = useState('STATUS');
  const [player, setPlayer] = useState(null);
  const [quests, setQuests] = useState([]);

  // Data Fetching
  const fetchAllData = useCallback(() => {
    axios.get('https://hunter-log.onrender.com/api/player')
      .then(res => setPlayer(res.data))
      .catch(err => console.error(err));
      
    axios.get('https://hunter-log.onrender.com/api/quests')
      .then(res => setQuests(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Update wrapper
  const updatePlayer = (newData) => {
    setPlayer(newData);
    // Refresh quests if needed (e.g. after completing one)
    axios.get('https://hunter-log.onrender.com/api/quests')
      .then(res => setQuests(res.data));
  };

  // --- RENDER TABS ---
  const renderContent = () => {
    if (!player) return <div style={{textAlign:'center', marginTop: '50px'}}>SYSTEM LOADING...</div>;

    // Calculate Evolved Class Name
    const className = getEvolvedClassName(player.active_skill_track, player.level);

    switch (activeTab) {
      case 'STATUS':
        return (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            {/* Custom Header for Status */}
            <div style={{marginBottom: '20px', borderBottom: `1px solid ${theme.primary}`, paddingBottom: '10px'}}>
               <h1 style={{margin:0, fontSize: '24px', color: theme.primary}}>SYSTEM STATUS</h1>
               <div style={{display:'flex', justifyContent:'space-between', color: '#888', fontSize:'12px'}}>
                  <span>ID: {player.username.toUpperCase()}</span>
                  <span style={{color: theme.success}}>{className}</span>
               </div>
            </div>
            {/* Reusing your Stats Page but injecting the updated player */}
            <StatsPage player={{...player, classNameOverride: className}} />
          </motion.div>
        );

      case 'MISSIONS':
        return (
          <motion.div initial={{x: 20, opacity:0}} animate={{x: 0, opacity:1}} exit={{x: -20, opacity:0}}>
            <h2 style={{color: theme.danger, borderBottom: `1px solid ${theme.danger}`}}>ACTIVE OPERATIONS</h2>
            <DailyQuests player={player} setPlayer={updatePlayer} quests={quests} />
            
            <div style={{marginTop: '30px'}}>
               <h3 style={{color: theme.danger, fontSize: '16px'}}>THREAT DETECTED</h3>
               <BossesPage /> 
            </div>
          </motion.div>
        );

      case 'EVOLUTION':
        return (
          <motion.div initial={{x: -20, opacity:0}} animate={{x: 0, opacity:1}} exit={{x: 20, opacity:0}}>
            <h2 style={{color: theme.primary, borderBottom: `1px solid ${theme.primary}`}}>EVOLUTION TREE</h2>
            <MapPage />
            <div style={{marginTop: '30px'}}>
               <h3 style={{color: theme.success, fontSize: '16px'}}>SKILL DATABASE</h3>
               <SkillsPage player={player} setPlayer={setPlayer} />
            </div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.contentArea}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>

      {/* 3-TAB NAVIGATION DECK */}
      <div style={styles.navBar}>
        <button 
          style={{...styles.navButton, ...(activeTab === 'STATUS' ? styles.activeNav : {})}}
          onClick={() => setActiveTab('STATUS')}
        >
          <span>◈</span> STATUS
        </button>
        
        <button 
          style={{...styles.navButton, ...(activeTab === 'MISSIONS' ? styles.activeNav : {})}}
          onClick={() => setActiveTab('MISSIONS')}
        >
          <span>⚔</span> MISSIONS
        </button>
        
        <button 
          style={{...styles.navButton, ...(activeTab === 'EVOLUTION' ? styles.activeNav : {})}}
          onClick={() => setActiveTab('EVOLUTION')}
        >
          <span>⟁</span> EVOLUTION
        </button>
      </div>
    </div>
  );
}

export default App;
