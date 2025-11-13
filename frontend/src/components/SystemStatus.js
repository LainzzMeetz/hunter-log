// frontend/src/components/SystemStatus.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';

// --- AUDIO LOGIC ---
const clickSound = new Audio('/audio/click.mp3');
const penaltySound = new Audio('/audio/penalty_alarm.mp3'); // We'll need a new "alarm" sound
// ---

// Helper function to format the timer
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;

function SystemStatus({ player, setPlayer }) {
  const [remainingTime, setRemainingTime] = useState(0);

  // This "tick" effect runs every second to update the timer
  useEffect(() => {
    if (!player || !player.daily_timer_start) {
      setRemainingTime(0);
      return;
    }

    const calculateRemainingTime = () => {
      const startTime = new Date(player.daily_timer_start).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = FOUR_HOURS_IN_SECONDS - elapsedSeconds;
      
      if (remaining <= 0) {
        setRemainingTime(0);
        // We'll let the "heartbeat" in App.js handle the penalty
      } else {
        setRemainingTime(remaining);
      }
    };
    
    calculateRemainingTime(); // Run once immediately
    const interval = setInterval(calculateRemainingTime, 1000); // Update every second
    
    return () => clearInterval(interval); // Clean up the interval
  }, [player]);


  const handleStartCycle = async () => {
    clickSound.currentTime = 0;
    clickSound.play();
    
    try {
      const res = await axios.post('https://hunter-log.onrender.com/api/dailies/start');
      setPlayer(res.data); // Update the player with the new timer start time
    } catch (error) {
      console.error("Error starting daily cycle:", error);
    }
  };

  if (!player) return null; // Don't show anything if player isn't loaded

  // The timer is active! Show the countdown.
  if (player.daily_timer_start) {
    return (
      <SystemWindow>
        <h2 style={styles.title}>[ Daily Cycle Active ]</h2>
        <div style={{ ...styles.font, fontSize: '48px', color: '#fff', textAlign: 'center' }}>
          {formatTime(remainingTime)}
        </div>
        <div style={{...styles.statLabel, textAlign: 'center', marginTop: '10px'}}>
          Time remaining to complete daily quests.
        </div>
      </SystemWindow>
    );
  }

  // The timer is NOT active. Show the "Start" button.
  return (
    <SystemWindow>
      <h2 style={styles.title}>[ Daily Cycle ]</h2>
      <div style={{...styles.statLabel, textAlign: 'center', marginBottom: '20px'}}>
        You have not started your daily quests.
      </div>
      <motion.button 
        style={{...styles.button, width: '100%', fontSize: '18px'}}
        onClick={handleStartCycle}
        whileHover={{ scale: 1.05, backgroundColor: '#00bfff', color: '#000' }}
        whileTap={{ scale: 0.95 }}
      >
        Start Daily Cycle
      </motion.button>
    </SystemWindow>
  );
}

export default SystemStatus;