// frontend/src/components/SystemWindow.js
import React from 'react';
import { motion } from 'framer-motion';
import { styles } from './styles'; // Import the shared styles

const SYSTEM_BLUE_DIM = '#00bfff55';
const SYSTEM_BLUE_BG = 'rgba(0, 187, 255, 0.05)';

const windowStyles = {
  window: {
    ...styles.font, // Apply the "Share Tech Mono" font
    backgroundColor: SYSTEM_BLUE_BG,
    borderRadius: '10px',
    border: `1px solid ${SYSTEM_BLUE_DIM}`,
    boxShadow: `0 0 20px #00bfff44`,
    padding: '20px',
    color: '#e0e0e0',
  },
};

// --- "S-RANK" ANIMATION ---
const windowVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, // Start smaller
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1, // End at full size
    y: 0,
    transition: { 
      type: "spring", // Use a "spring" for a bouncier, 'active' feel
      stiffness: 260,
      damping: 20,
    } 
  },
};
// ---

function SystemWindow({ children, ...props }) {
  return (
    <motion.div  // This is the opening tag
      style={windowStyles.window}
      variants={windowVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div> // <-- THIS IS THE FIX. It's now 'div' instead of 'dim'.
  );
}

export default SystemWindow;