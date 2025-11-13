// frontend/src/pages/StatsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerStats from '../components/PlayerStats';

function StatsPage() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios.get('https://hunter-log.onrender.com/api/player')
      .then(res => setPlayer(res.data))
      .catch(err => console.error("Error fetching player data:", err));
  }, []);

  return (
    <div>
      <PlayerStats player={player} setPlayer={setPlayer} />
      {/* We can add your "Conditions" (Buffs/Debuffs) here later */}
    </div>
  );
}

export default StatsPage;