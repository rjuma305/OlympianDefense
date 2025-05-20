import { GridCell, PathPoint } from "../types";

// Simple A* path finding algorithm to generate path
export function generatePath(
  grid: GridCell[][],
  start: PathPoint,
  end: PathPoint
): PathPoint[] {
  // For simplicity, let's use a predefined path
  // In a real game, you'd implement A* or similar pathfinding
  
  const startX = Math.floor((start.x + grid.length) / 2);
  const startZ = Math.floor((start.z + grid[0].length) / 2);
  const endX = Math.floor((end.x + grid.length) / 2);
  const endZ = Math.floor((end.z + grid[0].length) / 2);
  
  // Create a winding path from start to end
  const path: PathPoint[] = [];
  
  // Add start point
  path.push({ x: start.x, z: start.z });
  
  // Create intermediate points for the path
  // This creates a simple path with some turns
  
  // First, move halfway across
  const midX = start.x;
  const midZ = start.z - (start.z - end.z) / 2;
  path.push({ x: midX, z: midZ });
  
  // Make a turn
  const turn1X = midX - grid.length / 4;
  const turn1Z = midZ;
  path.push({ x: turn1X, z: turn1Z });
  
  // Move towards the target
  const turn2X = turn1X;
  const turn2Z = turn1Z - (turn1Z - end.z) / 2;
  path.push({ x: turn2X, z: turn2Z });
  
  // Make another turn
  const turn3X = turn2X + grid.length / 2;
  const turn3Z = turn2Z;
  path.push({ x: turn3X, z: turn3Z });
  
  // Add end point
  path.push({ x: end.x, z: end.z });
  
  return path;
}

// Function to get the nearest grid cell for tower placement
export function getNearestGridCell(
  grid: GridCell[][],
  position: [number, number, number]
): GridCell | null {
  const [x, , z] = position;
  
  // Find the nearest grid cell
  let nearestCell: GridCell | null = null;
  let nearestDistance = Infinity;
  
  for (const row of grid) {
    for (const cell of row) {
      const dx = cell.x - x;
      const dz = cell.z - z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCell = cell;
      }
    }
  }
  
  return nearestCell;
}
