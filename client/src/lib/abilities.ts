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

// Aphrodite's abilities (Enchanter Olympian)
export const aphroditeAbilities = {
  charmAura: {
    id: "charm-aura",
    name: "Charm Aura",
    description: "Creates an aura of attraction that slows all enemies in range",
    cooldown: 18000, // 18 seconds
    lastUsed: 0,
    isReady: true,
    effectRadius: 6,
    duration: 6000, // 6 seconds slow effect
    slowMultiplier: 0.5 // Enemies move at 50% speed
  } as Ability,
  
  passiveHeartbreak: {
    id: "heartbreak",
    name: "Heartbreak",
    description: "Aphrodite's attacks have a chance to make enemies temporarily attack each other",
    cooldown: 25000, // 25 seconds between triggers
    lastUsed: 0,
    isReady: true,
    duration: 4000 // 4 seconds of confusion
  } as Ability
};

// Zeus's abilities (Lightning Olympian)
export const zeusAbilities = {
  chainLightning: {
    id: "chain-lightning",
    name: "Chain Lightning",
    description: "Unleashes lightning that chains between multiple enemies",
    cooldown: 12000, // 12 seconds
    lastUsed: 0,
    isReady: true,
    chainCount: 5, // Hits 5 targets
    damageMultiplier: 1.8,
    duration: 2000 // 2 second visual effect
  } as Ability,
  
  passiveThunderstrike: {
    id: "thunderstrike",
    name: "Thunderstrike",
    description: "Zeus's attacks have a chance to call down additional lightning strikes",
    cooldown: 8000, // 8 seconds between possible triggers
    lastUsed: 0,
    isReady: true,
    damageMultiplier: 1.5,
    duration: 500 // Nearly instant effect
  } as Ability
};

// Poseidon's abilities (Water Olympian)
export const poseidonAbilities = {
  tidalWave: {
    id: "tidal-wave",
    name: "Tidal Wave",
    description: "Releases a massive wave that damages and pushes back enemies",
    cooldown: 15000, // 15 seconds
    lastUsed: 0,
    isReady: true,
    effectRadius: 7,
    damageMultiplier: 2.2,
    knockbackDistance: 3, // Pushes enemies back 3 units
    duration: 1500 // 1.5 second effect
  } as Ability,
  
  passiveUndertow: {
    id: "undertow",
    name: "Undertow",
    description: "Poseidon's attacks slow enemies and have a chance to temporarily stun them",
    cooldown: 20000, // 20 seconds between possible stuns
    lastUsed: 0,
    isReady: true,
    duration: 2000 // 2 seconds of stun
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