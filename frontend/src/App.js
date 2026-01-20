// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

// --- COMPONENTS ---
import StatsPage from './pages/StatsPage';
import DailyQuests from './components/DailyQuests';
import BossesPage from './pages/BossesPage';
import MapPage from './pages/MapPage';
import SkillsPage from './pages/SkillsPage';
import SinTransmutation from './components/SinTransmutation';

// --- CONFIG ---
import { DEADLY_SINS } from './config/sinsConfig';

// --- THEME ---
const theme = {
  bg: '#050505',
  primary: '#00bfff',
  success: '#00ff7f',
  danger: '#ff4444',
  text: '#e0e0e0',
  font: '"Share Tech Mono", monospace',
};

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: theme.bg,
    color: theme.text,
    fontFamily: theme.font,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  contentArea: {
    flex: 1,
    padding: '20px',
    paddingBottom: '80px',
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

export const playSound = (type) => {
  const file = type === 'complete' ? '/audio/quest_complete.mp3' : '/audio/click.mp3';
  const audio = new Audio(file);
  audio.volume = 0.5;
  audio.play().catch(e => console.warn("Audio missing:", e));
};

// --- HUNTER RANK LOGIC (Solo Leveling Style) ---
const getHunterRank = (level) => {
  if (level < 10) return "E-RANK";
  if (level < 20) return "D-RANK";
  if (level < 30) return "C-RANK";
  if (level < 40) return "B-RANK";
  if (level < 50) return "A-RANK";
  return "S-RANK";
};

function App() {
  const [activeTab, setActiveTab] = useState('STATUS');
  const [player, setPlayer] = useState(null);
  const [quests, setQuests] = useState([]);

  // --- NEW STATE FOR SIN SYSTEM ---
  const [activeSin, setActiveSin] = useState(null);
  const [showSinMenu, setShowSinMenu] = useState(false);

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

  const updatePlayer = (newData) => {
    setPlayer(newData);
    axios.get('https://hunter-log.onrender.com/api/quests').then(res => setQuests(res.data));
  };

  const handleTabChange = (tab) => {
    playSound('click');
    setActiveTab(tab);
  };

  // --- NEW HANDLER FOR SIN COMPLETION (FIXED & ACTIVE) ---
  const handleTransmutationComplete = (sin, xpGained) => {
    playSound('complete');
    
    // 1. Instant UI Update (Optimistic)
    if (player) {
      setPlayer(prev => ({ ...prev, xp: prev.xp + xpGained }));
    }

    // 2. Send to Backend (NOW ACTIVE)
    axios.post('https://hunter-log.onrender.com/api/emergency/complete', {
        username: player.username,
        energy_type: sin,
        xp_reward: xpGained
    })
    .then(res => {
        console.log("System Saved XP:", res.data);
    })
    .catch(err => {
        console.error("Save Failed:", err);
    });

    // 3. Reset UI
    setActiveSin(null);
    setShowSinMenu(false);
  };

  const renderContent = () => {
    if (!player) return <div style={{textAlign:'center', marginTop: '50px'}}>SYSTEM LOADING...</div>;

    const rank = getHunterRank(player.level);

    switch (activeTab) {
      case 'STATUS':
        return (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div style={{marginBottom: '20px', borderBottom: `1px solid ${theme.primary}`, paddingBottom: '10px'}}>
               <h1 style={{margin:0, fontSize: '24px', color: theme.primary}}>DASHBOARD</h1>
               <div style={{display:'flex', justifyContent:'space-between', color: '#888', fontSize:'12px'}}>
                 <span>ID: {player.username.toUpperCase()}</span>
                 <span style={{color: theme.success, fontWeight: 'bold'}}>{rank}</span>
               </div>
            </div>
            <StatsPage player={player} />
          </motion.div>
        );

      case 'MISSIONS':
        return (
          <motion.div initial={{x: 20, opacity:0}} animate={{x: 0, opacity:1}} exit={{x: -20, opacity:0}}>
            <h2 style={{color: theme.danger, borderBottom: `1px solid ${theme.danger}`, fontSize:'18px'}}>ACTIVE MISSIONS</h2>
            <DailyQuests player={player} setPlayer={updatePlayer} quests={quests} />
            
            <div style={{marginTop: '30px'}}>
               <h3 style={{color: theme.danger, fontSize: '16px'}}>ACTIVE THREATS</h3>
               <BossesPage /> 
            </div>
          </motion.div>
        );

      case 'PROGRESS':
        return (
          <motion.div initial={{x: -20, opacity:0}} animate={{x: 0, opacity:1}} exit={{x: 20, opacity:0}}>
            <h2 style={{color: theme.primary, borderBottom: `1px solid ${theme.primary}`, fontSize:'18px'}}>ROADMAP</h2>
            <MapPage />
            <div style={{marginTop: '30px'}}>
               <h3 style={{color: theme.success, fontSize: '16px'}}>SKILLS ACQUIRED</h3>
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

      {/* --- FLOATING SIN CONTROLLER (Bottom Right) --- */}
      <div style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 1100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
        
        {/* The Menu (Hidden by default) */}
        {showSinMenu && (
          <motion.div 
            initial={{opacity:0, y: 10}} 
            animate={{opacity:1, y: 0}} 
            exit={{opacity:0, y: 10}}
            style={{background: 'rgba(0,0,0,0.95)', border: '1px solid #333', padding: '10px', borderRadius: '5px', minWidth: '150px'}}
          >
            {Object.keys(DEADLY_SINS).map(key => (
              <button
                key={key}
                onClick={() => { playSound('click'); setActiveSin(key); }}
                style={{
                  display: 'block', width: '100%', padding: '10px 15px', margin: '5px 0',
                  background: 'none', border: `1px solid ${DEADLY_SINS[key].color}`,
                  color: DEADLY_SINS[key].color, fontFamily: theme.font, cursor: 'pointer',
                  textAlign: 'right', fontWeight: 'bold', fontSize: '12px'
                }}
              >
                {key} ◈
              </button>
            ))}
          </motion.div>
        )}

        {/* The Warning Button (!) */}
        <button 
          onClick={() => { playSound('click'); setShowSinMenu(!showSinMenu); }}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: theme.danger, color: '#000', border: 'none',
            fontSize: '30px', fontWeight: 'bold', boxShadow: `0 0 15px ${theme.danger}`,
            cursor: 'pointer', fontFamily: theme.font
          }}
        >
          !
        </button>
      </div>

      {/* --- SIN OVERLAY COMPONENT --- */}
      {activeSin && (
        <SinTransmutation 
          selectedSin={activeSin} 
          onClose={() => setActiveSin(null)} 
          onComplete={handleTransmutationComplete} 
        />
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <div style={styles.navBar}>
        <button style={{...styles.navButton, ...(activeTab === 'STATUS' ? styles.activeNav : {})}} onClick={() => handleTabChange('STATUS')}>
          <span>◈</span> STATUS
        </button>
        <button style={{...styles.navButton, ...(activeTab === 'MISSIONS' ? styles.activeNav : {})}} onClick={() => handleTabChange('MISSIONS')}>
          <span>⚔</span> MISSIONS
        </button>
        <button style={{...styles.navButton, ...(activeTab === 'PROGRESS' ? styles.activeNav : {})}} onClick={() => handleTabChange('PROGRESS')}>
          <span>⟁</span> PROGRESS
        </button>
      </div>
    </div>
  );
}

export default App;
