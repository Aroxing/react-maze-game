const findShortestPath = (maze) => {
  const grid = maze.grid;
  const start = maze.start;
  const end = maze.end;
  
  // Manhattan distance heuristic
  const heuristic = (pos, goal) => {
    return Math.abs(pos[0] - goal[0]) + Math.abs(pos[1] - goal[1]);
  };

  // Priority queue implementation
  class PriorityQueue {
    constructor() {
      this.values = [];
    }

    enqueue(node, priority) {
      this.values.push({ node, priority });
      this.sort();
    }

    dequeue() {
      return this.values.shift();
    }

    sort() {
      this.values.sort((a, b) => a.priority - b.priority);
    }
  }

  const openSet = new PriorityQueue();
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  // Initialize start node
  const startKey = start.toString();
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));
  openSet.enqueue(start, fScore.get(startKey));

  while (openSet.values.length > 0) {
    const current = openSet.dequeue().node;
    const currentKey = current.toString();

    if (current[0] === end[0] && current[1] === end[1]) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom.get(temp.toString());
      }
      return path;
    }

    closedSet.add(currentKey);

    // Check neighbors
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dy, dx] of directions) {
      const neighbor = [current[0] + dy, current[1] + dx];
      const neighborKey = neighbor.toString();

      // Skip if out of bounds or is a wall
      if (
        neighbor[0] < 0 || 
        neighbor[0] >= grid.length || 
        neighbor[1] < 0 || 
        neighbor[1] >= grid[0].length ||
        grid[neighbor[0]][neighbor[1]] === 1 ||
        closedSet.has(neighborKey)
      ) {
        continue;
      }

      const tentativeGScore = gScore.get(currentKey) + 1;

      if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
        
        openSet.enqueue(neighbor, fScore.get(neighborKey));
      }
    }
  }

  return []; // No path found
};

export default findShortestPath; 