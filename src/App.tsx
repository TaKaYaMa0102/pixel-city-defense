import React, { useState, useEffect } from 'react';
import { GameEngine } from './GameEngine';
import { GameUI } from './UI';
import { BUILDING_TYPES } from './Building';
import './styles.css';

const App: React.FC = () => {
  const [gameEngine] = useState(() => new GameEngine());
  const [, setGameState] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState<string>('house');

  useEffect(() => {
    const gameLoop = setInterval(() => {
      gameEngine.update();
      setGameState(gameEngine.getGameState());
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameEngine]);

  const handleCellClick = (x: number, y: number) => {
    gameEngine.buildBuilding(x, y, selectedBuilding);
    setGameState({});
  };

  const MAP_SIZE = 20;
  const CELL_SIZE = 30;

  return (
    <div className="app">
      <h1>🏰 Pixel City Defense</h1>
      
      <GameUI gameEngine={gameEngine} />

      {/* Выбор здания */}
      <div className="building-selector">
        <h3>Выберите здание для строительства:</h3>
        <div className="building-buttons">
          {Object.entries(BUILDING_TYPES).map(([key, building]) => (
            <button
              key={key}
              onClick={() => setSelectedBuilding(key)}
              className={selectedBuilding === key ? 'selected' : ''}
              title={`${building.name} - Дерево: ${building.cost.wood}, Камень: ${building.cost.stone}`}>
              {building.icon} {building.name}
            </button>
          ))}
        </div>
      </div>

      {/* Карта */}
      <div className="game-map" style={{ width: MAP_SIZE * CELL_SIZE, height: MAP_SIZE * CELL_SIZE }}>
        {Array.from({ length: MAP_SIZE }).map((_, y) =>
          Array.from({ length: MAP_SIZE }).map((_, x) => {
            const building = gameEngine.buildings.getBuildingAt(x, y);
            const buildingType = building ? BUILDING_TYPES[building.type] : null;

            return (
              <div
                key={`${x}-${y}`}
                className="map-cell"
                onClick={() => handleCellClick(x, y)}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              >
                {building && buildingType && <span>{buildingType.icon}</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;