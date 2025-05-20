import { EnemySpawn } from "../types";
import { ResourceType } from "./resources";

// Interface for resource drops
export interface ResourceDrop {
  type: ResourceType;
  amount: number;
  chance: number; // 0-1 probability of dropping
}

// Standard enemy types
export const standardEnemies: Record<string, Omit<EnemySpawn, "isKronos"> & { resourceDrops?: ResourceDrop[] }> = {
  titan: {
    type: "titan",
    health: 100,
    speed: 1,
    damage: 10,
    reward: 20,
    resourceDrops: [
      { type: ResourceType.TRIBUTE, amount: 15, chance: 0.7 },
      { type: ResourceType.ESSENCE, amount: 5, chance: 0.3 }
    ]
  },
  cyclops: {
    type: "cyclops",
    health: 200,
    speed: 0.7,
    damage: 15,
    reward: 30,
    resourceDrops: [
      { type: ResourceType.TRIBUTE, amount: 20, chance: 0.6 },
      { type: ResourceType.RELIC_SHARD, amount: 1, chance: 0.15 }
    ]
  },
  harpy: {
    type: "harpy",
    health: 70,
    speed: 1.5,
    damage: 8,
    reward: 15,
    resourceDrops: [
      { type: ResourceType.ESSENCE, amount: 12, chance: 0.8 },
      { type: ResourceType.TRIBUTE, amount: 5, chance: 0.2 }
    ]
  }
};

// Kronos (final boss)
export const kronosEnemy: Omit<EnemySpawn, "isKronos"> & { resourceDrops?: ResourceDrop[] } = {
  type: "kronos",
  health: 1000,
  speed: 0.5,
  damage: 50,
  reward: 500,
  resourceDrops: [
    { type: ResourceType.TRIBUTE, amount: 100, chance: 1.0 },
    { type: ResourceType.ESSENCE, amount: 75, chance: 1.0 },
    { type: ResourceType.RELIC_SHARD, amount: 10, chance: 1.0 }
  ]
};

import { ResourceType } from "./resources";

// Interface for resource drops
export interface ResourceDrop {
  type: ResourceType;
  amount: number;
  chance: number; // 0-1 probability of dropping
}

// Helper function to scale enemy stats based on wave

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
