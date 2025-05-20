import { nanoid } from 'nanoid';
import { Olympian, Tower } from '../types';
import { useOlympians } from './stores/useOlympians';
import { useResources } from './stores/useResources';

// Define talent tree structure
export interface Talent {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: (tower: Olympian) => void;
  isUnlocked: boolean;
  prerequisite?: string;
}

export interface TalentTier {
  name: string;
  options: Talent[];
}

export interface TalentTree {
  name: string;
  description: string;
  tiers: TalentTier[];
}

// Zeus/Apollo talent tree (archer type)
const apolloTalentTree: TalentTree = {
  name: 'Apollo',
  description: 'Master of solar abilities and archery',
  tiers: [
    {
      name: 'Solar Mastery',
      options: [
        {
          id: 'solar_crit',
          name: 'Solar Crit',
          description: 'Attacks have a 15% chance to apply burn damage over time',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.damage *= 1.2;
          }
        },
        {
          id: 'solar_range',
          name: 'Radiant Reach',
          description: 'Increases attack range by 20%',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.range *= 1.2;
          }
        }
      ]
    },
    {
      name: 'Divine Power',
      options: [
        {
          id: 'solar_flare_upgrade',
          name: 'Improved Solar Flare',
          description: 'Solar Flare ability deals 50% more damage',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'solar_crit',
          effect: (tower: Olympian) => {
            if (tower.specialAbility) {
              tower.specialAbility.damageMultiplier = (tower.specialAbility.damageMultiplier || 2.5) * 1.5;
            }
          }
        },
        {
          id: 'apollo_speed',
          name: 'Divine Speed',
          description: 'Increases attack speed by 30%',
          cost: 200,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.attackSpeed *= 1.3;
          }
        }
      ]
    }
  ]
};

// Heracles talent tree (warrior type)
const heraclesTalentTree: TalentTree = {
  name: 'Heracles',
  description: 'Master of strength and melee combat',
  tiers: [
    {
      name: 'Olympian Strength',
      options: [
        {
          id: 'mighty_blow',
          name: 'Mighty Blow',
          description: 'Attacks have a 20% chance to deal double damage',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.damage *= 1.4;
          }
        },
        {
          id: 'fortitude',
          name: 'Godly Fortitude',
          description: 'Tower gains increased area of effect',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.range *= 1.15;
          }
        }
      ]
    },
    {
      name: 'Heroic Legacy',
      options: [
        {
          id: 'mighty_swing_upgrade',
          name: 'Enhanced Mighty Swing',
          description: 'Mighty Swing ability has 30% shorter cooldown',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'mighty_blow',
          effect: (tower: Olympian) => {
            if (tower.specialAbility) {
              tower.specialAbility.cooldown *= 0.7;
            }
          }
        },
        {
          id: 'heracles_strength',
          name: 'Strength of Heracles',
          description: 'All attacks cleave, hitting up to 3 enemies at once',
          cost: 200,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.damage *= 1.25;
          }
        }
      ]
    }
  ]
};

// Circe talent tree (mage type)
const circeTalentTree: TalentTree = {
  name: 'Circe',
  description: 'Master of transformation and enchantment',
  tiers: [
    {
      name: 'Arcane Arts',
      options: [
        {
          id: 'enchantment',
          name: 'Enchantment',
          description: 'Attacks have a 10% chance to charm enemies briefly',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.damage *= 1.15;
          }
        },
        {
          id: 'arcane_reach',
          name: 'Arcane Reach',
          description: 'Increases attack range by 25%',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.range *= 1.25;
          }
        }
      ]
    },
    {
      name: 'Divine Sorcery',
      options: [
        {
          id: 'transformation_upgrade',
          name: 'Greater Transformation',
          description: 'Transformation ability affects 50% more enemies',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'enchantment',
          effect: (tower: Olympian) => {
            if (tower.specialAbility) {
              tower.specialAbility.effectRadius = (tower.specialAbility.effectRadius || 4) * 1.5;
            }
          }
        },
        {
          id: 'circe_speed',
          name: 'Magical Efficiency',
          description: 'Increases attack speed by 25% and damage by 15%',
          cost: 200,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.attackSpeed *= 1.25;
            tower.damage *= 1.15;
          }
        }
      ]
    }
  ]
};

