const generateMaze = (width, height) => {
  // Initialize the grid with walls
  const maze = Array(height).fill().map(() => Array(width).fill(1));
  
  // Set start point
  const start = [1, 1];
  maze[start[0]][start[1]] = 0;
  
  // Randomly select exit position (along the edges, but not in corners)
  let end;
  const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  
  switch(side) {
    case 0: // top
      end = [1, Math.floor(Math.random() * (width - 4)) + 2];
      break;
    case 1: // right
      end = [Math.floor(Math.random() * (height - 4)) + 2, width - 2];
      break;
    case 2: // bottom
      end = [height - 2, Math.floor(Math.random() * (width - 4)) + 2];
      break;
    default: // left
      end = [Math.floor(Math.random() * (height - 4)) + 2, 1];
      break;
  }
  
  maze[end[0]][end[1]] = 0; // Set exit point
  
  // Recursive function to carve paths
  const carve = (x, y) => {
    const directions = [
      [0, 2], [2, 0], [0, -2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (
        newX > 0 && newX < width - 1 && 
        newY > 0 && newY < height - 1 && 
        maze[newY][newX] === 1
      ) {
        maze[newY][newX] = 0;
        maze[y + dy/2][x + dx/2] = 0;
        carve(newX, newY);
      }
    }
  };

  // Start carving from the beginning
  carve(1, 1);

  // Create a path to ensure end is reachable
  const pathToEnd = findPathToEnd(start, end, width, height);
  pathToEnd.forEach(([y, x]) => {
    maze[y][x] = 0;
  });

  return {
    grid: maze,
    start: start,
    end: end
  };
};

// Helper function to find a path to the end
const findPathToEnd = (start, end, width, height) => {
  const path = [];
  let current = [...start];
  
  while (current[0] !== end[0] || current[1] !== end[1]) {
    path.push([...current]);
    
    // Move towards end point
    if (current[0] < end[0]) current[0]++;
    else if (current[0] > end[0]) current[0]--;
    
    if (current[1] < end[1]) current[1]++;
    else if (current[1] > end[1]) current[1]--;
  }
  
  path.push(end);
  return path;
};

export default generateMaze; 