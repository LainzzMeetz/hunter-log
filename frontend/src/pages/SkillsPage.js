// frontend/src/pages/SkillsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { playSound } from '../App';

const theme = { primary: '#00bfff', font: '"Share Tech Mono", monospace', cardBg: 'rgba(10, 20, 30, 0.6)' };

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' },
  sectionTitle: { color: '#888', fontSize: '12px', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' },
  trackButton: { width: '100%', padding: '15px', marginBottom: '5px', backgroundColor: theme.cardBg, color: '#ccc', border: '1px solid #333', textAlign: 'left', cursor: 'pointer', fontFamily: theme.font },
  activeTrack: { borderColor: theme.primary, backgroundColor: 'rgba(0, 191, 255, 0.1)', color: '#fff' },
  skillCard: { padding: '10px', borderLeft: '2px solid #555', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: '5px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  input: { backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #555', color: '#fff', padding: '8px', width: '100%', marginBottom: '10px', fontFamily: theme.font },
  button: { backgroundColor: theme.primary, color: '#000', border: 'none', padding: '8px', fontWeight: 'bold', fontFamily: theme.font, cursor: 'pointer', width:'100%' }
};

const tracks = [
  { id: 'software_dev_skill', label: 'SOFTWARE DEV' },
  { id: 'ai_ml_skill', label: 'AI / ML' },
  { id: 'embedded_skill', label: 'EMBEDDED SYSTEMS' },
  { id: 'cybersecurity', label: 'CYBERSECURITY' },
];

const SkillsPage = ({ player, setPlayer }) => {
  const [skills, setSkills] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/skills').then(res => setSkills(res.data));
  }, []);

  const handleTrackChange = async (trackId) => {
    playSound('click');
    const res = await axios.put('https://hunter-log.onrender.com/api/player/set-track', { track: trackId });
    setPlayer(res.data);
  };

  const handleAddSkill = async () => {
    if (!newSkillName) return;
    try {
      playSound('complete');
      const res = await axios.post('https://hunter-log.onrender.com/api/skills', { name: newSkillName, tree: player.active_skill_track });
      setSkills([...skills, res.data]);
      setNewSkillName(""); setShowAdd(false);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={styles.container}>
      {/* 1. TRACK SELECTION */}
      <div>
        <div style={styles.sectionTitle}>CURRENT FOCUS</div>
        {tracks.map(track => (
          <button
            key={track.id}
            onClick={() => handleTrackChange(track.id)}
            style={{...styles.trackButton, ...(player?.active_skill_track === track.id ? styles.activeTrack : {})}}
          >
            {track.label} {player?.active_skill_track === track.id && "●"}
          </button>
        ))}
      </div>

      {/* 2. SKILLS LIST + ADD BUTTON */}
      <div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', ...styles.sectionTitle}}>
           <span>SKILL LOG</span>
           <button onClick={() => setShowAdd(!showAdd)} style={{background:'none', border:'none', color: theme.primary, cursor:'pointer', fontSize:'12px'}}>[+ LOG SKILL]</button>
        </div>

        {showAdd && (
          <div style={{marginBottom: '15px', padding:'10px', border:'1px dashed #555'}}>
            <input style={styles.input} placeholder="Skill Name (e.g. React Hooks)" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} />
            <button style={styles.button} onClick={handleAddSkill}>SAVE ENTRY</button>
          </div>
        )}

        {skills.map(skill => (
          <motion.div key={skill._id} initial={{opacity:0}} animate={{opacity:1}} style={styles.skillCard}>
            <span style={{color: '#fff', fontSize:'14px'}}>{skill.name}</span>
            <span style={{color: '#666', fontSize: '10px'}}>{skill.tree.split('_')[0].toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
