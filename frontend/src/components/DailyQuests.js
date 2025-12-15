// frontend/src/components/DailyQuests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';
import Timer from './Timer';

const playSound = (src) => {
  try {
    const sound = new Audio(src);
    sound.currentTime = 0;
    sound.play().catch(e => console.warn("Audio play failed:", e));
  } catch (e) {
    console.warn("Audio error", e);
  }
};

const formatTrackName = (track) => {
  switch (track) {
    case 'embedded_skill': return 'EMBEDDED';
    case 'ai_ml_skill': return 'AI/ML';
    case 'software_dev_skill': return 'SOFTWARE DEV';
    case 'quantum_computing': return 'QUANTUM';
    default: return track.toUpperCase();
  }
};

function DailyQuests({ player, setPlayer, quests: initialQuests }) {
  // Use local state for optimistic updates
  const [quests, setQuests] = useState(initialQuests || []);

  useEffect(() => {
    setQuests(initialQuests || []);
  }, [initialQuests]);

  const handleToggleSubtask = async (questId, subTaskTitle) => {
    playSound('/audio/click.mp3');
    try {
      const res = await axios.put(
        `https://hunter-log.onrender.com/api/quests/${questId}/subtask/${subTaskTitle}`
      );
      setPlayer(res.data);
    } catch (error) {
      console.error("Error toggling sub-task:", error);
    }
  };

  const handleCompleteQuest = async (questId) => {
    playSound('/audio/quest_complete.mp3');
    try {
      const res = await axios.put(
        `https://hunter-log.onrender.com/api/quests/${questId}/complete`
      );
      setPlayer(res.data);
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  const handleNewDay = async () => {
    if (!window.confirm("Start a New Day? This will reset your Daily Quests.")) return;
    playSound('/audio/click.mp3');
    try {
      await axios.post('https://hunter-log.onrender.com/api/dailies/new-day');
      window.location.reload(); 
    } catch (error) {
      console.error("Error starting new day:", error);
    }
  };

  const SubTaskChecklist = ({ quest }) => (
    <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
      {quest.sub_tasks.map(task => (
        <div 
          key={task.title} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '5px' }}
          onClick={() => handleToggleSubtask(quest._id, task.title)}
        >
          <input 
            type="checkbox" 
            checked={task.completed} 
            readOnly 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{
            ...styles.font,
            fontSize: '16px',
            color: task.completed ? '#888' : '#fff',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <SystemWindow>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{...styles.title, marginBottom: 0, borderBottom: 'none'}}>Daily Quests</h2>
        
        <motion.button
          style={{...styles.button, fontSize: '12px', padding: '5px 10px', backgroundColor: 'rgba(0, 255, 127, 0.1)', color: '#00ff7f', borderColor: '#00ff7f'}}
          whileHover={{ scale: 1.05, backgroundColor: '#00ff7f', color: '#000' }}
          onClick={handleNewDay}
        >
          [ START NEW DAY ]
        </motion.button>
      </div>

      <div>
        {quests.map(quest => (
          <motion.div 
            key={quest._id} 
            style={{...styles.item, 
              ...(quest.completed ? styles.itemCompleted : {}),
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
            layout
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>{quest.title}</span>
              
              {quest.stat_reward && (
                <span style={{...styles.font, color: styles.title.color}}>
                  +{quest.exp_grant} EXP | +{quest.stat_points} 
                  {quest.stat_reward === 'study' && player ? 
                    formatTrackName(player.active_skill_track) 
                    : 
                    quest.stat_reward.toUpperCase()
                  }
                </span>
              )}
            </div>

            {/* CASE 1: Checklist Quests (e.g., Morning Routine) */}
            {quest.sub_tasks.length > 0 && (
              <SubTaskChecklist quest={quest} />
            )}
            
            {/* CASE 2: Timer Quests (e.g., Workout) */}
            {quest.duration_minutes > 0 && !quest.completed && (
              <div style={{marginTop: '15px'}}>
                <Timer quest={quest} onComplete={handleCompleteQuest} />
              </div>
            )}
            
            {/* CASE 3 (NEW): Manual Completion (e.g., Study/Skill) */}
            {quest.duration_minutes === 0 && quest.sub_tasks.length === 0 && !quest.completed && (
               <motion.button
                 style={{...styles.button, marginTop: '15px', backgroundColor: styles.title.color, color: '#000', fontWeight: 'bold'}}
                 onClick={() => handleCompleteQuest(quest._id)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 MARK COMPLETE
               </motion.button>
            )}
            
            {quest.completed && quest.duration_minutes === 0 && quest.sub_tasks.length === 0 && (
               <div style={{ marginTop: '10px', color: '#00ff7f', fontWeight: 'bold' }}>
                   COMPLETED
               </div>
            )}
            
          </motion.div>
        ))}
      </div>
    </SystemWindow>
  );
}

export default DailyQuests;
