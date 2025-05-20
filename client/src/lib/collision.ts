import { Tower, Enemy, Projectile } from "../types";

// Check if a projectile hits an enemy
export function checkProjectileCollision(
  projectile: Projectile,
  enemy: Enemy
): boolean {
  // Simple distance check for collision
  const dx = projectile.position[0] - enemy.position[0];
  const dy = projectile.position[1] - enemy.position[1];
  const dz = projectile.position[2] - enemy.position[2];
  
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Collision radius - you can adjust this based on your needs
  const collisionRadius = 0.5;
  
  return distance <= collisionRadius;
}

// Check if an enemy is in tower range
export function isEnemyInRange(
  tower: Tower,
  enemy: Enemy
): boolean {
  const dx = tower.position[0] - enemy.position[0];
  const dz = tower.position[2] - enemy.position[2];
  
  const distance = Math.sqrt(dx * dx + dz * dz);
  
  return distance <= tower.range;
}

// Find the closest enemy to a tower within range
export function findClosestEnemy(
  tower: Tower,
  enemies: Enemy[]
): Enemy | null {
  let closestEnemy: Enemy | null = null;
  let closestDistance = Infinity;
  
  for (const enemy of enemies) {
    if (enemy.isDead) continue;
    
    const dx = tower.position[0] - enemy.position[0];
    const dz = tower.position[2] - enemy.position[2];
    
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance <= tower.range && distance < closestDistance) {
      closestDistance = distance;
      closestEnemy = enemy;
    }
  }
  
  return closestEnemy;
}
