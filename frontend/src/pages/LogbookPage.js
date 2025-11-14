// frontend/src/pages/LogbookPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

const clickSound = new Audio('/audio/click.mp3');

const logStyles = {
  container: {
    width: '95vw', // Full width
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column', // CRITICAL FIX: Forces vertical stacking
    gap: '20px',
  },
  formWindow: {
    flex: 1,
    // Add a border to separate the form from the logs on desktop
    borderBottom: '1px solid #333', 
    paddingBottom: '20px',
  },
  logWindow: {
    flex: 2,
  },
  textarea: {
    ...styles.input,
    height: '150px',
    resize: 'vertical',
    width: 'calc(100% - 24px)',
  },
  select: {
    ...styles.input,
    width: '100%',
  },
  logEntry: {
    ...styles.item,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '15px',
    gap: '5px',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  logDate: {
    ...styles.statLabel,
    fontSize: '14px',
  },
  logCategory: {
    ...styles.font,
    color: styles.title.color,
    fontWeight: 'bold',
  },
  logContent: {
    ...styles.font,
    fontSize: '16px',
    color: '#fff',
    paddingTop: '10px',
  }
};

function LogbookPage() {
  const [entries, setEntries] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Tech");
  const categories = ["Tech", "Workout", "Personal", "Mind"]; // Defined categories

  const fetchEntries = () => {
    axios.get('https://hunter-log.onrender.com/api/journal')
      .then(res => setEntries(res.data))
      .catch(err => console.error("Error fetching journal entries:", err));
  };

  useEffect(fetchEntries, []);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!newContent.trim() || !newCategory.trim()) return;

    clickSound.currentTime = 0;
    clickSound.play();

    try {
      await axios.post('https://hunter-log.onrender.com/api/journal', {
        category: newCategory,
        content: newContent
      });
      setNewContent("");
      fetchEntries();
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  return (
    <div style={{width: '100%'}}> {/* Simple wrapper for the page content */}
      
      {/* --- INPUT FORM WINDOW --- */}
      <SystemWindow style={logStyles.formWindow}>
        <h2 style={styles.title}>New Log Entry</h2>
        <form onSubmit={handleSubmitLog} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={styles.statLabel}>Category</label>
            <select
              style={logStyles.select}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.statLabel}>What did you learn/achieve today?</label>
            <textarea
              style={logStyles.textarea}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <motion.button
            type="submit"
            style={styles.button}
            whileHover={{ scale: 1.05, backgroundColor: '#00bfff', color: '#000' }}
            whileTap={{ scale: 0.95 }}
          >
            Save to Log
          </motion.button>
        </form>
      </SystemWindow>

      {/* --- "THE SHEET" / LOG REVIEW WINDOW --- */}
      <SystemWindow style={{...logStyles.logWindow, marginTop: '20px'}}>
        <h2 style={styles.title}>Hunter's Log</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {entries.length === 0 ? (
            <p style={styles.statLabel}>No entries found. Log your first action!</p>
          ) : (
            entries.map(entry => (
              <motion.div 
                key={entry._id} 
                style={logStyles.logEntry}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div style={logStyles.logHeader}>
                  <span style={logStyles.logCategory}>{entry.category}</span>
                  <span style={logStyles.logDate}>
                    {new Date(entry.date).toLocaleString()}
                  </span>
                </div>
                <p style={logStyles.logContent}>{entry.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </SystemWindow>
    </div>
  );
}

export default LogbookPage;
