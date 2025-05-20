import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { GameState, GameOverState, Tower, Enemy, Effect, GridCell, PathPoint, TitanKeep } from '../../types';
import { generatePath } from '../path';
import { heroTowers } from '../towers';
import { standardEnemies, processResourceDrops } from '../enemies';
import { useWaves } from './useWaves';
import { useResources } from './useResources';
import { useProjectiles } from './useProjectiles';
import { useAudio } from './useAudio';
import { ResourceType } from '../resources';

const GRID_SIZE = 15; // 15x15 grid
const CELL_SIZE = 2; // 2 units per cell

interface OlympiansState {
  gameState: GameState;
  gameOverState: GameOverState | null;
  towers: Tower[];
  enemies: Enemy[];
  effects: Effect[];
  grid: GridCell[][];
  path: PathPoint[];
  
  // Base structures
  mountOlympusPosition: [number, number, number];
  zeusHealth: number;
  maxZeusHealth: number;
  titanKeep: TitanKeep | null;
  
  selectedTower: Tower | null;
  placementMode: boolean;
  selectedBlueprint: string | null;
  showShop: boolean;
  isTowerInfoOpen: boolean;
  upgradeMode: boolean;
  
  // Methods
  initialize: () => void;
  startGame: () => void;
  placeTower: (position: [number, number, number], blueprintId: string) => void;
  upgradeTower: (towerId: string) => void;
  selectTower: (towerId: string) => void;
  deselectTower: () => void;
  setPlacementMode: (mode: boolean, blueprintId?: string) => void;
  setUpgradeMode: (mode: boolean) => void;
  toggleShop: () => void;
  damageZeus: (damage: number) => void;
  damageTitanKeep: (damage: number) => void;
  
  // Game loop methods
  updateGame: (deltaTime: number) => void;
  findNearestEnemy: (position: [number, number, number], range: number) => Enemy | null;
  towerAttack: (tower: Tower) => void;
  removeDeadEnemies: () => void;
  removeExpiredEffects: () => void;
  
  // Effect methods
  addEffect: (effect: Effect) => void;
  damageEnemiesInRadius: (position: [number, number, number], radius: number, damage: number) => void;
  transformEnemiesInRadius: (position: [number, number, number], radius: number, duration: number) => void;
  slowEnemiesInRadius: (position: [number, number, number], radius: number, duration: number, slowFactor: number) => void;
  chainLightningAttack: (position: [number, number, number], range: number, damage: number, chainCount: number) => void;
  pushBackEnemiesInRadius: (position: [number, number, number], radius: number, damage: number, knockbackDistance: number) => void;
}

