// frontend/src/components/DailyQuests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Timer from './Timer';
import { playSound } from '../App';

function DailyQuests({ player, setPlayer, quests: initialQuests }) {
  const [quests, setQuests] = useState(initialQuests || []);
  const [studyPoints, setStudyPoints] = useState(1); // Default log amount

  useEffect(() => {
    setQuests(initialQuests || []);
  }, [initialQuests]);

  const handleToggleSubtask = async (questId, subTaskTitle) => {
    playSound('click');
    const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/subtask/${subTaskTitle}`);
    setPlayer(res.data);
  };

  const handleCompleteQuest = async (questId) => {
    playSound('complete');
    const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/complete`);
    setPlayer(res.data);
  };

  const handleLogStudy = async (questId) => {
    try {
      playSound('complete');
      const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/complete`, {
        points: parseInt(studyPoints)
      });
      setPlayer(res.data);
      // We don't hide the quest, it stays available
      alert(`LOGGED ${studyPoints} PTS FOR ${formatTrackName(player.active_skill_track)}`);
    } catch (error) {
      alert(error.response?.data?.detail || "Error logging points");
    }
  };

  const handleNewDay = async () => {
    if (!window.confirm("Start a New Day? (Resets checkmarks)")) return;
    playSound('click');
    await axios.post('https://hunter-log.onrender.com/api/dailies/new-day');
    window.location.reload(); 
  };

  const formatTrackName = (track) => {
    if(!track) return "GENERAL";
    if(track === 'software_dev_skill') return "SOFTWARE DEV";
    if(track === 'ai_ml_skill') return "AI / ML";
    if(track === 'embedded_skill') return "EMBEDDED";
    if(track === 'quantum_computing') return "QUANTUM";
    return track.toUpperCase();
  };

  return (
    <div style={{backgroundColor: 'rgba(20,20,20,0.5)', padding:'15px', border:'1px solid #333', borderRadius:'5px'}}>
      
      {quests.map(quest => {
        // --- SPECIAL RENDER FOR STUDY QUEST ---
        if (quest.title === 'Study') {
          return (
            <motion.div key={quest._id} style={{padding: '15px', borderBottom: '1px solid #333', marginBottom: '10px'}} layout>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{color: '#00bfff', fontWeight:'bold'}}>
                  [ STUDY: {player ? formatTrackName(player.active_skill_track) : '...'} ]
                </span>
                <span style={{fontSize: '12px', color: '#888'}}>
                  TODAY: {player?.daily_study_points || 0} / 10 PTS
                </span>
              </div>
              
              <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <input 
                  type="number" min="1" max="5" 
                  value={studyPoints} 
                  onChange={(e) => setStudyPoints(e.target.value)}
                  style={{width:'50px', backgroundColor:'#222', border:'1px solid #555', color:'#fff', padding:'5px', fontFamily:'"Share Tech Mono"'}}
                />
                <button 
                   onClick={() => handleLogStudy(quest._id)}
                   style={{flex:1, backgroundColor: '#00bfff', color: '#000', border:'none', padding:'5px', fontWeight:'bold', cursor:'pointer'}}
                >
                  LOG SESSION (+{studyPoints * 15} EXP)
                </button>
              </div>
            </motion.div>
          );
        }

        // --- STANDARD QUEST RENDER ---
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
                {quest.title}
              </span>
              <span style={{fontSize: '12px', color: '#888'}}>
                {quest.exp_grant} EXP
              </span>
            </div>
            
            <div style={{fontSize:'12px', color:'#666', marginBottom:'10px'}}>{quest.description}</div>

            {quest.sub_tasks.length > 0 && (
               <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {quest.sub_tasks.map(task => (
                  <div key={task.title} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '5px' }}
                    onClick={() => handleToggleSubtask(quest._id, task.title)}>
                    <div style={{width: '16px', height: '16px', border: '1px solid #555', backgroundColor: task.completed ? '#00ff7f' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {task.completed && <div style={{width:'8px', height:'8px', backgroundColor:'#000'}} />}
                    </div>
                    <span style={{fontFamily: '"Share Tech Mono"', fontSize: '14px', color: task.completed ? '#666' : '#ccc', textDecoration: task.completed ? 'line-through' : 'none'}}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {quest.duration_minutes > 0 && !quest.completed && (
              <div style={{marginTop: '10px'}}>
                <Timer quest={quest} onComplete={handleCompleteQuest} />
              </div>
            )}
            
            {quest.duration_minutes === 0 && quest.sub_tasks.length === 0 && !quest.completed && (
               <button
                 style={{marginTop: '10px', backgroundColor: '#00bfff', color: '#000', border:'none', padding:'5px 15px', fontWeight:'bold', cursor:'pointer'}}
                 onClick={() => handleCompleteQuest(quest._id)}
               >
                 MARK COMPLETE
               </button>
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
