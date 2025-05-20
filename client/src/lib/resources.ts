import { Ability, Olympian, Tower } from "../types";

export enum ResourceType {
  ESSENCE = "essence",  // For ability usage
  TRIBUTE = "tribute",  // For tower placement/upgrading
  RELIC_SHARD = "relicShard",  // For special upgrades and unlocks
}

// God Ability Resource Costs
export const AbilityCosts: Record<string, Partial<Record<ResourceType, number>>> = {
  // Original Olympians
  Zeus: { [ResourceType.ESSENCE]: 4 },
  Poseidon: { [ResourceType.ESSENCE]: 4 },
  Apollo: { [ResourceType.ESSENCE]: 3 },
  Heracles: { [ResourceType.ESSENCE]: 4 },
  Circe: { [ResourceType.ESSENCE]: 3 },
  Aphrodite: { [ResourceType.ESSENCE]: 3 },

  // New Olympians
  Artemis: { [ResourceType.ESSENCE]: 2 },
  Hera: { [ResourceType.ESSENCE]: 4 },
  Ares: { [ResourceType.ESSENCE]: 3 },
  Hermes: { [ResourceType.ESSENCE]: 2 },
  Nyx: { [ResourceType.ESSENCE]: 5 },
  Hecate: { [ResourceType.ESSENCE]: 5 },
  Dionysus: { [ResourceType.ESSENCE]: 4 },
  Hestia: { [ResourceType.ESSENCE]: 3 },
};

// Tower Costs for placement and upgrades
export const TowerCosts: Record<string, { base: number; upgrade: number[] }> = {
  // Hero tier placement costs
  archer: { base: 7, upgrade: [11, 15] },      // Upgrades to Apollo
  warrior: { base: 8, upgrade: [12, 16] },     // Upgrades to Heracles
  mage: { base: 8, upgrade: [12, 16] },        // Upgrades to Circe
  enchanter: { base: 7, upgrade: [11, 15] },   // Upgrades to Aphrodite
  thunderer: { base: 8, upgrade: [12, 16] },   // Upgrades to Zeus
  tide: { base: 8, upgrade: [12, 16] },        // Upgrades to Poseidon
  
  // New hero tier costs
  huntress: { base: 7, upgrade: [11, 15] },    // Upgrades to Artemis
  royalguard: { base: 9, upgrade: [13, 17] },  // Upgrades to Hera
  berserker: { base: 8, upgrade: [12, 16] },   // Upgrades to Ares
  messenger: { base: 6, upgrade: [10, 14] },   // Upgrades to Hermes
  shadow: { base: 11, upgrade: [16, 22] },     // Upgrades to Nyx
  keeper: { base: 9, upgrade: [13, 17] },      // Upgrades to Hestia
  reveler: { base: 10, upgrade: [15, 20] },    // Upgrades to Dionysus
  mystic: { base: 12, upgrade: [18, 24] },     // Upgrades to Hecate
};

// Check if player can afford tower
export function canAffordTower(towerType: string, resourceAmount: number): boolean {
  if (!TowerCosts[towerType]) return false;
  return resourceAmount >= TowerCosts[towerType].base;
}

// Check if player can afford tower upgrade
export function canAffordUpgrade(tower: Tower, resourceAmount: number): boolean {
  const upgradeCosts = TowerCosts[tower.type]?.upgrade;
  if (!upgradeCosts) return false;
  
  let upgradeTier = 0;
  if (tower.tier === 'hero') upgradeTier = 0;
  else if (tower.tier === 'demigod') upgradeTier = 1;
  else return false; // Olympians can't be upgraded further
  
  return resourceAmount >= upgradeCosts[upgradeTier];
}

// Check if player can afford ability
export function canAffordAbility(olympian: Olympian, ability: Ability, essenceAmount: number): boolean {
  const cost = AbilityCosts[olympian.id]?.[ResourceType.ESSENCE] || 0;
  return essenceAmount >= cost;
}

// Get cost for specified ability
export function getAbilityCost(olympianId: string): number {
  return AbilityCosts[olympianId]?.[ResourceType.ESSENCE] || 0;
}

// Get tower placement cost
export function getTowerCost(towerType: string): number {
  return TowerCosts[towerType]?.base || 0;
}

// Get tower upgrade cost
export function getUpgradeCost(tower: Tower): number {
  const upgradeCosts = TowerCosts[tower.type]?.upgrade;
  if (!upgradeCosts) return 0;
  
  let upgradeTier = 0;
  if (tower.tier === 'hero') upgradeTier = 0;
  else if (tower.tier === 'demigod') upgradeTier = 1;
  else return 0; // Olympians can't be upgraded further
  
  return upgradeCosts[upgradeTier];
}