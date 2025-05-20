import { create } from "zustand";
import { nanoid } from "nanoid";
import { Projectile, Effect } from "../../types";
import { useOlympians } from "./useOlympians";

interface ProjectilesState {
  projectiles: Projectile[];
  
  // Methods
  createProjectile: (data: Omit<Projectile, "id" | "createdAt">) => void;
  updateProjectiles: (deltaTime: number) => void;
  removeProjectile: (id: string) => void;
  createEffect: (position: [number, number, number], type: string, duration: number) => void;
}

export const useProjectiles = create<ProjectilesState>((set, get) => {
  return {
    projectiles: [],
    
    createProjectile: (data) => {
      const projectile: Projectile = {
        id: nanoid(),
        position: [...data.position],
        target: data.target,
        damage: data.damage,
        speed: data.speed,
        type: data.type,
        fromTower: data.fromTower,
        createdAt: Date.now()
      };
      
      set(state => ({ 
        projectiles: [...state.projectiles, projectile] 
      }));
    },
    
    updateProjectiles: (deltaTime: number) => {
      const { projectiles } = get();
      const { enemies } = useOlympians.getState();
      
      const updatedProjectiles = projectiles.filter(projectile => {
        // Find target enemy
        const target = enemies.find(e => e.id === projectile.target);
        
        // If target doesn't exist or is dead, remove projectile
        if (!target || target.isDead) {
          return false;
        }
        
        // Calculate direction to target
        const dx = target.position[0] - projectile.position[0];
        const dy = target.position[1] - projectile.position[1];
        const dz = target.position[2] - projectile.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Check for hit
        if (distance < 0.5) {
          // Damage enemy
          target.health -= projectile.damage;
          
          // Check if enemy is now dead
          if (target.health <= 0) {
            target.isDead = true;
          }
          
          // Create hit effect
          get().createEffect(target.position, "hit", 500);
          
          // Remove projectile
          return false;
        }
        
        // Move projectile towards target
        const moveSpeed = projectile.speed * deltaTime;
        const moveDistanceRatio = Math.min(1, moveSpeed / distance);
        
        projectile.position = [
          projectile.position[0] + dx * moveDistanceRatio,
          projectile.position[1] + dy * moveDistanceRatio,
          projectile.position[2] + dz * moveDistanceRatio
        ];
        
        // Keep projectile if it hasn't hit and is less than 5 seconds old
        return Date.now() - projectile.createdAt < 5000;
      });
      
      set({ projectiles: updatedProjectiles });
    },
    
    removeProjectile: (id: string) => {
      set(state => ({
        projectiles: state.projectiles.filter(p => p.id !== id)
      }));
    },
    
    createEffect: (position: [number, number, number], type: string, duration: number) => {
      const { effects } = useOlympians.getState();
      
      const effect: Effect = {
        id: nanoid(),
        position,
        type,
        duration,
        createdAt: Date.now()
      };
      
      // Add effect to the state
      useOlympians.setState({ 
        effects: [...effects, effect] 
      });
    }
  };
});
