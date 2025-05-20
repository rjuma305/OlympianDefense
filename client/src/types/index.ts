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

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number; // Cooldown in milliseconds
  lastUsed: number; // Timestamp when the ability was last used
  isReady: boolean;
  effectRadius?: number; // Radius for area effects
  damageMultiplier?: number; // For damage abilities
  duration?: number; // Duration of effect in milliseconds
  
  // New properties for expanded abilities
  slowMultiplier?: number; // For Aphrodite's slow effects (0-1)
  chainCount?: number; // For Zeus's chain lightning
  knockbackDistance?: number; // For Poseidon's tidal wave
  speedMultiplier?: number; // For speed-affecting abilities
}

export interface Olympian extends TowerBase {
  tier: 'olympian';
  specialAbility?: Ability;
  ultimateAbility?: Ability;
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
  
  // Status effect properties
  transformedUntil?: number; // For Circe's transformation
  slowed?: number; // Slow factor (1 = normal speed, 0.5 = half speed)
  slowedUntil?: number; // When slow effect ends
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
  radius: number; // For visual effect size
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

// Base structures
export interface BaseStructure {
  position: [number, number, number];
  health: number;
  maxHealth: number;
}

export interface TitanKeep extends BaseStructure {
  // Additional Titan Keep properties
  spawnPosition: [number, number, number];
  wavesDamage: number; // Damage taken per completed wave
  isDefeated: boolean;
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
