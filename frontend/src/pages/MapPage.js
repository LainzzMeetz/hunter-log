// frontend/src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

const clickSound = new Audio('/audio/click.mp3');

const mapStyles = {
    container: {
        width: '95vw',
        maxWidth: '700px',
    },
    chapterItem: {
        ...styles.item,
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        border: `1px solid ${styles.title.color}44`,
        backgroundColor: styles.item.backgroundColor,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    chapterTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: styles.title.color,
    },
    statusText: {
        fontSize: '16px',
        color: '#ff4444',
        fontWeight: 'bold',
    },
    button: {
        ...styles.button,
        fontSize: '14px',
        padding: '5px 10px',
    },
    input: {
        ...styles.input,
        width: 'calc(100% - 100px)',
        marginBottom: '10px'
    }
};

function MapPage() {
    const [chapters, setChapters] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    
    const fetchChapters = () => {
        axios.get('https://hunter-log.onrender.com/api/map')
            .then(res => setChapters(res.data))
            .catch(err => console.error("Error fetching map chapters:", err));
    };

    useEffect(fetchChapters, []);
    
    // --- NEW: Add Chapter Logic ---
    const handleAddChapter = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        clickSound.play();

        try {
            await axios.post('https://hunter-log.onrender.com/api/map', {
                title: newTitle,
                description: newDesc || 'A new goal has been set.'
            });
            setNewTitle('');
            setNewDesc('');
            fetchChapters();
        } catch (error) {
            console.error("Error adding chapter:", error);
        }
    };
    
    const handleSetStatus = async (chapterId, newStatus) => {
        clickSound.play();
        if (!window.confirm(`Set Chapter to ${newStatus.toUpperCase()}?`)) return;

        try {
            await axios.put(`https://hunter-log.onrender.com/api/map/${chapterId}/status`, { status: newStatus });
            fetchChapters();
        } catch (error) {
            console.error("Error setting chapter status:", error);
        }
    };

    return (
        <SystemWindow>
            <h2 style={styles.title}>[ System Roadmap ]</h2>
            <div style={mapStyles.container}>
                
                {/* --- ADD NEW CHAPTER FORM --- */}
                <form onSubmit={handleAddChapter} style={{marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px'}}>
                    <h3 style={styles.subtitle}>Define New Chapter</h3>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                        <input 
                            type="text"
                            style={{...mapStyles.input, flexGrow: 1}}
                            placeholder="Chapter Title (e.g., 'Financial Growth')"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <motion.button type="submit" style={{...styles.button, width: '150px'}} whileHover={{scale: 1.05}}>
                            ADD CHAPTER
                        </motion.button>
                    </div>
                    <textarea 
                        style={{...styles.input, width: 'calc(100% - 22px)', height: '50px'}}
                        placeholder="Description (e.g., 'Achieve stable income and 3 months emergency fund.')"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />
                </form>

                {/* --- CHAPTER LIST --- */}
                {chapters.map(chapter => (
                    <motion.div 
                        key={chapter._id} 
                        style={{
                            ...mapStyles.chapterItem,
                            opacity: chapter.status === 'locked' ? 0.6 : 1,
                            borderColor: chapter.status === 'active' ? styles.title.color : styles.item.borderColor,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: chapter.chapter * 0.1 }}
                    >
                        <div style={mapStyles.header}>
                            <span style={mapStyles.chapterTitle}>
                                CHAPTER {chapter.chapter}: {chapter.title.toUpperCase()}
                            </span>
                            <span style={{
                                ...mapStyles.statusText,
                                color: chapter.status === 'active' ? '#00bfff' : chapter.status === 'completed' ? '#00ff7f' : '#aaa'
                            }}>
                                {chapter.status.toUpperCase()}
                            </span>
                        </div>
                        <p style={{fontSize: '16px', color: '#aaa', margin: '10px 0'}}>{chapter.description}</p>
                        
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            {chapter.status !== 'active' && chapter.status !== 'completed' && (
                                <motion.button
                                    style={styles.button}
                                    onClick={() => handleSetStatus(chapter._id, 'active')}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    SET ACTIVE
                                </motion.button>
                            )}
                            {chapter.status === 'active' && (
                                <motion.button
                                    style={{...styles.button, backgroundColor: '#00ff7f', color: '#000', textShadow: 'none'}}
                                    onClick={() => handleSetStatus(chapter._id, 'completed')}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    MARK COMPLETE
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </SystemWindow>
    );
}


export default MapPage;
