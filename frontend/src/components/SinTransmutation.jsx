// frontend/src/components/SinTransmutation.jsx 
import React, { useState, useEffect } from 'react';
import { DEADLY_SINS } from '../config/sinsConfig'; 

// Inline styles to match your App.js theme
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 2000, fontFamily: '"Share Tech Mono", monospace',
  },
  box: {
    width: '90%', maxWidth: '400px',
    border: '2px solid', // Color comes from config
    padding: '20px', backgroundColor: '#050505',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)', textAlign: 'center',
    color: '#e0e0e0',
  },
  timer: {
    fontSize: '40px', margin: '20px 0', fontWeight: 'bold',
  },
  taskItem: {
    border: '1px solid #333', padding: '10px', marginBottom: '10px',
    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center'
  },
  button: {
    background: 'none', border: '1px solid', padding: '10px 20px',
    color: 'inherit', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer',
    marginTop: '20px', width: '100%', textTransform: 'uppercase'
  }
};

const SinTransmutation = ({ selectedSin, onClose, onComplete }) => {
  const config = DEADLY_SINS[selectedSin]; 
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleFinish = () => {
    const allDone = config.tasks.every(t => completedTasks[t.id]);
    if (allDone) {
      const totalXp = config.tasks.reduce((acc, t) => acc + t.xp, 0);
      onComplete(selectedSin, totalXp);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.box, borderColor: config.color, color: config.color }}>
        <h1 style={{fontSize: '24px', margin: 0}}>⚠️ {config.label} ⚠️</h1>
        <p style={{color: '#fff', fontSize: '14px'}}>{config.questDescription}</p>

        <div style={styles.timer}>{formatTime(timeLeft)}</div>

        <div style={{color: '#fff'}}>
          {config.tasks.map(task => (
            <div 
              key={task.id} 
              style={{ ...styles.taskItem, backgroundColor: completedTasks[task.id] ? '#111' : 'transparent', borderColor: completedTasks[task.id] ? config.color : '#333' }}
              onClick={() => toggleTask(task.id)}
            >
              <span style={{marginRight: '10px'}}>[{completedTasks[task.id] ? 'X' : ' '}]</span>
              <span>{task.text} (+{task.xp} XP)</span>
            </div>
          ))}
        </div>

        <button style={{...styles.button, borderColor: config.color, color: config.color}} onClick={handleFinish}>
          CONFIRM TRANSMUTATION
        </button>
        <button style={{...styles.button, borderColor: '#555', color: '#555', marginTop: '10px'}} onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default SinTransmutation;
