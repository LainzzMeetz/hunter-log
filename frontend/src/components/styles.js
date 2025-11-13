// frontend/src/components/styles.js

const SYSTEM_BLUE = '#00bfff'; // The core "glow" color
const SYSTEM_BLUE_DIM = '#00bfff55'; // A dimmer, 33% opacity blue
const SYSTEM_BLUE_BG = 'rgba(0, 187, 255, 0.1)'; // 10% opacity blue for backgrounds
const SYSTEM_BLUE_BG_HOVER = 'rgba(0, 187, 255, 0.2)'; // 20% opacity on hover

export const styles = {
  // Use the new "System" font everywhere
  font: {
    fontFamily: "'Share Tech Mono', monospace",
  },
  
  // Window Titles
  title: {
    fontFamily: "'Share Tech Mono', monospace",
    color: SYSTEM_BLUE,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontSize: '20px',
    borderBottom: `1px solid ${SYSTEM_BLUE_DIM}`,
    paddingBottom: '10px',
    marginTop: '0px',
    // --- GLOW EFFECT ---
    textShadow: `0 0 10px ${SYSTEM_BLUE}`,
  },
  subtitle: {
    fontFamily: "'Share Tech Mono', monospace",
    color: '#e0e0e0',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
    fontSize: '18px',
    marginTop: '20px',
  },

  // Player Stats
  statRow: {
    fontFamily: "'Share Tech Mono', monospace",
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    padding: '8px 0',
  },
  statLabel: {
    color: '#aaa', // Dim the label
  },
  statValue: {
    color: '#fff', // Make the value bright white
    fontWeight: 'bold',
  },
  expBar: {
    width: '100%',
    height: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark, transparent bar
    border: `1px solid ${SYSTEM_BLUE_DIM}`,
    borderRadius: '5px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  expProgress: {
    height: '100%',
    backgroundColor: SYSTEM_BLUE, // Use the system blue
    boxShadow: `0 0 10px ${SYSTEM_BLUE}`, // Make the bar glow
  },

  // Quest & Skill Items
  item: {
    fontFamily: "'Share Tech Mono', monospace",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: `1px solid ${SYSTEM_BLUE_DIM}`, // Dim blue border
    margin: '10px 0',
    backgroundColor: SYSTEM_BLUE_BG, // --- HOLOGRAPHIC BG ---
    borderRadius: '5px',
    color: '#e0e0e0',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  itemCompleted: {
    backgroundColor: 'rgba(0, 50, 0, 0.5)', // Dark, transparent green
    borderColor: '#2a5a2a',
    color: '#888',
    textDecoration: 'line-through',
  },

  // Buttons
  button: {
    fontFamily: "'Share Tech Mono', monospace",
    padding: '10px 15px',
    fontSize: '14px',
    backgroundColor: SYSTEM_BLUE_BG, // --- HOLOGRAPHIC BG ---
    color: SYSTEM_BLUE,
    border: `1px solid ${SYSTEM_BLUE}`,
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    // --- GLOW EFFECT ---
    textShadow: `0 0 5px ${SYSTEM_BLUE}`,
  },
  
  // Skill Input
  input: {
    fontFamily: "'Share Tech Mono', monospace",
    width: 'calc(100% - 22px)',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark, transparent input
    border: `1px solid ${SYSTEM_BLUE_DIM}`,
    borderRadius: '5px',
    color: '#e0e0e0',
    fontSize: '16px',
  },
};