export const useOlympians = create<OlympiansState>((set, get) => {
  // Create initial grid
  const createGrid = (): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const row: GridCell[] = [];
      for (let z = 0; z < GRID_SIZE; z++) {
        row.push({
          x: x * CELL_SIZE - (GRID_SIZE * CELL_SIZE) / 2 + CELL_SIZE / 2,
          z: z * CELL_SIZE - (GRID_SIZE * CELL_SIZE) / 2 + CELL_SIZE / 2,
          isOccupied: false,
          isPath: false,
          towerPlaceable: true
        });
      }
      grid.push(row);
    }
    return grid;
  };

  return {
    gameState: 'menu',
    gameOverState: null,
    towers: [],
    enemies: [],
    effects: [],
    grid: createGrid(),
    path: [],
    mountOlympusPosition: [0, 0, -GRID_SIZE * CELL_SIZE / 2 + 1],
    zeusHealth: 100,
    maxZeusHealth: 100,
    titanKeep: null,
    selectedTower: null,
    placementMode: false,
    selectedBlueprint: null,
    showShop: false,
    isTowerInfoOpen: false,
    upgradeMode: false,

    initialize: () => {
      const grid = createGrid();
      
      // Mount Olympus position (center top of the grid)
      const mountOlympusPosition: [number, number, number] = [0, 0, -GRID_SIZE * CELL_SIZE / 2 + 1];
      
      // Titan Keep position (center bottom of the grid)
      const titanKeepPosition: [number, number, number] = [0, 0, GRID_SIZE * CELL_SIZE / 2 - 1];
      const titanSpawnPosition: [number, number, number] = [0, 0, GRID_SIZE * CELL_SIZE / 2 - 3];
      
      // Generate path from Titan Keep to Mount Olympus
      const pathStart: PathPoint = { 
        x: titanKeepPosition[0], 
        z: titanKeepPosition[2] - 2  // Slightly in front of the Titan Keep
      };
      
      const pathEnd: PathPoint = { 
        x: mountOlympusPosition[0], 
        z: mountOlympusPosition[2] 
      };
      
      const path = generatePath(grid, pathStart, pathEnd);
      
      // Create the Titan Keep
      const titanKeep: TitanKeep = {
        position: titanKeepPosition,
        health: 1000,
        maxHealth: 1000,
        spawnPosition: titanSpawnPosition,
        wavesDamage: 50, // Damage taken per completed wave
        isDefeated: false
      };
      
      // Mark path cells
      for (const point of path) {
        const gridX = Math.floor((point.x + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE);
        const gridZ = Math.floor((point.z + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE);
        
        if (gridX >= 0 && gridX < GRID_SIZE && gridZ >= 0 && gridZ < GRID_SIZE) {
          grid[gridX][gridZ].isPath = true;
          grid[gridX][gridZ].towerPlaceable = false;
          
          // Make cells adjacent to path not placeable as well
          for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
              if (dx === 0 && dz === 0) continue;
              
              const nx = gridX + dx;
              const nz = gridZ + dz;
              
              if (nx >= 0 && nx < GRID_SIZE && nz >= 0 && nz < GRID_SIZE) {
                // Don't place towers too close to the path
                if (Math.abs(dx) + Math.abs(dz) <= 1) {
                  grid[nx][nz].towerPlaceable = false;
                }
              }
            }
          }
        }
      }
      
      useWaves.getState().initializeWaves();
      useResources.getState().resetResources();
      
      set({
        grid,
        path,
        mountOlympusPosition,
        gameState: 'menu',
        gameOverState: null,
        zeusHealth: 100,
        maxZeusHealth: 100,
        titanKeep,
        enemies: [],
        towers: [],
        effects: [],
        selectedTower: null,
        placementMode: false,
        selectedBlueprint: null,
        showShop: false,
        isTowerInfoOpen: false
      });
    },

    startGame: () => {
      set({ gameState: 'playing' });
      useWaves.getState().startWaves();
    },

    placeTower: (position: [number, number, number], blueprintId: string) => {
      const { towers, grid } = get();
      const { spendTributeForTower } = useResources.getState();
      
      // Find the tower blueprint - checking all available towers
      console.log("Looking for blueprint:", blueprintId);
      const blueprint = heroTowers.find(t => t.id === blueprintId);
      console.log("Found blueprint:", blueprint);
      if (!blueprint) return;
      
      // Check if player has enough tribute to place tower
      if (!spendTributeForTower(blueprint.id)) return;
      
      // Find grid cell
      const gridX = Math.floor((position[0] + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE);
      const gridZ = Math.floor((position[2] + GRID_SIZE * CELL_SIZE / 2) / CELL_SIZE);
      
      if (gridX < 0 || gridX >= GRID_SIZE || gridZ < 0 || gridZ >= GRID_SIZE) return;
      
      const cell = grid[gridX][gridZ];
      
      // Check if cell is available for tower placement
      if (cell.isOccupied || !cell.towerPlaceable) return;
      
      // Create a hero tower with properly typed position
      const towerPosition: [number, number, number] = [cell.x, 0, cell.z];
      
      const newTower = {
        id: nanoid(),
        position: towerPosition,
        tier: 'hero' as const, // Explicitly set to hero tier
        type: blueprint.type,
        damage: blueprint.damage,
        range: blueprint.range,
        attackSpeed: blueprint.attackSpeed,
        cost: blueprint.cost,
        upgradeProgress: 0,
        targetId: null,
        lastAttackTime: 0,
        upgradeCost: blueprint.upgradeCost,
        upgradeName: blueprint.upgradeName,
        color: blueprint.color
      };
      
      // Mark cell as occupied
      grid[gridX][gridZ].isOccupied = true;
      
      // Add tower
      set({ 
        towers: [...towers, newTower],
        placementMode: false,
        selectedBlueprint: null
      });
      
      // Play sound
      useAudio.getState().playSuccess();
    },

    upgradeTower: (towerId: string) => {
      const { towers } = get();
      const { spendTributeForUpgrade } = useResources.getState();
      
      const towerIndex = towers.findIndex(t => t.id === towerId);
      if (towerIndex === -1) return;
      
      const tower = towers[towerIndex];
      
      // Check if player has enough resources and spend them
      if (!spendTributeForUpgrade(tower)) return;
      
      // Clone towers array
      const updatedTowers = [...towers];
      
      // Handle upgrade based on current tier
      if (tower.tier === 'hero') {
        // Upgrade to demigod
        updatedTowers[towerIndex] = {
          ...tower,
          tier: 'demigod',
          damage: tower.damage * 2.5,
          range: tower.range * 1.3,
          attackSpeed: tower.attackSpeed * 1.2,
          upgradeProgress: 0,
          upgradeCost: tower.upgradeCost * 3,
          upgradeName: tower.type === 'archer' ? 'Apollo' : 
                       tower.type === 'warrior' ? 'Heracles' : 
                       tower.type === 'mage' ? 'Circe' : 'Olympian'
        };
      } else if (tower.tier === 'demigod') {
        // Determine which ability set to use based on tower type
        let specialAbility;
        if (tower.type === 'archer') {
          // Apollo
          specialAbility = {
            id: "solar-flare",
            name: "Solar Flare",
            description: "Creates a wide cone burst of radiant damage that hits multiple enemies",
            cooldown: 10000, // 10 seconds
            lastUsed: 0,
            isReady: true,
            effectRadius: 5,
            damageMultiplier: 2.5,
            duration: 3000 // 3 seconds
          };
        } else if (tower.type === 'warrior') {
          // Heracles
          specialAbility = {
            id: "mighty-swing",
            name: "Mighty Swing",
            description: "Delivers a devastating blow that damages all enemies in range",
            cooldown: 15000, // 15 seconds
            lastUsed: 0,
            isReady: true,
            effectRadius: 3,
            damageMultiplier: 3,
            duration: 500 // Instant effect with short animation
          };
        } else { // mage
          // Circe
          specialAbility = {
            id: "transformation",
            name: "Transformation",
            description: "Transforms enemies into harmless creatures for a short duration",
            cooldown: 20000, // 20 seconds
            lastUsed: 0,
            isReady: true,
            effectRadius: 4,
            duration: 5000 // 5 seconds
          };
        }
        
        // Upgrade to olympian with abilities
        updatedTowers[towerIndex] = {
          ...tower,
          tier: 'olympian',
          damage: tower.damage * 3,
          range: tower.range * 1.5,
          attackSpeed: tower.attackSpeed * 1.5,
          upgradeProgress: 0,
          upgradeCost: 0,
          upgradeName: null,
          specialAbility: specialAbility
        };
      }
      
      set({ 
        towers: updatedTowers,
        upgradeMode: false
      });
      
      // Play success sound
      useAudio.getState().playSuccess();
    },

    selectTower: (towerId: string) => {
      const { towers } = get();
      const tower = towers.find(t => t.id === towerId);
      if (tower) {
        set({ 
          selectedTower: tower,
          isTowerInfoOpen: true
        });
      }
    },

    deselectTower: () => {
      set({ 
        selectedTower: null,
        isTowerInfoOpen: false
      });
    },

    setPlacementMode: (mode: boolean, blueprintId?: string) => {
      set({ 
        placementMode: mode,
        selectedBlueprint: blueprintId || null,
        upgradeMode: false
      });
    },

    setUpgradeMode: (mode: boolean) => {
      set({ 
        upgradeMode: mode,
        placementMode: false
      });
    },

    toggleShop: () => {
      set(state => ({ 
        showShop: !state.showShop 
      }));
    },

    damageZeus: (damage: number) => {
      const { zeusHealth, gameState } = get();
      const newHealth = Math.max(0, zeusHealth - damage);
      
      set({ zeusHealth: newHealth });
      
      // Check for defeat condition
      if (newHealth <= 0 && gameState === 'playing') {
        set({
          gameState: 'gameOver',
          gameOverState: 'defeat'
        });
      }
    },
    
    damageTitanKeep: (damage: number) => {
      const { titanKeep, gameState } = get();
      if (!titanKeep || titanKeep.isDefeated) return;
      
      const newHealth = Math.max(0, titanKeep.health - damage);
      
      // Update Titan Keep health
      const updatedTitanKeep = {
        ...titanKeep,
        health: newHealth,
        isDefeated: newHealth <= 0
      };
      
      set({ titanKeep: updatedTitanKeep });
      
      // Check for victory condition
      if (newHealth <= 0 && gameState === 'playing') {
        set({
          gameState: 'gameOver',
          gameOverState: 'victory'
        });
      }
    },

    updateGame: (deltaTime: number) => {
      const { gameState, towers, enemies, path, mountOlympusPosition, titanKeep } = get();
      
      if (gameState !== 'playing') return;
      
      // Update tower attacks
      for (const tower of towers) {
        get().towerAttack(tower);
      }
      
      // Update enemy positions
      const currentTime = Date.now();
      const updatedEnemies = enemies.map(enemy => {
        if (enemy.isDead) return enemy;
        
        // Check and update status effects
        const updatedEnemy = { ...enemy };
        
        // Check for transformation effect expiration
        if (updatedEnemy.transformedUntil && updatedEnemy.transformedUntil <= currentTime) {
          // Reset enemy speed and damage after transformation ends
          const baseEnemy = standardEnemies[updatedEnemy.type];
          if (baseEnemy) {
            updatedEnemy.speed = baseEnemy.speed * (updatedEnemy.slowed || 1); // Keep slow if it's still active
            updatedEnemy.damage = baseEnemy.damage;
            updatedEnemy.transformedUntil = undefined;
          }
        }
        
        // Check for slow effect expiration
        if (updatedEnemy.slowedUntil && updatedEnemy.slowedUntil <= currentTime) {
          // Reset enemy speed after slow ends
          const baseEnemy = standardEnemies[updatedEnemy.type];
          if (baseEnemy) {
            updatedEnemy.speed = baseEnemy.speed;
            updatedEnemy.slowed = undefined;
            updatedEnemy.slowedUntil = undefined;
          }
        }
        
        // Skip movement if enemy is transformed
        if (updatedEnemy.transformedUntil && updatedEnemy.transformedUntil > currentTime) {
          return updatedEnemy;
        }
        
        // Enemy movement along path
        if (updatedEnemy.pathIndex < path.length) {
          const targetPoint = path[updatedEnemy.pathIndex];
          const targetPosition: [number, number, number] = [targetPoint.x, 0, targetPoint.z];
          
          // Calculate distance to next path point
          const dx = targetPosition[0] - updatedEnemy.position[0];
          const dz = targetPosition[2] - updatedEnemy.position[2];
          const distance = Math.sqrt(dx * dx + dz * dz);
          
          if (distance < 0.1) {
            // Reached the path point, go to next one
            updatedEnemy.pathIndex++;
            
            // If we've reached the end of the path
            if (updatedEnemy.pathIndex >= path.length) {
              // Attack Zeus
              get().damageZeus(updatedEnemy.damage);
              
              // Remove enemy
              updatedEnemy.isDead = true;
              return updatedEnemy;
            }
            
            // Update target to the next path point
            const nextPoint = path[updatedEnemy.pathIndex];
            updatedEnemy.targetPosition = [nextPoint.x, 0, nextPoint.z];
          } else {
            // Move towards the current target
            const moveSpeed = updatedEnemy.speed * deltaTime;
            const moveDistanceRatio = Math.min(1, moveSpeed / distance);
            
            updatedEnemy.position = [
              updatedEnemy.position[0] + dx * moveDistanceRatio,
              0,
              updatedEnemy.position[2] + dz * moveDistanceRatio
            ];
          }
        } else {
          // Enemy has reached Mount Olympus
          updatedEnemy.isDead = true;
        }
        
        return updatedEnemy;
      });
      
      set({ enemies: updatedEnemies });
      
      // Remove dead enemies
      get().removeDeadEnemies();
      
      // Update and remove expired effects
      get().removeExpiredEffects();
      
      // Check for victory conditions
      // 1. Kronos defeat
      const kronos = enemies.find(e => e.isKronos);
      if (kronos && kronos.isDead) {
        set({
          gameState: 'gameOver',
          gameOverState: 'victory'
        });
      }
      
      // 2. Titan Keep destroyed
      if (titanKeep && titanKeep.isDefeated) {
        set({
          gameState: 'gameOver',
          gameOverState: 'victory'
        });
      }
    },

    findNearestEnemy: (position: [number, number, number], range: number) => {
      const { enemies } = get();
      let nearestEnemy: Enemy | null = null;
      let nearestDistance = Infinity;
      
      for (const enemy of enemies) {
        if (enemy.isDead) continue;
        
        const dx = enemy.position[0] - position[0];
        const dz = enemy.position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance <= range && distance < nearestDistance) {
          nearestDistance = distance;
          nearestEnemy = enemy;
        }
      }
      
      return nearestEnemy;
    },

    towerAttack: (tower: Tower) => {
      const currentTime = Date.now();
      const { towers } = get();
      const { createProjectile } = useProjectiles.getState();
      
      // Check attack cooldown
      const cooldown = 1000 / tower.attackSpeed;
      if (currentTime - tower.lastAttackTime < cooldown) return;
      
      // Find target
      let target = null;
      if (tower.targetId) {
        target = get().enemies.find(e => e.id === tower.targetId && !e.isDead);
      }
      
      // If no target or target is dead, find a new one
      if (!target) {
        target = get().findNearestEnemy(tower.position, tower.range);
        
        // Update tower's target
        const towerIndex = towers.findIndex(t => t.id === tower.id);
        if (towerIndex !== -1) {
          const updatedTowers = [...towers];
          updatedTowers[towerIndex] = {
            ...tower,
            targetId: target?.id || null
          };
          set({ towers: updatedTowers });
        }
      }
      
      // If we have a target, attack it
      if (target) {
        // Update tower's last attack time
        const towerIndex = towers.findIndex(t => t.id === tower.id);
        if (towerIndex !== -1) {
          const updatedTowers = [...towers];
          updatedTowers[towerIndex] = {
            ...tower,
            lastAttackTime: currentTime
          };
          set({ towers: updatedTowers });
        }
        
        // Create a projectile
        createProjectile({
          position: tower.position,
          target: target.id,
          damage: tower.damage,
          speed: 15, // Projectile speed
          type: tower.type,
          fromTower: tower.id
        });
        
        // Play hit sound
        useAudio.getState().playHit();
      }
    },

    removeDeadEnemies: () => {
      const { enemies } = get();
      const { earnTribute, earnEssence, earnRelicShard } = useResources.getState();
      
      // Filter out dead enemies and grant rewards
      const aliveEnemies = enemies.filter(enemy => {
        if (enemy.isDead && !enemy.isKronos) {
          // Add basic tribute reward
          earnTribute(enemy.reward);
          
          // Process additional resource drops from enemies
          const resourceDrops = processResourceDrops(enemy.type, enemy.isKronos);
          resourceDrops.forEach(drop => {
            switch(drop.type) {
              case ResourceType.TRIBUTE:
                earnTribute(drop.amount);
                break;
              case ResourceType.ESSENCE:
                earnEssence(drop.amount);
                break;
              case ResourceType.RELIC_SHARD:
                earnRelicShard(drop.amount);
                break;
            }
          });
          
          return false;
        }
        return !enemy.isDead;
      });
      
      set({ enemies: aliveEnemies });
    },

    removeExpiredEffects: () => {
      const { effects } = get();
      const currentTime = Date.now();
      
      const activeEffects = effects.filter(effect => {
        return currentTime - effect.createdAt < effect.duration;
      });
      
      set({ effects: activeEffects });
    },
    
    // Add a visual effect to the game
    addEffect: (effect: Effect) => {
      const { effects } = get();
      set({ effects: [...effects, effect] });
    },
    
    // Damage enemies in radius for AoE abilities
    damageEnemiesInRadius: (position: [number, number, number], radius: number, damage: number) => {
      const { enemies } = get();
      const updatedEnemies = [...enemies];
      
      // Check each enemy to see if it's in range
      for (let i = 0; i < updatedEnemies.length; i++) {
        if (updatedEnemies[i].isDead) continue;
        
        // Calculate distance to enemy
        const dx = updatedEnemies[i].position[0] - position[0];
        const dz = updatedEnemies[i].position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // If in range, apply damage
        if (distance <= radius) {
          updatedEnemies[i] = {
            ...updatedEnemies[i],
            health: Math.max(0, updatedEnemies[i].health - damage)
          };
          
          // Check if enemy died
          if (updatedEnemies[i].health <= 0) {
            updatedEnemies[i] = {
              ...updatedEnemies[i],
              isDead: true
            };
          }
        }
      }
      
      set({ enemies: updatedEnemies });
    },
    
    // Transform enemies for Circe's ability
    transformEnemiesInRadius: (position: [number, number, number], radius: number, duration: number) => {
      const { enemies } = get();
      const updatedEnemies = [...enemies];
      const currentTime = Date.now();
      
      // Check each enemy to see if it's in range
      for (let i = 0; i < updatedEnemies.length; i++) {
        if (updatedEnemies[i].isDead) continue;
        
        // Calculate distance to enemy
        const dx = updatedEnemies[i].position[0] - position[0];
        const dz = updatedEnemies[i].position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // If in range, apply transformation effect
        if (distance <= radius) {
          updatedEnemies[i] = {
            ...updatedEnemies[i],
            speed: 0, // Transformed enemies can't move
            damage: 0, // Transformed enemies can't attack
            transformedUntil: currentTime + duration
          };
        }
      }
      
      set({ enemies: updatedEnemies });
    },
    
    // Slow enemies for Aphrodite's charm aura ability
    slowEnemiesInRadius: (position: [number, number, number], radius: number, duration: number, slowFactor: number) => {
      const { enemies } = get();
      const updatedEnemies = [...enemies];
      const currentTime = Date.now();
      
      // Check each enemy to see if it's in range
      for (let i = 0; i < updatedEnemies.length; i++) {
        if (updatedEnemies[i].isDead) continue;
        
        // Calculate distance to enemy
        const dx = updatedEnemies[i].position[0] - position[0];
        const dz = updatedEnemies[i].position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // If in range, apply slow effect
        if (distance <= radius) {
          const originalSpeed = updatedEnemies[i].speed / (updatedEnemies[i].slowed || 1);
          
          updatedEnemies[i] = {
            ...updatedEnemies[i],
            speed: originalSpeed * slowFactor,
            slowed: 1 / slowFactor,
            slowedUntil: currentTime + duration
          };
        }
      }
      
      set({ enemies: updatedEnemies });
    },
    
    // Chain lightning for Zeus's ability
    chainLightningAttack: (position: [number, number, number], range: number, damage: number, chainCount: number) => {
      const { enemies } = get();
      const updatedEnemies = [...enemies];
      
      // Find all enemies in range
      const enemiesInRange: Enemy[] = [];
      
      for (const enemy of updatedEnemies) {
        if (enemy.isDead) continue;
        
        const dx = enemy.position[0] - position[0];
        const dz = enemy.position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance <= range) {
          enemiesInRange.push(enemy);
        }
      }
      
      // Sort by distance to tower
      enemiesInRange.sort((a, b) => {
        const dxA = a.position[0] - position[0];
        const dzA = a.position[2] - position[2];
        const distA = Math.sqrt(dxA * dxA + dzA * dzA);
        
        const dxB = b.position[0] - position[0];
        const dzB = b.position[2] - position[2];
        const distB = Math.sqrt(dxB * dxB + dzB * dzB);
        
        return distA - distB;
      });
      
      // Apply damage to up to chainCount enemies
      const targetCount = Math.min(chainCount, enemiesInRange.length);
      
      for (let i = 0; i < targetCount; i++) {
        const enemy = enemiesInRange[i];
        const enemyIndex = updatedEnemies.findIndex(e => e.id === enemy.id);
        
        if (enemyIndex !== -1) {
          // Damage reduces with each chain
          const chainDamage = damage * (1 - i * 0.15); // 15% less damage per chain
          
          updatedEnemies[enemyIndex] = {
            ...updatedEnemies[enemyIndex],
            health: Math.max(0, updatedEnemies[enemyIndex].health - chainDamage)
          };
          
          // Check if enemy died
          if (updatedEnemies[enemyIndex].health <= 0) {
            updatedEnemies[enemyIndex] = {
              ...updatedEnemies[enemyIndex],
              isDead: true
            };
          }
        }
      }
      
      set({ enemies: updatedEnemies });
    },
    
    // Pushback enemies for Poseidon's tidal wave ability
    pushBackEnemiesInRadius: (position: [number, number, number], radius: number, damage: number, knockbackDistance: number) => {
      const { enemies, path } = get();
      const updatedEnemies = [...enemies];
      
      // Check each enemy to see if it's in range
      for (let i = 0; i < updatedEnemies.length; i++) {
        if (updatedEnemies[i].isDead) continue;
        
        // Calculate distance to enemy
        const dx = updatedEnemies[i].position[0] - position[0];
        const dz = updatedEnemies[i].position[2] - position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // If in range, apply damage and knockback
        if (distance <= radius) {
          // Apply damage
          updatedEnemies[i] = {
            ...updatedEnemies[i],
            health: Math.max(0, updatedEnemies[i].health - damage)
          };
          
          // Check if enemy died
          if (updatedEnemies[i].health <= 0) {
            updatedEnemies[i] = {
              ...updatedEnemies[i],
              isDead: true
            };
            continue;
          }
          
          // Apply knockback (move enemy back along the path)
          const pathIndex = Math.max(0, updatedEnemies[i].pathIndex - knockbackDistance);
          
          if (pathIndex < path.length) {
            updatedEnemies[i] = {
              ...updatedEnemies[i],
              pathIndex,
              position: [path[pathIndex].x, 0, path[pathIndex].z]
            };
          }
        }
      }
      
      set({ enemies: updatedEnemies });
    }
  };
});