// Aphrodite talent tree (enchanter type)
const aphroditeTalentTree: TalentTree = {
  name: 'Aphrodite',
  description: 'Master of charm and emotional manipulation',
  tiers: [
    {
      name: 'Divine Beauty',
      options: [
        {
          id: "charm_boost",
          name: "Enhanced Charm",
          description: "Charm projectiles slow enemies 25% more.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.damage *= 1.15;
            // In a full implementation, we'd add slowAmount property
          }
        },
        {
          id: "heart_range",
          name: "Wider Heart",
          description: "Increases charm range by 30%.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.range *= 1.3;
          }
        }
      ]
    },
    {
      name: 'Emotional Control',
      options: [
        {
          id: "love_aura",
          name: "Love Aura",
          description: "Creates an aura that slows nearby enemies even when not firing.",
          cost: 200,
          isUnlocked: false,
          prerequisite: "charm_boost",
          effect: (tower: Olympian) => {
            // In a full implementation, we'd set hasAura property
            tower.range *= 1.15;
            tower.damage *= 1.1;
          }
        }
      ]
    }
  ]
};

// Zeus talent tree (lightning type)
const zeusTalentTree: TalentTree = {
  name: 'Zeus',
  description: 'Master of lightning and thunder',
  tiers: [
    {
      name: 'Thunderlord',
      options: [
        {
          id: "chain_amp",
          name: "Amped Arcs",
          description: "Chain lightning hits additional targets.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            // In a full implementation, we'd add chainTargets property
            tower.damage *= 1.2;
          }
        },
        {
          id: "storm_build",
          name: "Storm Charge",
          description: "Lightning builds AoE damage over time.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            // In a full implementation, we'd set buildsStorm property
            tower.attackSpeed *= 1.15;
          }
        }
      ]
    }
  ]
};

// Poseidon talent tree (water type)
const poseidonTalentTree: TalentTree = {
  name: 'Poseidon',
  description: 'Master of the seas and tidal forces',
  tiers: [
    {
      name: 'Ocean Power',
      options: [
        {
          id: "wave_pushback",
          name: "Crashing Wave",
          description: "Tidal attacks push enemies back slightly.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            // In a full implementation, we'd set knockbackEnabled property
            tower.damage *= 1.15;
          }
        },
        {
          id: "spray_arc",
          name: "Spray Arc",
          description: "Poseidon's attacks hit in a cone area.",
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            // In a full implementation, we'd set hasArcSplash property
            tower.range *= 1.2;
          }
        }
      ]
    },
    {
      name: 'Tidal Mastery',
      options: [
        {
          id: "tidal_surge",
          name: "Tidal Surge",
          description: "Every 30 seconds, launches a massive AoE wave.",
          cost: 200,
          isUnlocked: false,
          prerequisite: "wave_pushback",
          effect: (tower: Olympian) => {
            // In a full implementation, we'd set canTidalSurge property
            tower.attackSpeed *= 1.2;
            tower.damage *= 1.1;
          }
        }
      ]
    }
  ]
};

// Map tower types to their talent trees
export const talentTrees: Record<string, TalentTree> = {
  archer: apolloTalentTree,
  warrior: heraclesTalentTree,
  mage: circeTalentTree,
  enchanter: aphroditeTalentTree,
  lightning: zeusTalentTree,
  water: poseidonTalentTree
};

// Apply a talent to a tower
export function applyTalent(towerType: string, talentId: string, towerId: string): boolean {
  const { towers } = useOlympians.getState();
  const { spendResources } = useResources.getState();
  
  // Find the tower to upgrade
  const towerIndex = towers.findIndex(t => t.id === towerId);
  if (towerIndex === -1) return false;
  
  const tower = towers[towerIndex];
  if (tower.tier !== 'olympian') return false;
  
  const olympianTower = tower as Olympian;
  
  // Find the talent in the appropriate tree
  const tree = talentTrees[towerType];
  if (!tree) return false;
  
  let foundTalent: Talent | null = null;
  let prerequisiteMet = true;
  
  for (const tier of tree.tiers) {
    for (const talent of tier.options) {
      if (talent.id === talentId) {
        foundTalent = talent;
        
        // Check if prerequisite is met
        if (talent.prerequisite) {
          prerequisiteMet = tree.tiers.some(t => 
            t.options.some(o => o.id === talent.prerequisite && o.isUnlocked)
          );
        }
        break;
      }
    }
    
    if (foundTalent) break;
  }
  
  if (!foundTalent || !prerequisiteMet) return false;
  
  // Check if player can afford the talent
  if (!spendResources(foundTalent.cost)) return false;
  
  // Apply the talent effect
  foundTalent.effect(olympianTower);
  foundTalent.isUnlocked = true;
  
  // Update the tower in the state
  const updatedTowers = [...towers];
  updatedTowers[towerIndex] = olympianTower;
  useOlympians.setState({ towers: updatedTowers });
  
  return true;
}