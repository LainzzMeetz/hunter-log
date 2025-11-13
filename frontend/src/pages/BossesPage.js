// frontend/src/pages/BossesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

const clickSound = new Audio('/audio/click.mp3');

const bossStyles = {
    container: {
        width: '700px',
    },
    bossItem: {
        ...styles.item,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#2a2a2a',
    },
    bossName: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ff4444',
    },
    defeatedText: {
        fontSize: '18px',
        color: '#00ff7f',
        fontWeight: 'bold',
    }
};

function BossesPage() {
    const [bosses, setBosses] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    
    const fetchBosses = () => {
        axios.get('http://127.0.0.1:8000/api/bosses')
            .then(res => setBosses(res.data))
            .catch(err => console.error("Error fetching bosses:", err));
    };

    useEffect(fetchBosses, []);
    
    // --- NEW: Add Boss Logic ---
    const handleAddBoss = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        clickSound.play();

        try {
            await axios.post('http://127.0.0.1:8000/api/bosses', {
                name: newName,
                description: newDesc || 'A new challenge has appeared.'
            });
            setNewName('');
            setNewDesc('');
            fetchBosses();
        } catch (error) {
            console.error("Error adding boss:", error);
        }
    };
    
    const handleDefeat = async (bossId) => {
        clickSound.play();
        if (!window.confirm("CONFIRM DEFEAT: Are you sure you have defeated this Boss?")) return;

        try {
            await axios.put(`http://127.0.0.1:8000/api/bosses/${bossId}/defeat`);
            fetchBosses();
        } catch (error) {
            console.error("Error defeating boss:", error);
        }
    };

    return (
        <SystemWindow>
            <h2 style={styles.title}>[ Boss Battles ]</h2>
            <div style={bossStyles.container}>
                
                {/* --- ADD BOSS FORM --- */}
                <form onSubmit={handleAddBoss} style={{marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px'}}>
                    <h3 style={styles.subtitle}>Define New Boss</h3>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <input 
                            type="text"
                            style={{...styles.input, flexGrow: 1}}
                            placeholder="Boss Name (e.g., 'Overthinking Boss')"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <motion.button type="submit" style={{...styles.button, width: '150px'}} whileHover={{scale: 1.05}}>
                            ADD BOSS
                        </motion.button>
                    </div>
                    <textarea 
                        style={{...styles.input, width: 'calc(100% - 22px)', height: '30px'}}
                        placeholder="Description (e.g., 'Weak to Clarity and Focus stats.')"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />
                </form>

                {/* --- BOSS LIST --- */}
                {bosses.map(boss => (
                    <motion.div 
                        key={boss._id} 
                        style={{
                            ...bossStyles.bossItem,
                            opacity: boss.defeated ? 0.5 : 1
                        }}
                        layout
                    >
                        <div style={{width: '60%'}}>
                            <span style={bossStyles.bossName}>{boss.name.toUpperCase()}</span>
                            <p style={{fontSize: '14px', color: '#aaa', margin: '5px 0'}}>{boss.description}</p>
                        </div>
                        
                        {boss.defeated ? (
                            <span style={bossStyles.defeatedText}>DEFEATED</span>
                        ) : (
                            <motion.button
                                style={styles.button}
                                onClick={() => handleDefeat(boss._id)}
                                whileHover={{ scale: 1.05, backgroundColor: '#ff4444', color: '#000', borderColor: '#ff4444' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                DEFEAT
                            </motion.button>
                        )}
                    </motion.div>
                ))}
            </div>
        </SystemWindow>
    );
}

export default BossesPage;