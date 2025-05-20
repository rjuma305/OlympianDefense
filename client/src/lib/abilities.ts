import { Ability } from "../types";

// Apollo's abilities (Archer Olympian)
export const apolloAbilities = {
  solarFlare: {
    id: "solar-flare",
    name: "Solar Flare",
    description: "Creates a wide cone burst of radiant damage that hits multiple enemies",
    cooldown: 10000, // 10 seconds
    lastUsed: 0,
    isReady: true,
    effectRadius: 5,
    damageMultiplier: 2.5,
    duration: 3000 // 3 seconds
  } as Ability,
  
  passiveSolarCrit: {
    id: "solar-crit",
    name: "Solar Crit",
    description: "Apollo's attacks have a chance to apply burn damage over time",
    cooldown: 0, // Passive ability
    lastUsed: 0,
    isReady: true,
    damageMultiplier: 1.2,
    duration: 3000 // 3 seconds burn
  } as Ability
};

// Heracles's abilities (Warrior Olympian)
export const heraclesAbilities = {
  mightySwing: {
    id: "mighty-swing",
    name: "Mighty Swing",
    description: "Delivers a devastating blow that damages all enemies in range",
    cooldown: 15000, // 15 seconds
    lastUsed: 0,
    isReady: true,
    effectRadius: 3,
    damageMultiplier: 3,
    duration: 500 // Instant effect with short animation
  } as Ability,
  
  passiveStrength: {
    id: "strength-of-olympus",
    name: "Strength of Olympus",
    description: "Heracles gains increased damage with each successful attack",
    cooldown: 0, // Passive ability
    lastUsed: 0,
    isReady: true,
    damageMultiplier: 1.05, // 5% increase per attack, can stack
    duration: 0 // Permanent effect
  } as Ability
};

// Circe's abilities (Mage Olympian)
export const circeAbilities = {
  transformation: {
    id: "transformation",
    name: "Transformation",
    description: "Transforms enemies into harmless creatures for a short duration",
    cooldown: 20000, // 20 seconds
    lastUsed: 0,
    isReady: true,
    effectRadius: 4,
    duration: 5000 // 5 seconds
  } as Ability,
  
  passiveEnchantment: {
    id: "enchantment",
    name: "Enchantment",
    description: "Circe's attacks have a chance to charm enemies, making them fight for you",
    cooldown: 30000, // 30 seconds between possible charms
    lastUsed: 0,
    isReady: true,
    duration: 8000 // 8 seconds of charm
  } as Ability
};

// Helper function to create ability with the current timestamp
export function createAbility(ability: Ability): Ability {
  return {
    ...ability,
    lastUsed: 0,
    isReady: true
  };
}

// Function to check if an ability is ready
export function isAbilityReady(ability: Ability): boolean {
  const currentTime = Date.now();
  return ability.isReady && (currentTime - ability.lastUsed >= ability.cooldown);
}

// Function to use an ability and set the cooldown
export function useAbility(ability: Ability): Ability {
  return {
    ...ability,
    lastUsed: Date.now(),
    isReady: false
  };
}

// Function to update ability cooldown status
export function updateAbilityCooldown(ability: Ability): Ability {
  const currentTime = Date.now();
  const timeSinceLastUse = currentTime - ability.lastUsed;
  
  if (!ability.isReady && timeSinceLastUse >= ability.cooldown) {
    return {
      ...ability,
      isReady: true
    };
  }
  
  return ability;
}

// Calculate cooldown percentage for UI
export function getAbilityCooldownPercentage(ability: Ability): number {
  if (ability.isReady) return 100;
  
  const currentTime = Date.now();
  const timeSinceLastUse = currentTime - ability.lastUsed;
  const percentage = Math.min(100, (timeSinceLastUse / ability.cooldown) * 100);
  
  return percentage;
}