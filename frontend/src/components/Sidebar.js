// frontend/src/components/Sidebar.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- FIX APPLIED HERE

const SYSTEM_BLUE = '#00bfff';
const SYSTEM_FONT = "'Share Tech Mono', monospace";

const sidebarStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1500,
    },
    menu: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '250px',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderRight: `2px solid ${SYSTEM_BLUE}`,
        padding: '20px 0',
        zIndex: 1600,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SYSTEM_FONT,
    },
    title: {
        color: SYSTEM_BLUE,
        textAlign: 'center',
        padding: '10px 0 20px',
        fontSize: '20px',
    },
    navButton: {
        padding: '15px 20px',
        color: '#aaa',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '18px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    navButtonActive: {
        color: '#fff',
        backgroundColor: 'rgba(0, 187, 255, 0.2)',
        borderLeft: `5px solid ${SYSTEM_BLUE}`,
        paddingLeft: '15px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        color: SYSTEM_BLUE,
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
    }
};

function Sidebar({ activeWindow, setActiveWindow, isMenuOpen, setIsMenuOpen }) {
    
    const handleNavClick = (windowName) => {
        setActiveWindow(windowName);
        setIsMenuOpen(false); // Close menu on click
    };

    const windows = ['STATS', 'QUESTS', 'SKILLS', 'MAP', 'INVENTORY', 'BOSSES', 'LOGBOOK'];

    return (
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    key="overlay"
                    style={sidebarStyles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)} // Close menu when clicking outside
                >
                    <motion.nav
                        key="sidebar"
                        style={sidebarStyles.menu}
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <h2 style={sidebarStyles.title}>System Access</h2>
                        
                        <button style={sidebarStyles.closeButton} onClick={() => setIsMenuOpen(false)}>
                            &times;
                        </button>
                        
                        {windows.map(windowName => (
                            <button 
                                key={windowName}
                                style={{
                                    ...sidebarStyles.navButton,
                                    ...(activeWindow === windowName ? sidebarStyles.navButtonActive : {})
                                }}
                                onClick={() => handleNavClick(windowName)}
                            >
                                {windowName}
                            </button>
                        ))}
                    </motion.nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Sidebar;
