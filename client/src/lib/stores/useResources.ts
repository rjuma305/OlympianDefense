import { create } from 'zustand';

interface ResourcesState {
  resources: number;
  increment: (amount: number) => void;
  decrement: (amount: number) => void;
  canAfford: (cost: number) => boolean;
  spendResources: (amount: number) => boolean;
  reset: () => void;
}

export const useResources = create<ResourcesState>((set, get) => ({
  resources: 100,
  
  increment: (amount: number) => {
    set(state => ({ resources: state.resources + amount }));
  },
  
  decrement: (amount: number) => {
    set(state => ({ resources: Math.max(0, state.resources - amount) }));
  },
  
  canAfford: (cost: number) => {
    return get().resources >= cost;
  },
  
  spendResources: (amount: number) => {
    const { resources, decrement } = get();
    
    if (resources >= amount) {
      decrement(amount);
      return true;
    }
    
    return false;
  },
  
  reset: () => {
    set({ resources: 100 });
  },
  
  initializeResources: () => {
    set({ resources: 100 });
  }
}));