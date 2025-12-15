// frontend/src/components/DailyQuests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';
import Timer from './Timer';
import { playSound } from '../App';

function DailyQuests({ player, setPlayer, quests: initialQuests }) {
  const [quests, setQuests] = useState(initialQuests || []);

  useEffect(() => {
    setQuests(initialQuests || []);
  }, [initialQuests]);

  const handleToggleSubtask = async (questId, subTaskTitle) => {
    playSound('click');
    try {
      const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/subtask/${subTaskTitle}`);
      setPlayer(res.data);
    } catch (error) { console.error(error); }
  };

  const handleCompleteQuest = async (questId) => {
    playSound('complete');
    try {
      const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/complete`);
      setPlayer(res.data);
    } catch (error) { console.error(error); }
  };

  const handleNewDay = async () => {
    if (!window.confirm("Start a New Day? (Resets checkmarks)")) return;
    playSound('click');
    try {
      await axios.post('https://hunter-log.onrender.com/api/dailies/new-day');
      window.location.reload(); 
    } catch (error) { console.error(error); }
  };

  // Helper to format the track name for display
  const formatTrackName = (track) => {
    if(!track) return "GENERAL";
    if(track === 'software_dev_skill') return "SOFTWARE DEV";
    if(track === 'ai_ml_skill') return "AI / ML";
    if(track === 'embedded_skill') return "EMBEDDED";
    if(track === 'quantum_computing') return "QUANTUM";
    return track.toUpperCase();
  };

  const SubTaskChecklist = ({ quest }) => (
    <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
      {quest.sub_tasks.map(task => (
        <div 
          key={task.title} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '5px' }}
          onClick={() => handleToggleSubtask(quest._id, task.title)}
        >
          <div style={{
            width: '16px', height: '16px', border: '1px solid #555',
            backgroundColor: task.completed ? '#00ff7f' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {task.completed && <div style={{width:'8px', height:'8px', backgroundColor:'#000'}} />}
          </div>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace', fontSize: '14px',
            color: task.completed ? '#666' : '#ccc',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{backgroundColor: 'rgba(20,20,20,0.5)', padding:'15px', border:'1px solid #333', borderRadius:'5px'}}>
      
      {quests.map(quest => {
        // DYNAMIC TITLE LOGIC:
        let displayTitle = quest.title;
        if (quest.stat_reward === 'study' && player) {
             displayTitle = `[ STUDY: ${formatTrackName(player.active_skill_track)} ]`;
        }

        return (
          <motion.div 
            key={quest._id} 
            style={{
              padding: '15px', borderBottom: '1px solid #333', marginBottom: '10px',
              backgroundColor: quest.completed ? 'rgba(0, 255, 127, 0.05)' : 'transparent'
            }}
            layout
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={{color: quest.completed ? '#00ff7f' : '#fff', fontWeight:'bold'}}>
                {displayTitle}
              </span>
              <span style={{fontSize: '12px', color: '#888'}}>
                {quest.exp_grant} EXP
              </span>
            </div>
            
            <div style={{fontSize:'12px', color:'#666', marginBottom:'10px'}}>{quest.description}</div>

            {/* Checklist or Timer or Button */}
            {quest.sub_tasks.length > 0 && <SubTaskChecklist quest={quest} />}
            
            {quest.duration_minutes > 0 && !quest.completed && (
              <div style={{marginTop: '10px'}}>
                <Timer quest={quest} onComplete={handleCompleteQuest} />
              </div>
            )}
            
            {quest.duration_minutes === 0 && quest.sub_tasks.length === 0 && !quest.completed && (
               <motion.button
                 style={{marginTop: '10px', backgroundColor: '#00bfff', color: '#000', border:'none', padding:'5px 15px', fontWeight:'bold', cursor:'pointer'}}
                 onClick={() => handleCompleteQuest(quest._id)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 MARK COMPLETE
               </motion.button>
            )}

            {quest.completed && <div style={{ marginTop: '5px', color: '#00ff7f', fontSize: '12px' }}>[ COMPLETED ]</div>}
          </motion.div>
        );
      })}

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <button 
          onClick={handleNewDay}
          style={{background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '10px 20px', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace'}}
        >
          [ START NEW DAY ]
        </button>
      </div>
    </div>
  );
}

export default DailyQuests;
