// frontend/src/pages/SkillsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

const clickSound = new Audio('/audio/click.mp3');

const treeStyles = {
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '20px',
    width: '90vw',
    maxWidth: '1400px',
  },
  treeColumn: {
    padding: '10px',
    border: `1px solid ${styles.title.color}33`,
    borderRadius: '8px',
  },
  treeTitle: {
    ...styles.subtitle,
    textAlign: 'center',
    marginTop: '5px',
  },
  skillItem: {
    ...styles.item,
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#2a2a2a'
  },
  activeButton: {
    ...styles.button,
    width: '100%',
    backgroundColor: styles.title.color,
    color: '#000',
    textShadow: 'none',
  },
  inputGroup: {
    padding: '15px 0',
    borderBottom: `1px solid ${styles.title.color}33`,
    marginBottom: '20px',
  },
  input: {
    ...styles.input,
    width: 'calc(100% - 22px)',
    marginBottom: '10px',
  }
};

const skillTrees = [
    { name: "Embedded", key: 'embedded_skill', db_key: 'embedded' },
    { name: "AI / ML", key: 'ai_ml_skill', db_key: 'ai_ml' },
    { name: "Software Dev", key: 'software_dev_skill', db_key: 'software_dev' },
    { name: "Quantum", key: 'quantum_computing', db_key: 'quantum' },
];

function SkillsPage({ player: playerProp, setPlayer }) {
  const [allSkills, setAllSkills] = useState([]);
  const [localPlayer, setLocalPlayer] = useState(playerProp);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillTree, setNewSkillTree] = useState('embedded'); // Default to embedded
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // Fetch Logic
  const fetchSkills = () => {
    axios.get('https://hunter-log.onrender.com/api/skills')
      .then(res => setAllSkills(res.data))
      .catch(err => console.error("Error fetching skills:", err));
  };

  useEffect(() => {
    // Sync player state and fetch skills
    if (!localPlayer || playerProp !== localPlayer) {
      axios.get('https://hunter-log.onrender.com/api/player')
        .then(res => setLocalPlayer(res.data))
        .catch(err => console.error("Error fetching player data:", err));
    }
    fetchSkills();
  }, [playerProp]);

  // Skill Adding Logic
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    clickSound.play();
    
    try {
      await axios.post('https://hunter-log.onrender.com/api/skills', {
        name: newSkillName,
        tree: newSkillTree, // Pass the tree
        description: newSkillDesc,
      });
      setNewSkillName('');
      setNewSkillDesc('');
      fetchSkills(); // Refresh the display
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };


  // Set Active Track Logic (Unchanged)
  const handleSetTrack = async (trackName) => {
    clickSound.play();
    try {
      const res = await axios.put('https://hunter-log.onrender.com/api/player/set-track', {
        track: trackName
      });
      setLocalPlayer(res.data);
      setPlayer(res.data); 
    } catch (error) {
      console.error("Error setting active track:", error);
    }
  };

  if (!localPlayer) return <div>Loading player data...</div>;

  // Filter logic remains the same
  const filterSkills = (db_key) => allSkills.filter(s => s.tree === db_key);

  return (
    <SystemWindow>
      <h2 style={styles.title}>[ Skill Tree Control ]</h2>
      
      {/* --- SKILL ADDITION FORM --- */}
      <div style={treeStyles.inputGroup}>
        <h3 style={styles.subtitle}>Log New Skill</h3>
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={styles.statLabel}>Skill Name</label>
            <input 
              style={treeStyles.input}
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., 'TensorFlow Lite for MCUs'"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.statLabel}>Skill Tree</label>
            <select style={treeStyles.input} value={newSkillTree} onChange={(e) => setNewSkillTree(e.target.value)}>
              <option value="embedded">Embedded</option>
              <option value="ai_ml">AI / ML</option>
              <option value="software_dev">Software Dev</option>
              <option value="quantum">Quantum</option>
            </select>
          </div>
          <motion.button 
            type="submit"
            style={{ ...styles.button, width: '150px', padding: '10px' }}
            whileHover={{ scale: 1.05 }}
          >
            Log Skill
          </motion.button>
        </form>
      </div>

      <p style={styles.statLabel}>
        Active Track: **{localPlayer.active_skill_track.toUpperCase()}** (Completing "Study" quest grants +1 to this stat.)
      </p>
      
      <div style={treeStyles.layout}>
        
        {/* Render the 4 trees */}
        {skillTrees.map(tree => (
            <div key={tree.key} style={treeStyles.treeColumn}>
              <h3 style={treeStyles.treeTitle}>{tree.name}</h3>
              {filterSkills(tree.db_key).map(skill => (
                <div key={skill._id} style={treeStyles.skillItem}>{skill.name}</div>
              ))}
              <motion.button
                style={localPlayer.active_skill_track === tree.key ? treeStyles.activeButton : styles.button}
                onClick={() => handleSetTrack(tree.key)}
                whileHover={{ scale: 1.05 }}
              >
                {localPlayer.active_skill_track === tree.key ? "ACTIVE" : "Set Active"}
              </motion.button>
            </div>
        ))}
        
      </div>
    </SystemWindow>
  );
}

export default SkillsPage;