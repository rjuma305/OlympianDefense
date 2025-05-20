import { EnemySpawn } from "../types";

// Standard enemy types
export const standardEnemies: Record<string, Omit<EnemySpawn, "isKronos">> = {
  titan: {
    type: "titan",
    health: 100,
    speed: 1,
    damage: 10,
    reward: 20
  },
  cyclops: {
    type: "cyclops",
    health: 200,
    speed: 0.7,
    damage: 15,
    reward: 30
  },
  harpy: {
    type: "harpy",
    health: 70,
    speed: 1.5,
    damage: 8,
    reward: 15
  }
};

// Kronos (final boss)
export const kronosEnemy: Omit<EnemySpawn, "isKronos"> = {
  type: "kronos",
  health: 1000,
  speed: 0.5,
  damage: 50,
  reward: 500
};

import { ResourceType } from "./resources";

// Helper function to scale enemy stats based on wave

export interface ResourceDrop {
  type: ResourceType;
  amount: number;
  chance: number; // 0-1 probability of dropping
}

export function getScaledEnemy(
  type: string,
  waveNumber: number,
  isKronos: boolean = false
): EnemySpawn {
  // Scale factor increases with wave number
  const scaleFactor = 1 + (waveNumber - 1) * 0.2;
  
  let enemy;
  
  if (isKronos) {
    enemy = { ...kronosEnemy };
    // Kronos gets an additional scaling
    enemy.health *= scaleFactor * 1.5;
    enemy.damage *= scaleFactor * 1.2;
  } else {
    enemy = { ...standardEnemies[type] };
    // Regular enemies
    enemy.health *= scaleFactor;
    enemy.damage *= scaleFactor;
    enemy.reward = Math.floor(enemy.reward * (1 + (waveNumber - 1) * 0.1));
  }
  
  return {
    ...enemy,
    isKronos
  };
}
