// frontend/src/components/Skills.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SystemWindow from './SystemWindow';
import { styles } from './styles';
import { motion } from 'framer-motion'; // <-- FIX 1: 'from' was missing

const clickSound = new Audio('/audio/click.mp3');

function Skills() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");

  const fetchSkills = () => {
    axios.get('http://127.0.0.1:8000/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error("Error fetching skills:", err));
  };

  useEffect(fetchSkills, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    clickSound.currentTime = 0;
    clickSound.play();

    try {
      await axios.post('http://127.0.0.1:8000/api/skills', { name: newSkillName });
      setNewSkillName("");
      fetchSkills();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  return (
    <SystemWindow>
      <h2 style={styles.title}>[ Skill Log ]</h2>
      <form onSubmit={handleAddSkill} style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <input 
          type="text"
          placeholder="Log a new skill..."
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          style={styles.input}
        />
        <motion.button 
          type="submit" 
          style={styles.button}
          whileHover={{ scale: 1.1, backgroundColor: '#00bfff', color: '#000' }}
          whileTap={{ scale: 0.9 }}
        >
          {/* --- FIX: Brackets removed --- */}
          Log
        </motion.button>
      </form> {/* <-- FIX 2: Was '</Form>' with a capital 'F' */}
    </SystemWindow>
  );
}

export default Skills;