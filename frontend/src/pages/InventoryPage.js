// frontend/src/pages/InventoryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SystemWindow from '../components/SystemWindow';
import { styles } from '../components/styles';

const clickSound = new Audio('/audio/click.mp3');

const inventoryStyles = {
    input: {
        ...styles.input,
        width: 'calc(100% - 22px)',
        marginBottom: '10px'
    }
};

function InventoryPage() {
    const [items, setItems] = useState([]);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('equipment');
    const [newDesc, setNewDesc] = useState('');

    const fetchItems = () => {
        axios.get('https://hunter-log.onrender.com/api/inventory')
            .then(res => setItems(res.data))
            .catch(err => console.error("Error fetching inventory:", err));
    };

    useEffect(fetchItems, []);

    // --- NEW: Add Item Logic ---
    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        clickSound.play();

        try {
            await axios.post('https://hunter-log.onrender.com/api/inventory', {
                name: newName,
                type: newType,
                description: newDesc
            });
            setNewName('');
            setNewDesc('');
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };
    
    const filterItems = (type) => items.filter(item => item.type === type);

    const renderItemBlock = (title, type) => (
        <div style={{marginBottom: '20px', width: '300px'}}>
            <h3 style={styles.subtitle}>{title}</h3>
            {filterItems(type).length === 0 ? (
                <p style={styles.statLabel}>No {title} logged.</p>
            ) : (
                filterItems(type).map(item => (
                    <motion.div key={item._id} style={{...styles.item, padding: '10px', backgroundColor: '#2a2a2a'}} initial={{opacity:0}} animate={{opacity:1}}>
                        {item.name}
                    </motion.div>
                ))
            )}
        </div>
    );

    return (
        <SystemWindow>
            <h2 style={styles.title}>[ Inventory (Resources) ]</h2>
            
            {/* --- ADD ITEM FORM --- */}
            <form onSubmit={handleAddItem} style={{marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px'}}>
                <h3 style={styles.subtitle}>Acquire New Item/Tool</h3>
                <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <input 
                        type="text"
                        style={{...inventoryStyles.input, flexGrow: 1}}
                        placeholder="Item Name (e.g., 'Journal')"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <select style={{...inventoryStyles.input, width: '150px'}} value={newType} onChange={(e) => setNewType(e.target.value)}>
                        <option value="equipment">Equipment</option>
                        <option value="consumable">Consumables</option>
                        <option value="special">Special Items</option>
                    </select>
                    <motion.button type="submit" style={{...styles.button, width: '150px'}} whileHover={{scale: 1.05}}>
                        ACQUIRE
                    </motion.button>
                </div>
                <textarea 
                    style={{...styles.input, width: 'calc(100% - 22px)', height: '30px'}}
                    placeholder="Description (e.g., 'Used for daily reflection.')"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                />
            </form>

            <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
                {renderItemBlock("Equipment", "equipment")}
                {renderItemBlock("Special Items", "special")}
                {renderItemBlock("Consumables", "consumable")}
            </div>
        </SystemWindow>
    );
}

export default InventoryPage;