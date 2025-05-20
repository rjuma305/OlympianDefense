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

// Artemis talent tree
const artemisTalentTree: TalentTree = {
  name: 'Artemis',
  description: 'Master of the hunt and ranged combat',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'sharp_focus',
          name: 'Sharp Focus',
          description: 'Artemis gains +15% crit chance against bosses.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.bossCritBoost = true;
          }
        },
        {
          id: 'eagle_eye',
          name: 'Eagle Eye',
          description: 'Increases range by +40px.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.range += 40;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'hunter_surge',
          name: 'Hunter\'s Surge',
          description: 'Every 20 seconds, fires a guaranteed crit arrow.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'sharp_focus',
          effect: (tower: Olympian) => {
            tower.hunterSurgeEnabled = true;
          }
        }
      ]
    }
  ]
};

// Hera talent tree
const heraTalentTree: TalentTree = {
  name: 'Hera',
  description: 'Queen of the gods with divine influence',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'divine_charm',
          name: 'Divine Charm',
          description: 'Enemies near Hera occasionally pause movement (2s).',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.areaCharmEffect = true;
          }
        },
        {
          id: 'loyal_servants',
          name: 'Loyal Servants',
          description: 'Summons spirit minions every 60 seconds to distract enemies.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.summonsMinions = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'queen_wrath',
          name: 'Queen\'s Wrath',
          description: 'Deals AoE mind damage when activated, stunning all enemies briefly.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'divine_charm',
          effect: (tower: Olympian) => {
            tower.canStunAoE = true;
          }
        }
      ]
    }
  ]
};

// Ares talent tree
const aresTalentTree: TalentTree = {
  name: 'Ares',
  description: 'God of war with devastating combat abilities',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'rage_strike',
          name: 'Rage Strike',
          description: 'Attacks deal 20% more damage when HP is below 50%.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.rageStrike = true;
          }
        },
        {
          id: 'berserker_howl',
          name: 'Berserker Howl',
          description: 'Nearby towers gain +10% fire rate.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.berserkerBuff = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'war_god',
          name: 'War God\'s Wrath',
          description: 'Unleashes a battlefield roar every 30s, stunning all enemies in range.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'rage_strike',
          effect: (tower: Olympian) => {
            tower.canWarRoar = true;
          }
        }
      ]
    }
  ]
};

// Hermes talent tree
const hermesTalentTree: TalentTree = {
  name: 'Hermes',
  description: 'God of speed and travel',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'haste_field',
          name: 'Haste Field',
          description: 'Boosts nearby towers\' speed by 15%.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.hasteAura = true;
          }
        },
        {
          id: 'blink_step',
          name: 'Blink Step',
          description: 'Hermes can teleport to a new location every 30s.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.canBlinkStep = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'chaos_dance',
          name: 'Chaos Dance',
          description: 'Enemies in range suffer random movement jitters every 15s.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'haste_field',
          effect: (tower: Olympian) => {
            tower.triggersChaosDance = true;
          }
        }
      ]
    }
  ]
};

// Nyx talent tree
const nyxTalentTree: TalentTree = {
  name: 'Nyx',
  description: 'Goddess of night and darkness',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'shadow_cloak',
          name: 'Shadow Cloak',
          description: 'Nyx becomes invisible to enemies between attacks.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.isCloaked = true;
          }
        },
        {
          id: 'night_blade',
          name: 'Night Blade',
          description: 'Attacks apply a stacking debuff that reduces enemy damage output.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.appliesNightBlade = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'veil_of_void',
          name: 'Veil of the Void',
          description: 'Every 45s, Nyx casts a field of darkness, blinding enemies in range for 3s.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'shadow_cloak',
          effect: (tower: Olympian) => {
            tower.canCastVoidVeil = true;
          }
        }
      ]
    }
  ]
};

// Hestia talent tree
const hestiaTalentTree: TalentTree = {
  name: 'Hestia',
  description: 'Goddess of the hearth and home',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'hearth_shield',
          name: 'Hearth Shield',
          description: 'Allied towers near Hestia gain +5% defense.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.hasHearthShield = true;
          }
        },
        {
          id: 'warmth_zone',
          name: 'Warmth Zone',
          description: 'Hestia slowly regenerates favor when not attacking.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.regensFavor = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'pillar_of_flame',
          name: 'Pillar of Flame',
          description: 'Every 30s, Hestia creates a burning zone dealing AoE damage.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'hearth_shield',
          effect: (tower: Olympian) => {
            tower.canCastPillarOfFlame = true;
          }
        }
      ]
    }
  ]
};

// Dionysus talent tree
const dionysusTalentTree: TalentTree = {
  name: 'Dionysus',
  description: 'God of wine and festivity',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'drunken_swirl',
          name: 'Drunken Swirl',
          description: 'Enemies hit by Dionysus may stagger and change direction.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.appliesStagger = true;
          }
        },
        {
          id: 'grapeburst',
          name: 'Grape Burst',
          description: 'Splash attacks do +10% more damage in small radius.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.grapeburstSplash = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'festival_madness',
          name: 'Festival Madness',
          description: 'Every 40s, causes all enemies on screen to dance in place for 3s.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'drunken_swirl',
          effect: (tower: Olympian) => {
            tower.canTriggerMadness = true;
          }
        }
      ]
    }
  ]
};

// Hecate talent tree
const hecateTalentTree: TalentTree = {
  name: 'Hecate',
  description: 'Goddess of magic and witchcraft',
  tiers: [
    {
      name: 'Tier 1',
      options: [
        {
          id: 'witchfire',
          name: 'Witchfire',
          description: 'Basic attacks deal dark + fire damage combo.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.witchfire = true;
          }
        },
        {
          id: 'hex_mark',
          name: 'Hex Mark',
          description: 'Enemies hit by Hecate have reduced resistances.',
          cost: 100,
          isUnlocked: false,
          effect: (tower: Olympian) => {
            tower.appliesHex = true;
          }
        }
      ]
    },
    {
      name: 'Tier 2',
      options: [
        {
          id: 'triple_moon',
          name: 'Triple Moon Rite',
          description: 'Every 50s, Hecate opens a portal summoning a burst of spirit fire from three angles.',
          cost: 200,
          isUnlocked: false,
          prerequisite: 'witchfire',
          effect: (tower: Olympian) => {
            tower.canCastTripleMoon = true;
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
  water: poseidonTalentTree,
  huntress: artemisTalentTree, // New tower type for Artemis
  queen: heraTalentTree,       // New tower type for Hera
  warlord: aresTalentTree,     // New tower type for Ares
  swift: hermesTalentTree,     // New tower type for Hermes
  shadow: nyxTalentTree,       // New tower type for Nyx
  hearth: hestiaTalentTree,    // New tower type for Hestia
  wine: dionysusTalentTree,    // New tower type for Dionysus
  witch: hecateTalentTree      // New tower type for Hecate
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