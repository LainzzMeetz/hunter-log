// frontend/src/components/Timer.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { styles } from './styles';

// --- NEW "SAFE" AUDIO LOGIC ---
// This function safely creates and plays a sound
const playSound = (src) => {
  try {
    const sound = new Audio(src);
    sound.currentTime = 0;
    // .play() can fail if the user hasn't interacted, so we add a .catch()
    sound.play().catch(e => console.warn("Audio play failed:", e));
  } catch (e) {
    console.error("Audio file error (is the file missing in /public/audio?):", e);
  }
};
// ---

// Helper function to format the timer
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function Timer({ quest, onComplete }) {
  const [totalSeconds, setTotalSeconds] = useState(quest.duration_minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (isActive && totalSeconds === 0) {
      setIsActive(false);
      setIsDone(true);
      playSound('/audio/quest_complete.mp3'); // Use the safe function
    }
    return () => clearInterval(interval);
  }, [isActive, totalSeconds]);

  const handleStart = () => {
    playSound('/audio/timer_start.mp3'); // Use the safe function
    setIsActive(true);
  };

  const handleRestart = () => {
    playSound('/audio/click.mp3'); // Use the safe function
    setIsActive(false);
    setIsDone(false);
    setTotalSeconds(quest.duration_minutes * 60);
  };

  const handleComplete = () => {
    onComplete(quest._id);
  };

  if (isDone) {
    return (
      <motion.button
        style={{ ...styles.button, backgroundColor: '#00bfff', color: '#000' }}
        onClick={handleComplete}
      >
        Click to Complete
      </motion.button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ ...styles.font, fontSize: '24px', color: '#fff' }}>
        {formatTime(totalSeconds)}
      </div>
      
      {!isActive ? (
        <motion.button
          style={styles.button}
          onClick={handleStart}
          whileHover={{ scale: 1.1, backgroundColor: '#00bfff', color: '#000' }}
        >
          Start
        </motion.button>
      ) : (
        <div style={{...styles.statLabel, color: '#ff4444'}}>In Progress...</div>
      )}

      <motion.button
        style={{ ...styles.button, color: '#aaa', borderColor: '#555' }}
        onClick={handleRestart}
        whileHover={{ scale: 1.1, backgroundColor: '#555', color: '#fff' }}
      >
        Restart
      </motion.button>
    </div>
  );
}

export default Timer;