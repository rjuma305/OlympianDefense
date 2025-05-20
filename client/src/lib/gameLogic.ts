import { useOlympians } from "./stores/useOlympians";
import { useWaves } from "./stores/useWaves";
import { useResources } from "./stores/useResources";
import { useProjectiles } from "./stores/useProjectiles";
import { allTowers, heroTowers } from "./towers";
import { Tower, TowerBlueprint, Enemy } from "../types";

// Start the game
export function startGame() {
  const olympiansState = useOlympians.getState();
  
  // Initialize the game state
  olympiansState.initialize();
  
  // Start the game
  olympiansState.startGame();
}

// Start the next wave
export function startNextWave() {
  const wavesState = useWaves.getState();
  wavesState.startNextWave();
}

// Place a tower at position
export function placeTower(position: [number, number, number], blueprintId: string) {
  const olympiansState = useOlympians.getState();
  olympiansState.placeTower(position, blueprintId);
}

// Upgrade a tower
export function upgradeTower(towerId: string) {
  const olympiansState = useOlympians.getState();
  olympiansState.upgradeTower(towerId);
}

// Get tower data by ID
export function getTowerById(towerId: string): Tower | null {
  const { towers } = useOlympians.getState();
  return towers.find(tower => tower.id === towerId) || null;
}

// Get tower blueprint by ID
export function getTowerBlueprintById(blueprintId: string): TowerBlueprint | null {
  return allTowers.find(tower => tower.id === blueprintId) || null;
}

// Get available tower blueprints for purchase
export function getAvailableTowerBlueprints(): TowerBlueprint[] {
  return heroTowers;
}

// Update the game state (call this from the game loop)
export function updateGameState(deltaTime: number) {
  // Update tower attacks and enemy movement
  useOlympians.getState().updateGame(deltaTime);
  
  // Update projectiles
  useProjectiles.getState().updateProjectiles(deltaTime);
}

// Check if player can afford a tower
export function canAffordTower(blueprintId: string): boolean {
  const resources = useResources.getState().getResources();
  const blueprint = getTowerBlueprintById(blueprintId);
  
  if (!blueprint) return false;
  
  return resources >= blueprint.cost;
}

// Check if player can afford to upgrade a tower
export function canAffordUpgrade(towerId: string): boolean {
  const tower = getTowerById(towerId);
  const resources = useResources.getState().getResources();
  
  if (!tower) return false;
  
  return resources >= tower.upgradeCost && tower.upgradeName !== null;
}

// Get the upgrade cost for a tower
export function getUpgradeCost(towerId: string): number {
  const tower = getTowerById(towerId);
  return tower?.upgradeCost || 0;
}

// Get the next upgrade name for a tower
export function getUpgradeName(towerId: string): string | null {
  const tower = getTowerById(towerId);
  return tower?.upgradeName;
}

// Get all enemies
export function getEnemies(): Enemy[] {
  return useOlympians.getState().enemies;
}
