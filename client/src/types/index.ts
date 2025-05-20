// Game states
export type GameState = 'menu' | 'playing' | 'gameOver';
export type GameOverState = 'victory' | 'defeat';

// Tower types
export type TowerTier = 'hero' | 'demigod' | 'olympian';

export interface TowerBase {
  id: string;
  position: [number, number, number];
  tier: TowerTier;
  type: string;
  damage: number;
  range: number;
  attackSpeed: number; // attacks per second
  cost: number;
  upgradeProgress: number;
  targetId: string | null;
  lastAttackTime: number;
  upgradeCost: number;
  upgradeName: string | null; // Name of the next tier
  color: string;
}

export interface Hero extends TowerBase {
  tier: 'hero';
}

export interface Demigod extends TowerBase {
  tier: 'demigod';
  specialAbility?: string;
}

export interface Olympian extends TowerBase {
  tier: 'olympian';
  specialAbility?: string;
  ultimateAbility?: string;
}

export type Tower = Hero | Demigod | Olympian;

// Enemy types
export interface Enemy {
  id: string;
  position: [number, number, number];
  type: string;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  reward: number;
  isKronos: boolean;
  pathIndex: number;
  targetPosition: [number, number, number];
  isDead: boolean;
}

// Projectile types
export interface Projectile {
  id: string;
  position: [number, number, number];
  target: string; // Enemy ID
  damage: number;
  speed: number;
  type: string;
  fromTower: string; // Tower ID
  createdAt: number;
}

// Effect types
export interface Effect {
  id: string;
  position: [number, number, number];
  type: string;
  duration: number;
  createdAt: number;
}

// Wave types
export interface Wave {
  number: number;
  enemies: EnemySpawn[];
  spawnDelay: number; // Time between enemy spawns
  hasKronos: boolean;
}

export interface EnemySpawn {
  type: string;
  health: number;
  speed: number;
  damage: number;
  reward: number;
  isKronos: boolean;
}

// Path and grid
export interface GridCell {
  x: number;
  z: number;
  isOccupied: boolean;
  isPath: boolean;
  towerPlaceable: boolean;
}

export interface PathPoint {
  x: number;
  z: number;
}

// Shop and resources
export interface TowerBlueprint {
  id: string;
  name: string;
  tier: TowerTier;
  type: string;
  damage: number;
  range: number;
  attackSpeed: number;
  cost: number;
  upgradeCost: number;
  upgradeName: string | null;
  description: string;
  color: string;
}
