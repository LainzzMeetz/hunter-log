// frontend/src/components/Navbar.js
import React from 'react';
import { motion } from 'framer-motion';

const SYSTEM_BLUE = '#00bfff';
const SYSTEM_BLUE_DIM = 'rgba(0, 187, 255, 0.4)';
const SYSTEM_BLUE_BG = 'rgba(0, 187, 255, 0.05)';
const SYSTEM_FONT = "'Share Tech Mono', monospace";

const navStyles = {
  navbar: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottom: `2px solid ${SYSTEM_BLUE}`,
    boxShadow: `0 0 15px ${SYSTEM_BLUE}`,
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    fontFamily: SYSTEM_FONT,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navButton: {
    padding: '10px 20px',
    color: '#aaa',
    backgroundColor: SYSTEM_BLUE_BG,
    border: `1px solid ${SYSTEM_BLUE_DIM}`,
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    textShadow: 'none',
    boxShadow: 'none',
  },
  navButtonHover: {
    color: SYSTEM_BLUE,
    borderColor: SYSTEM_BLUE,
    boxShadow: `0 0 10px ${SYSTEM_BLUE}`,
    textShadow: `0 0 5px ${SYSTEM_BLUE}`,
  },
  navButtonActive: {
    color: '#fff',
    backgroundColor: 'rgba(0, 187, 255, 0.2)',
    borderColor: SYSTEM_BLUE,
    boxShadow: `0 0 15px ${SYSTEM_BLUE}`,
    textShadow: `0 0 8px ${SYSTEM_BLUE}`,
  }
};

const clickSound = new Audio('/audio/click.mp3');

function Navbar({ activeWindow, setActiveWindow }) {
  
  const handleNavClick = (windowName) => {
    clickSound.currentTime = 0;
    clickSound.play();
    setActiveWindow(windowName);
  };

  // --- NEW: "LOGBOOK" ADDED ---
  const windows = ['STATS', 'QUESTS', 'SKILLS', 'MAP', 'INVENTORY', 'BOSSES', 'LOGBOOK'];

  return (
    <motion.nav 
      style={navStyles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {windows.map(windowName => (
        <motion.button 
          key={windowName}
          style={{
            ...navStyles.navButton,
            ...(activeWindow === windowName ? navStyles.navButtonActive : {})
          }}
          onClick={() => handleNavClick(windowName)}
          whileHover={navStyles.navButtonHover} 
          whileTap={{ scale: 0.95 }}
        >
          {windowName}
        </motion.button>
      ))}
    </motion.nav>
  );
}

export default Navbar;