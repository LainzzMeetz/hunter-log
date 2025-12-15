// frontend/src/pages/BossesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { playSound } from '../App';

const theme = { danger: '#ff4444', success: '#00ff7f', muted: '#555', font: '"Share Tech Mono", monospace' };

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '20px' },
  card: { backgroundColor: 'rgba(20, 0, 0, 0.6)', border: `1px solid ${theme.danger}`, padding: '15px', borderRadius: '4px', position: 'relative' },
  defeatedCard: { backgroundColor: 'rgba(20, 20, 20, 0.8)', border: `1px solid ${theme.muted}`, opacity: 0.6 },
  name: { color: theme.danger, fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' },
  desc: { color: '#aaa', fontSize: '14px', fontFamily: theme.font, marginBottom: '15px' },
  button: { backgroundColor: theme.danger, color: '#000', border: 'none', padding: '8px 12px', fontWeight: 'bold', fontFamily: theme.font, cursor: 'pointer', width: '100%', marginTop: '5px' },
  status: { color: theme.success, fontSize: '12px', fontWeight: 'bold' },
  input: { backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #555', color: '#fff', padding: '8px', width: '100%', marginBottom: '10px', fontFamily: theme.font, boxSizing: 'border-box' },
  addBox: { padding: '15px', border: '1px dashed #555', marginBottom: '15px', borderRadius: '5px' }
};

const BossesPage = () => {
  const [bosses, setBosses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/bosses').then(res => setBosses(res.data));
  }, []);

  const handleDefeat = async (bossId, bossName) => {
    if (!window.confirm(`Confirm defeat: ${bossName}?`)) return;
    try {
      playSound('complete');
      await axios.put(`https://hunter-log.onrender.com/api/bosses/${bossId}/defeat`);
      setBosses(prev => prev.map(b => b._id === bossId ? { ...b, defeated: true } : b));
    } catch (e) { console.error(e); }
  };

  const handleAddBoss = async () => {
    if (!newName) return;
    try {
      playSound('click');
      const res = await axios.post('https://hunter-log.onrender.com/api/bosses', { name: newName, description: newDesc });
      setBosses([...bosses, res.data]);
      setNewName(""); setNewDesc(""); setShowAdd(false);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={styles.container}>
      {/* ADD BOSS TOGGLE */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} style={{...styles.button, backgroundColor: 'transparent', border: '1px dashed #555', color: '#888'}}>+ ADD NEW BOSS</button>
      ) : (
        <div style={styles.addBox}>
          <input style={styles.input} placeholder="BOSS NAME (e.g. Technical Interview)" value={newName} onChange={e => setNewName(e.target.value)} />
          <input style={styles.input} placeholder="DESCRIPTION (e.g. LeetCode Hard)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <div style={{display:'flex', gap:'10px'}}>
            <button style={{...styles.button, flex:1}} onClick={handleAddBoss}>SAVE</button>
            <button style={{...styles.button, flex:1, backgroundColor:'#333', color:'#fff'}} onClick={() => setShowAdd(false)}>CANCEL</button>
          </div>
        </div>
      )}

      {bosses.map(boss => (
        <motion.div key={boss._id} initial={{opacity:0}} animate={{opacity:1}} style={{...styles.card, ...(boss.defeated ? styles.defeatedCard : {})}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{...styles.name, color: boss.defeated ? '#666' : theme.danger}}>{boss.name}</div>
            {boss.defeated && <span style={styles.status}>[CLEARED]</span>}
          </div>
          <div style={styles.desc}>{boss.description}</div>
          {!boss.defeated && <button style={styles.button} onClick={() => handleDefeat(boss._id, boss.name)}>CONFIRM DEFEAT</button>}
        </motion.div>
      ))}
    </div>
  );
};

export default BossesPage;
