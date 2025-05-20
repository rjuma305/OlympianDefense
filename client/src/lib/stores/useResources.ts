import { create } from 'zustand';
import { ResourceType } from '../resources';
import { Ability, Olympian, Tower } from '../../types';
import { 
  canAffordTower, 
  canAffordUpgrade, 
  canAffordAbility, 
  getAbilityCost,
  getTowerCost,
  getUpgradeCost
} from '../resources';

export interface ResourcesState {
  // Resource values
  [ResourceType.TRIBUTE]: number;
  [ResourceType.ESSENCE]: number;
  [ResourceType.RELIC_SHARD]: number;
  
  // Resource actions
  earnTribute: (amount: number) => void;
  earnEssence: (amount: number) => void;
  earnRelicShard: (amount: number) => void;
  
  // Spending resources
  spendTributeForTower: (towerType: string) => boolean;
  spendTributeForUpgrade: (tower: Tower) => boolean;
  spendEssenceForAbility: (olympian: Olympian, ability: Ability) => boolean;
  spendRelicShardsForUnlock: (amount: number) => boolean;
  
  // Cost checking helpers
  canAffordTowerPlacement: (towerType: string) => boolean;
  canAffordTowerUpgrade: (tower: Tower) => boolean;
  canAffordAbilityUse: (olympian: Olympian, ability: Ability) => boolean;
  
  // Reset resources for new game
  resetResources: () => void;
}

const initialState = {
  [ResourceType.TRIBUTE]: 100,    // Starting tribute
  [ResourceType.ESSENCE]: 20,     // Starting essence
  [ResourceType.RELIC_SHARD]: 0   // Starting with no relic shards
};

export const useResources = create<ResourcesState>((set, get) => ({
  // Initial resource values
  ...initialState,
  
  // Earning resources
  earnTribute: (amount: number) => {
    set((state) => ({
      [ResourceType.TRIBUTE]: state[ResourceType.TRIBUTE] + amount
    }));
  },
  
  earnEssence: (amount: number) => {
    set((state) => ({
      [ResourceType.ESSENCE]: state[ResourceType.ESSENCE] + amount
    }));
  },
  
  earnRelicShard: (amount: number) => {
    set((state) => ({
      [ResourceType.RELIC_SHARD]: state[ResourceType.RELIC_SHARD] + amount
    }));
  },
  
  // Spending resources
  spendTributeForTower: (towerType: string) => {
    const currentTribute = get()[ResourceType.TRIBUTE];
    const cost = getTowerCost(towerType);
    
    if (currentTribute >= cost) {
      set((state) => ({
        [ResourceType.TRIBUTE]: state[ResourceType.TRIBUTE] - cost
      }));
      return true;
    }
    
    return false;
  },
  
  spendTributeForUpgrade: (tower: Tower) => {
    const currentTribute = get()[ResourceType.TRIBUTE];
    const cost = getUpgradeCost(tower);
    
    if (currentTribute >= cost) {
      set((state) => ({
        [ResourceType.TRIBUTE]: state[ResourceType.TRIBUTE] - cost
      }));
      return true;
    }
    
    return false;
  },
  
  spendEssenceForAbility: (olympian: Olympian, ability: Ability) => {
    const currentEssence = get()[ResourceType.ESSENCE];
    const cost = getAbilityCost(olympian.id);
    
    if (currentEssence >= cost) {
      set((state) => ({
        [ResourceType.ESSENCE]: state[ResourceType.ESSENCE] - cost
      }));
      return true;
    }
    
    return false;
  },
  
  spendRelicShardsForUnlock: (amount: number) => {
    const currentShards = get()[ResourceType.RELIC_SHARD];
    
    if (currentShards >= amount) {
      set((state) => ({
        [ResourceType.RELIC_SHARD]: state[ResourceType.RELIC_SHARD] - amount
      }));
      return true;
    }
    
    return false;
  },
  
  // Cost checking helpers
  canAffordTowerPlacement: (towerType: string) => {
    return canAffordTower(towerType, get()[ResourceType.TRIBUTE]);
  },
  
  canAffordTowerUpgrade: (tower: Tower) => {
    return canAffordUpgrade(tower, get()[ResourceType.TRIBUTE]);
  },
  
  canAffordAbilityUse: (olympian: Olympian, ability: Ability) => {
    return canAffordAbility(olympian, ability, get()[ResourceType.ESSENCE]);
  },
  
  // Reset resources for new game
  resetResources: () => {
    set(initialState);
  }
}));