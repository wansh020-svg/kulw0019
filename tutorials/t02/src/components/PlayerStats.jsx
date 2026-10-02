import { useState } from 'react';

function PlayerStats() {
  const [stats, setStats] = useState({
    health: 100,
    gold: 0
  });
  const { health, gold } = stats;

  const takeDamage = () => {
    setStats({ ...stats, health: health - 20 });
  };

  const findLoot = () => {
    setStats({ ...stats, gold: gold + 10 });
  };

  return (
    <>
      <div className="diagnostic-card">
        <h2>Player Stats</h2>
        <p>Health: {health}</p>
        <p>Gold: {gold}</p>
        <button onClick={takeDamage}>Take Damage</button>
        <button onClick={findLoot}>Find Loot</button>
        {health <= 40 ? <p>Warning: Low Health!</p> : <p>Status: Healthy</p>}
      </div>
    </>
  );
}

export default PlayerStats;
