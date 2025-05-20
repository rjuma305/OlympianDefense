import { create } from "zustand";

interface ResourcesState {
  resources: number;
  
  // Methods
  initializeResources: () => void;
  addResources: (amount: number) => void;
  spendResources: (amount: number) => boolean; // Returns true if successful
  getResources: () => number;
}

export const useResources = create<ResourcesState>((set, get) => {
  return {
    resources: 0,
    
    initializeResources: () => {
      // Give starting resources
      set({ resources: 100 });
    },
    
    addResources: (amount: number) => {
      set(state => ({ 
        resources: state.resources + amount 
      }));
    },
    
    spendResources: (amount: number) => {
      const { resources } = get();
      
      // Check if player has enough resources
      if (resources < amount) {
        return false;
      }
      
      // Subtract resources
      set({ 
        resources: resources - amount 
      });
      
      return true;
    },
    
    getResources: () => {
      return get().resources;
    }
  };
});
