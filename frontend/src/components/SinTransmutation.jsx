import React, { useState, useEffect } from 'react';
import { DEADLY_SINS } from '../config/sinsConfig'; // Import config
import './SinTransmutation.css';

const SinTransmutation = ({ selectedSin, onClose, onComplete }) => {
  // Load the specific data for the selected sin (e.g., LUST or WRATH)
  const config = DEADLY_SINS[selectedSin]; 
  
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [completedTasks, setCompletedTasks] = useState({});

  // Timer Logic (Same as before)
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleFinish = () => {
    // Check if all tasks are done
    const allDone = config.tasks.every(t => completedTasks[t.id]);
    if (allDone) {
      // Calculate Total XP
      const totalXp = config.tasks.reduce((acc, t) => acc + t.xp, 0);
      onComplete(selectedSin, totalXp);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Dynamic Styles based on the Sin's Color
  const styleColor = { 
    color: config.color, 
    borderColor: config.color,
    boxShadow: `0 0 15px ${config.color}40` // 40 is opacity
  };

  return (
    <div className="transmutation-overlay">
      <div className="system-window" style={styleColor}>
        <div className="header">
          <h1 className="blink">⚠️ {config.label} ⚠️</h1>
          <p>{config.questDescription}</p>
        </div>

        <div className="timer-box">
          <h2>PROTOCOL: {config.questTitle}</h2>
          <div className="timer-digits">{formatTime(timeLeft)}</div>
        </div>

        <div className="checklist">
          {config.tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${completedTasks[task.id] ? 'active' : ''}`}
              onClick={() => toggleTask(task.id)}
              style={{ borderColor: completedTasks[task.id] ? config.color : '#333' }}
            >
              <span className="checkbox">[{completedTasks[task.id] ? 'X' : ' '}]</span>
              <span>{task.text} (+{task.xp} XP)</span>
            </div>
          ))}
        </div>

        <div className="footer-actions">
          <button className="btn-cancel" onClick={onClose}>FAILURE (CLOSE)</button>
          <button 
            className="btn-confirm" 
            style={{ backgroundColor: config.color, color: '#000' }}
            onClick={handleFinish}
          >
            CONFIRM TRANSMUTATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default SinTransmutation;
