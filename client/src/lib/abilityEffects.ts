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
    tower.specialAbility.duration || 3000, 
    tower.specialAbility.effectRadius || 5
  );
  
  // Find and damage enemies in a cone shape
  const damage = tower.damage * (tower.specialAbility.damageMultiplier || 2);
  damageEnemiesInRadius(tower.position, tower.specialAbility.effectRadius || 5, damage);
}

// Mighty Swing (Heracles) - Deals massive damage to all enemies in range
function createMightySwingEffect(tower: Olympian) {
  const { damageEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'mighty-swing', 
    tower.specialAbility.duration || 500,
    tower.specialAbility.effectRadius || 3
  );
  
  // Deal damage to all enemies in range
  const damage = tower.damage * (tower.specialAbility.damageMultiplier || 3);
  damageEnemiesInRadius(tower.position, tower.specialAbility.effectRadius || 3, damage);
}

// Transformation (Circe) - Transforms enemies, making them harmless temporarily
function createTransformationEffect(tower: Olympian) {
  const { transformEnemiesInRadius } = useOlympians.getState();
  
  // Create visual effect
  createVisualEffect(
    tower.position, 
    'transformation', 
    tower.specialAbility.duration || 5000,
    tower.specialAbility.effectRadius || 4
  );
  
  // Transform enemies in range
  transformEnemiesInRadius(
    tower.position, 
    tower.specialAbility.effectRadius || 4, 
    tower.specialAbility.duration || 5000
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