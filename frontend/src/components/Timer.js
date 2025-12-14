// frontend/src/components/Timer.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { styles } from './styles';

// Safe Audio Player (Prevents crashes)
const safePlay = (path) => {
  try {
    const audio = new Audio(path);
    audio.volume = 0.5;
    audio.play().catch(() => console.warn("Audio blocked (harmless)."));
  } catch (err) {
    console.warn("Audio error (harmless).");
  }
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

function Timer({ quest, onComplete }) {
  // 1. Internal State (Isolated from Parent)
  const durationSec = quest.duration_minutes * 60;
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [isActive, setIsActive] = useState(false);
  
  // 2. Refs for Mutable Variables (No Re-renders)
  const endTimeRef = useRef(null);
  const timerIdRef = useRef(null);

  // 3. The Delta Engine
  const startTimer = () => {
    safePlay('/audio/timer_start.mp3');
    setIsActive(true);
    
    // Calculate the absolute point in time when this finishes
    // This makes it immune to lag or background throttling
    const now = Date.now();
    endTimeRef.current = now + (timeLeft * 1000);
    
    tick();
  };

  const tick = () => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.ceil((endTimeRef.current - now) / 1000);

    if (remaining <= 0) {
      // Complete
      setTimeLeft(0);
      setIsActive(false);
      safePlay('/audio/quest_complete.mp3');
      timerIdRef.current = null;
    } else {
      // Continue
      setTimeLeft(remaining);
      // Recursively schedule next tick
      timerIdRef.current = setTimeout(tick, 1000);
    }
  };

  const stopTimer = () => {
    if (timerIdRef.current) clearTimeout(timerIdRef.current);
    safePlay('/audio/click.mp3');
    setIsActive(false);
    endTimeRef.current = null;
    // Reset to full duration
    setTimeLeft(durationSec);
  };

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, []);

  // Reset if Quest Duration changes externally
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(quest.duration_minutes * 60);
    }
  }, [quest.duration_minutes, isActive]);

  // Render Logic
  if (timeLeft === 0 && !isActive) {
    return (
      <motion.button 
        style={{...styles.button, backgroundColor: '#00bfff', color: '#000', fontWeight: 'bold'}}
        onClick={() => onComplete(quest._id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        CLAIM REWARD
      </motion.button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ 
          ...styles.font, 
          fontSize: '28px', 
          color: isActive ? '#00ff7f' : '#fff', 
          minWidth: '90px'
      }}>
        {formatTime(timeLeft)}
      </div>
      
      {!isActive ? (
        <motion.button
          style={styles.button}
          onClick={startTimer}
          whileHover={{ scale: 1.1, backgroundColor: '#00bfff', color: '#000' }}
        >
          START
        </motion.button>
      ) : (
        <motion.button
          style={{ ...styles.button, borderColor: '#ff4444', color: '#ff4444' }}
          onClick={stopTimer}
          whileHover={{ scale: 1.1, backgroundColor: '#ff4444', color: '#000' }}
        >
          STOP
        </motion.button>
      )}
    </div>
  );
}

// Optimization: Only re-render if quest ID or duration changes
export default React.memo(Timer);
