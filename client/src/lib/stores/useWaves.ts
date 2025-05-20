import { create } from "zustand";
import { nanoid } from "nanoid";
import { Wave, Enemy, EnemySpawn } from "../../types";
import { useOlympians } from "./useOlympians";

interface WavesState {
  waves: Wave[];
  currentWave: number;
  isSpawning: boolean;
  spawnInterval: number | null;
  waveDelay: number; // Time between waves in milliseconds
  
  // Methods
  initializeWaves: () => void;
  startWaves: () => void;
  startNextWave: () => void;
  spawnEnemy: (enemyData: EnemySpawn) => void;
  getCurrentWave: () => Wave | null;
}

export const useWaves = create<WavesState>((set, get) => {
  return {
    waves: [],
    currentWave: 0,
    isSpawning: false,
    spawnInterval: null,
    waveDelay: 20000, // 20 seconds between waves

    initializeWaves: () => {
      // Generate 10 increasingly difficult waves
      const waves: Wave[] = [];
      
      for (let i = 1; i <= 10; i++) {
        const enemyCount = Math.floor(5 + i * 2); // Increase enemies per wave
        const enemies: EnemySpawn[] = [];
        
        // Base enemy stats that scale with wave number
        const baseHealth = 50 + (i * 20);
        const baseSpeed = 1 + (i * 0.1);
        const baseDamage = 5 + (i * 2);
        const baseReward = 10 + (i * 5);
        
        // Add regular enemies to the wave
        for (let j = 0; j < enemyCount; j++) {
          // Different enemy types
          const enemyVariation = Math.random();
          let type = "titan";
          let healthMod = 1;
          let speedMod = 1;
          let damageMod = 1;
          
          if (enemyVariation > 0.7) {
            type = "cyclops";
            healthMod = 2;
            speedMod = 0.7;
            damageMod = 1.5;
          } else if (enemyVariation > 0.4) {
            type = "harpy";
            healthMod = 0.7;
            speedMod = 1.5;
            damageMod = 0.8;
          }
          
          enemies.push({
            type,
            health: baseHealth * healthMod,
            speed: baseSpeed * speedMod,
            damage: baseDamage * damageMod,
            reward: baseReward,
            isKronos: false
          });
        }
        
        // Add Kronos on the final wave
        if (i === 10) {
          enemies.push({
            type: "kronos",
            health: baseHealth * 10,
            speed: baseSpeed * 0.5,
            damage: baseDamage * 5,
            reward: baseReward * 10,
            isKronos: true
          });
        }
        
        waves.push({
          number: i,
          enemies,
          spawnDelay: 1500 - (i * 100), // Decrease time between spawns
          hasKronos: i === 10
        });
      }
      
      set({ waves, currentWave: 0 });
    },

    startWaves: () => {
      set({ currentWave: 0 });
      get().startNextWave();
    },

    startNextWave: () => {
      const { currentWave, waves, isSpawning, spawnInterval } = get();
      
      // Clear any existing spawn interval
      if (isSpawning && spawnInterval !== null) {
        clearInterval(spawnInterval);
      }
      
      // Go to next wave
      const nextWaveNum = currentWave + 1;
      
      // Check if we've reached the end of waves
      if (nextWaveNum > waves.length) {
        console.log("All waves completed");
        set({ isSpawning: false, spawnInterval: null });
        return;
      }
      
      const wave = waves[nextWaveNum - 1];
      let enemyIndex = 0;
      
      // Start spawning enemies
      const interval = setInterval(() => {
        if (enemyIndex < wave.enemies.length) {
          get().spawnEnemy(wave.enemies[enemyIndex]);
          enemyIndex++;
        } else {
          // Wave completed, clear interval
          clearInterval(interval);
          set({ isSpawning: false, spawnInterval: null });
        }
      }, wave.spawnDelay);
      
      set({ 
        currentWave: nextWaveNum,
        isSpawning: true,
        spawnInterval: interval 
      });
    },

    spawnEnemy: (enemyData: EnemySpawn) => {
      const { path } = useOlympians.getState();
      const { enemies } = useOlympians.getState();
      
      // If no path is defined, can't spawn enemy
      if (path.length === 0) return;
      
      // Create enemy at the start of the path
      const startPoint = path[0];
      
      const enemy: Enemy = {
        id: nanoid(),
        position: [startPoint.x, 0, startPoint.z],
        type: enemyData.type,
        health: enemyData.health,
        maxHealth: enemyData.health,
        speed: enemyData.speed,
        damage: enemyData.damage,
        reward: enemyData.reward,
        isKronos: enemyData.isKronos,
        pathIndex: 1, // Start at index 1 as we're already at index 0
        targetPosition: path[1] ? [path[1].x, 0, path[1].z] : [0, 0, 0],
        isDead: false
      };
      
      // Add enemy to the state
      useOlympians.setState({ enemies: [...enemies, enemy] });
    },

    getCurrentWave: () => {
      const { currentWave, waves } = get();
      
      if (currentWave === 0 || currentWave > waves.length) {
        return null;
      }
      
      return waves[currentWave - 1];
    }
  };
});
