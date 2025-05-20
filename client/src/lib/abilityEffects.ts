import { nanoid } from 'nanoid';
import { Ability, Effect, Enemy, Olympian, Tower } from '../types';
import { useOlympians } from './stores/useOlympians';
import { useAudio } from './stores/useAudio';

// Function to trigger an ability effect
export function triggerAbility(tower: Olympian, ability: Ability): Ability {
  // Play a sound for the ability activation
  const { playHit } = useAudio.getState();
  playHit();
  
  // Update the ability cooldown
  const updatedAbility = {
    ...ability,
    lastUsed: Date.now(),
    isReady: false
  };
  
  // Apply different effects based on the ability type
  if (ability.id === 'solar-flare') {
    createSolarFlareEffect(tower);
  } else if (ability.id === 'mighty-swing') {
    createMightySwingEffect(tower);
  } else if (ability.id === 'transformation') {
    createTransformationEffect(tower);
  } else if (ability.id === 'charm-aura') {
    createCharmAuraEffect(tower);
  } else if (ability.id === 'chain-lightning') {
    createChainLightningEffect(tower);
  } else if (ability.id === 'tidal-wave') {
    createTidalWaveEffect(tower);
  }
  
  return updatedAbility;
}

// Solar Flare (Apollo) - Creates a wide cone burst of radiant damage
function createSolarFlareEffect(tower: Olympian) {
  const { findNearestEnemy, damageEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'solar-flare', 
    tower.specialAbility?.duration || 3000, 
    tower.specialAbility?.effectRadius || 5
  );
  
  // Find and damage enemies in a cone shape
  const damage = tower.damage * (tower.specialAbility?.damageMultiplier || 2);
  damageEnemiesInRadius(tower.position, tower.specialAbility?.effectRadius || 5, damage);
}

// Mighty Swing (Heracles) - Deals massive damage to all enemies in range
function createMightySwingEffect(tower: Olympian) {
  const { damageEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'mighty-swing', 
    tower.specialAbility?.duration || 500,
    tower.specialAbility?.effectRadius || 3
  );
  
  // Deal damage to all enemies in range
  const damage = tower.damage * (tower.specialAbility?.damageMultiplier || 3);
  damageEnemiesInRadius(tower.position, tower.specialAbility?.effectRadius || 3, damage);
}

// Transformation (Circe) - Transforms enemies, making them harmless temporarily
function createTransformationEffect(tower: Olympian) {
  const { transformEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'transformation', 
    tower.specialAbility?.duration || 5000,
    tower.specialAbility?.effectRadius || 4
  );
  
  // Transform enemies in range
  transformEnemiesInRadius(
    tower.position, 
    tower.specialAbility?.effectRadius || 4, 
    tower.specialAbility?.duration || 5000
  );
}

// Charm Aura (Aphrodite) - Creates an aura that slows all enemies in range
function createCharmAuraEffect(tower: Olympian) {
  const { slowEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'charm-aura', 
    tower.specialAbility?.duration || 6000,
    tower.specialAbility?.effectRadius || 6
  );
  
  // Slow enemies in range
  slowEnemiesInRadius(
    tower.position, 
    tower.specialAbility?.effectRadius || 6, 
    tower.specialAbility?.duration || 6000,
    tower.specialAbility?.slowMultiplier || 0.5
  );
}

// Chain Lightning (Zeus) - Strikes multiple enemies in a chain
function createChainLightningEffect(tower: Olympian) {
  const { chainLightningAttack } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'chain-lightning', 
    tower.specialAbility?.duration || 2000,
    tower.range
  );
  
  // Get the damage and chain count
  const damage = tower.damage * (tower.specialAbility?.damageMultiplier || 1.8);
  const chainCount = tower.specialAbility?.chainCount || 5;
  
  // Chain lightning between enemies
  chainLightningAttack(
    tower.position, 
    tower.range, 
    damage,
    chainCount
  );
}

// Tidal Wave (Poseidon) - Creates a massive wave that damages and pushes enemies
function createTidalWaveEffect(tower: Olympian) {
  const { pushBackEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'tidal-wave', 
    tower.specialAbility?.duration || 1500,
    tower.specialAbility?.effectRadius || 7
  );
  
  // Get the damage and knockback distance
  const damage = tower.damage * (tower.specialAbility?.damageMultiplier || 2.2);
  const knockbackDistance = tower.specialAbility?.knockbackDistance || 3;
  
  // Damage and push back enemies
  pushBackEnemiesInRadius(
    tower.position, 
    tower.specialAbility?.effectRadius || 7, 
    damage,
    knockbackDistance
  );
}

// Helper function to create visual effects
function createVisualEffect(
  position: [number, number, number], 
  type: string, 
  duration: number,
  radius: number
) {
  const { addEffect } = useOlympians.getState();
  
  const effect: Effect = {
    id: nanoid(),
    position,
    type,
    duration,
    createdAt: Date.now(),
    radius
  };
  
  addEffect(effect);
}