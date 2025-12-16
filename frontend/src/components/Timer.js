// frontend/src/components/Timer.js
import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ quest, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(quest.duration_minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const endTimeRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      // If we just started, set the target end time
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        const now = Date.now();
        const distance = endTimeRef.current - now;

        if (distance <= 0) {
          // TIMER FINISHED
          clearInterval(interval);
          setTimeLeft(0);
          setIsActive(false);
          onComplete(quest._id); // Trigger API
        } else {
          // Update display
          setTimeLeft(Math.ceil(distance / 1000));
        }
      }, 1000);
    } else {
      // Paused or stopped
      clearInterval(interval);
      endTimeRef.current = null; // Reset target if stopped manually
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, quest._id]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', 
      backgroundColor: '#111', 
      padding: '5px 10px', 
      borderRadius: '4px',
      border: '1px solid #333',
      width: 'fit-content'
    }}>
      <div style={{
        fontFamily: '"Share Tech Mono", monospace', 
        fontSize: '18px', 
        color: isActive ? '#00bfff' : '#888',
        fontWeight: 'bold',
        minWidth: '60px',
        textAlign: 'center'
      }}>
        {formatTime(timeLeft)}
      </div>

      <button 
        onClick={toggleTimer}
        style={{
          backgroundColor: isActive ? '#ff4444' : '#00bfff',
          color: '#000',
          border: 'none',
          padding: '5px 10px',
          fontFamily: '"Share Tech Mono", monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {isActive ? 'PAUSE' : 'START FOCUS'}
      </button>
    </div>
  );
};

export default Timer;
