// frontend/src/components/MainQuests.js
import React from 'react'; // Removed useState, useEffect
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from './SystemWindow';
import { styles } from './styles';

const clickSound = new Audio('/audio/click.mp3');

// This is now a "dumb" component. It just receives props.
function MainQuests({ setPlayer, quests }) {
  
  const handleAchieve = async (questId) => {
      clickSound.play();
      if (!window.confirm("CONFIRM ACHIEVEMENT: Are you sure you completed this Main Quest? This will grant significant EXP.")) {
          return;
      }
      try {
          const res = await axios.put(`https://hunter-log.onrender.com/api/quests/${questId}/achieve`);
          // --- THIS IS THE FIX ---
          setPlayer(res.data);
      } catch (error) {
          console.error("Error achieving main quest:", error);
      }
  };

  return (
    <SystemWindow>
      <h2 style={styles.title}>[ Main Quests ]</h2>
      <div>
        {quests.length === 0 ? (
          <p style={styles.statLabel}>No Main Quests available. Time to set your Chapter goals!</p>
        ) : (
          quests.map(quest => (
            <motion.div 
              key={quest._id} 
              style={{...styles.item, ...(quest.completed ? styles.itemCompleted : {})}}
              layout
            >
              <div style={{width: '70%'}}>
                <div style={{fontWeight: 'bold'}}>{quest.title}</div>
                <div style={{fontSize: '14px', color: '#aaa'}}>{quest.description}</div>
              </div>
              {!quest.completed && (
                <motion.button
                    style={styles.button}
                    onClick={() => handleAchieve(quest._id)}
                    whileHover={{ scale: 1.05, backgroundColor: styles.title.color, color: '#000' }}
                    whileTap={{ scale: 0.95 }}
                >
                  ACHIEVE
                </motion.button>
              )}
              {quest.completed && (
                <span style={{color: '#00ff7f', fontWeight: 'bold', fontSize: '18px'}}>COMPLETE</span>
              )}
            </motion.div>
          ))
        )}
      </div>
    </SystemWindow>
  );
}

export default MainQuests;
