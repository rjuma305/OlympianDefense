import { TowerBlueprint } from "../types";

// Hero tier towers (starter towers)
export const heroTowers: TowerBlueprint[] = [
  {
    id: "archer",
    name: "Archer",
    tier: "hero",
    type: "archer",
    damage: 10,
    range: 8,
    attackSpeed: 1, // 1 attack per second
    cost: 50,
    upgradeCost: 100,
    upgradeName: "Marksman",
    description: "Ranged attacker with good range and attack speed.",
    color: "#8bc34a" // Light green
  },
  {
    id: "warrior",
    name: "Warrior",
    tier: "hero",
    type: "warrior",
    damage: 25,
    range: 3,
    attackSpeed: 0.7, // 0.7 attacks per second
    cost: 75,
    upgradeCost: 150,
    upgradeName: "Hoplite",
    description: "Strong melee attacker with high damage but short range.",
    color: "#f44336" // Red
  },
  {
    id: "mage",
    name: "Mage",
    tier: "hero",
    type: "mage",
    damage: 15,
    range: 6,
    attackSpeed: 0.8, // 0.8 attacks per second
    cost: 65,
    upgradeCost: 125,
    upgradeName: "Sorcerer",
    description: "Magical attacker with area of effect damage.",
    color: "#2196f3" // Blue
  },
  {
    id: "enchanter",
    name: "Enchanter",
    tier: "hero",
    type: "enchanter",
    damage: 8,
    range: 7,
    attackSpeed: 1.2, // 1.2 attacks per second
    cost: 70,
    upgradeCost: 140,
    upgradeName: "Charmer",
    description: "Crowd control specialist that can slow and charm enemies.",
    color: "#E91E63" // Pink
  },
  {
    id: "thunderer",
    name: "Thunderer",
    tier: "hero",
    type: "lightning",
    damage: 12,
    range: 5,
    attackSpeed: 0.9, // 0.9 attacks per second
    cost: 60,
    upgradeCost: 120,
    upgradeName: "Storm Caller",
    description: "Harnesses lightning to strike multiple targets in a chain.",
    color: "#FFC107" // Amber
  },
  {
    id: "tide",
    name: "Tide Caller",
    tier: "hero",
    type: "water",
    damage: 18,
    range: 4,
    attackSpeed: 0.8, // 0.8 attacks per second
    cost: 65,
    upgradeCost: 130,
    upgradeName: "Wave Mage",
    description: "Manipulates water to push back and damage enemies.",
    color: "#03A9F4" // Light Blue
  }
];

// Demigod tier towers (mid-tier upgrades)
export const demigodTowers: TowerBlueprint[] = [
  {
    id: "marksman",
    name: "Marksman",
    tier: "demigod",
    type: "archer",
    damage: 25,
    range: 10.4,
    attackSpeed: 1.2,
    cost: 150,
    upgradeCost: 300,
    upgradeName: "Apollo",
    description: "Skilled archer with enhanced range and speed.",
    color: "#4caf50" // Green
  },
  {
    id: "hoplite",
    name: "Hoplite",
    tier: "demigod",
    type: "warrior",
    damage: 62.5,
    range: 3.9,
    attackSpeed: 0.84,
    cost: 225,
    upgradeCost: 450,
    upgradeName: "Heracles",
    description: "Elite warrior with devastating melee attacks.",
    color: "#d32f2f" // Dark red
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    tier: "demigod",
    type: "mage",
    damage: 37.5,
    range: 7.8,
    attackSpeed: 0.96,
    cost: 190,
    upgradeCost: 375,
    upgradeName: "Circe",
    description: "Powerful mage with magical area attacks.",
    color: "#1976d2" // Dark blue
  },
  {
    id: "charmer",
    name: "Charmer",
    tier: "demigod",
    type: "enchanter",
    damage: 20,
    range: 9.1,
    attackSpeed: 1.44,
    cost: 210,
    upgradeCost: 420,
    upgradeName: "Aphrodite",
    description: "Master of attraction with the ability to charm enemies into temporary confusion.",
    color: "#C2185B" // Darker pink
  },
  {
    id: "stormcaller",
    name: "Storm Caller",
    tier: "demigod",
    type: "lightning",
    damage: 30,
    range: 6.5,
    attackSpeed: 1.08,
    cost: 180,
    upgradeCost: 360,
    upgradeName: "Zeus",
    description: "Commands powerful thunderstorms that chain between enemies.",
    color: "#FF8F00" // Darker amber
  },
  {
    id: "wavemage",
    name: "Wave Mage",
    tier: "demigod",
    type: "water",
    damage: 45,
    range: 5.2,
    attackSpeed: 0.96,
    cost: 195,
    upgradeCost: 390,
    upgradeName: "Poseidon",
    description: "Controls currents and tides to push enemies backward.",
    color: "#0288D1" // Darker blue
  }
];

// Olympian tier towers (final upgrades)
export const olympianTowers: TowerBlueprint[] = [
  {
    id: "apollo",
    name: "Apollo",
    tier: "olympian",
    type: "archer",
    damage: 75,
    range: 15.6,
    attackSpeed: 1.8,
    cost: 450,
    upgradeCost: 0,
    upgradeName: null,
    description: "God of archery with deadly precision and sun powers.",
    color: "#ffd700" // Gold
  },
  {
    id: "heracles",
    name: "Heracles",
    tier: "olympian",
    type: "warrior",
    damage: 187.5,
    range: 5.85,
    attackSpeed: 1.26,
    cost: 675,
    upgradeCost: 0,
    upgradeName: null,
    description: "Legendary hero with godlike strength and endurance.",
    color: "#b71c1c" // Very dark red
  },
  {
    id: "circe",
    name: "Circe",
    tier: "olympian",
    type: "mage",
    damage: 112.5,
    range: 11.7,
    attackSpeed: 1.44,
    cost: 565,
    upgradeCost: 0,
    upgradeName: null,
    description: "Enchantress with powerful transformation magic.",
    color: "#0d47a1" // Very dark blue
  },
  {
    id: "aphrodite",
    name: "Aphrodite",
    tier: "olympian",
    type: "enchanter",
    damage: 60,
    range: 13.7,
    attackSpeed: 2.16,
    cost: 630,
    upgradeCost: 0,
    upgradeName: null,
    description: "Goddess of love who charms enemies and can control emotional states.",
    color: "#880E4F" // Very dark pink
  },
  {
    id: "zeus",
    name: "Zeus",
    tier: "olympian",
    type: "lightning",
    damage: 90,
    range: 9.75,
    attackSpeed: 1.62,
    cost: 540,
    upgradeCost: 0,
    upgradeName: null,
    description: "King of gods who wields devastating lightning bolts and chain strikes.",
    color: "#E65100" // Very dark amber
  },
  {
    id: "poseidon",
    name: "Poseidon",
    tier: "olympian",
    type: "water",
    damage: 135,
    range: 7.8,
    attackSpeed: 1.44,
    cost: 585,
    upgradeCost: 0,
    upgradeName: null,
    description: "God of the sea who creates massive tidal waves and water barriers.",
    color: "#01579B" // Very dark blue
  }
];

// All towers combined
export const allTowers = [...heroTowers, ...demigodTowers, ...olympianTowers];
