// frontend/src/pages/LogbookPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

// --- AUDIO LOGIC ---
const clickSound = new Audio('/audio/click.mp3');
// ---

const logStyles = {
  container: {
    width: '90vw',
    maxWidth: '1000px',
    display: 'flex',
    gap: '20px',
  },
  formWindow: {
    flex: 1,
  },
  logWindow: {
    flex: 2,
  },
  textarea: {
    ...styles.input,
    height: '150px',
    resize: 'vertical',
    width: 'calc(100% - 24px)', // Account for padding
  },
  select: {
    ...styles.input,
    width: '100%',
  },
  logEntry: {
    ...styles.item,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    color: styles.title.color, // System Blue
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
  const [newCategory, setNewCategory] = useState("Tech"); // Default category

  // Fetch all entries when the page loads
  const fetchEntries = () => {
    axios.get('http://127.0.0.1:8000/api/journal')
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
      await axios.post('http://127.0.0.1:8000/api/journal', {
        category: newCategory,
        content: newContent
      });
      setNewContent(""); // Clear input
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  return (
    <div style={logStyles.container}>
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
              <option value="Tech">Tech</option>
              <option value="Workout">Workout</option>
              <option value="Personal">Personal</option>
              <option value="Mind">Mind</option>
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
      <SystemWindow style={logStyles.logWindow}>
        <h2 style={styles.title}>Hunter's Log</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {entries.length === 0 ? (
            <p style={styles.statLabel}>No entries found.</p>
          ) : (
            entries.map(entry => (
              <motion.div 
                key={entry.id} 
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