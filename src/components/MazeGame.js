import React, { useState, useEffect, useCallback } from 'react';
import generateMaze from '../utils/mazeGenerator';
import findShortestPath from '../utils/pathFinder';
import '../styles/MazeGame.css';

const MazeGame = () => {
  const [maze, setMaze] = useState(null);
  const [playerPos, setPlayerPos] = useState(null);
  const [steps, setSteps] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem('mazeBestScore')) || 0
  );
  const [showPath, setShowPath] = useState(false);
  const [shortestPath, setShortestPath] = useState([]);

  const initGame = useCallback(() => {
    try {
      const newMaze = generateMaze(15, 15);
      setMaze(newMaze);
      setPlayerPos([...newMaze.start]);
      setSteps(0);
      setShowPath(false);
      setShortestPath([]);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleKeyDown = useCallback((e) => {
    if (!maze || !playerPos) return;

    const moves = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };

    const move = moves[e.key];
    if (!move) return;

    const [dy, dx] = move;
    const newY = playerPos[0] + dy;
    const newX = playerPos[1] + dx;

    if (
      newY >= 0 && 
      newY < maze.grid.length && 
      newX >= 0 && 
      newX < maze.grid[0].length && 
      maze.grid[newY][newX] === 0
    ) {
      setPlayerPos([newY, newX]);
      setSteps(prev => prev + 1);
    }
  }, [maze, playerPos]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!maze || !playerPos) return;
    
    if (playerPos[0] === maze.end[0] && playerPos[1] === maze.end[1]) {
      if (!bestScore || steps < bestScore) {
        localStorage.setItem('mazeBestScore', steps.toString());
        setBestScore(steps);
      }
      alert(`Congratulations! You completed the maze in ${steps} steps!`);
      initGame();
    }
  }, [playerPos, maze, steps, bestScore, initGame]);

  const handleShowPath = useCallback(() => {
    if (!maze) return;
    if (showPath) {
      // If path is showing, hide it
      setShowPath(false);
    } else {
      // If path is hidden, calculate and show it
      const path = findShortestPath(maze);
      setShortestPath(path);
      setShowPath(true);
    }
  }, [maze, showPath]);

  if (!maze || !playerPos) return <div>Loading...</div>;

  return (
    <div className="maze-container">
      <div className="maze-info">
        <p>Steps: {steps}</p>
        <p>Best Score: {bestScore}</p>
        <div className="button-group">
          <button onClick={initGame}>New Game</button>
          <button onClick={handleShowPath}>
            {showPath ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>
      </div>
      <div className="maze-grid">
        {maze.grid.map((row, i) => (
          <div key={i} className="maze-row">
            {row.map((cell, j) => {
              const isOnPath = showPath && shortestPath.some(
                ([y, x]) => y === i && x === j
              );
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`maze-cell ${
                    cell === 1 ? 'wall' : 'path'
                  } ${
                    i === playerPos[0] && j === playerPos[1] ? 'player' : ''
                  } ${
                    i === maze.end[0] && j === maze.end[1] ? 'end' : ''
                  } ${
                    i === maze.start[0] && j === maze.start[1] ? 'start' : ''
                  } ${
                    isOnPath ? 'solution-path' : ''
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MazeGame; 