// frontend/src/components/SystemWindow.js
import React from 'react';
import { motion } from 'framer-motion';
import { styles } from './styles';

const SystemWindow = ({ children, title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        ...styles.window,
        position: 'relative',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Decorative Corner Lines */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '2px', backgroundColor: '#00bfff', boxShadow: '0 0 10px #00bfff' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '20px', backgroundColor: '#00bfff', boxShadow: '0 0 10px #00bfff' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '2px', backgroundColor: '#00bfff', boxShadow: '0 0 10px #00bfff' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '2px', height: '20px', backgroundColor: '#00bfff', boxShadow: '0 0 10px #00bfff' }} />

      {title && <h2 style={styles.title}>{title}</h2>}
      
      {children}
    </motion.div>
  );
};

// CRITICAL OPTIMIZATION:
// This component will NOT re-render unless its props change.
export default React.memo(SystemWindow);
