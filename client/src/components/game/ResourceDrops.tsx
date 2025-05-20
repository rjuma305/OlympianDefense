import React, { useEffect, useState } from 'react';
import { ResourceDropEffect } from './ResourceDropEffect';
import { useEvents } from '../../lib/stores/useEvents';
import { ResourceType } from '../../lib/resources';

// Represents a single resource drop in the game world
interface ResourceDrop {
  id: string;
  position: [number, number, number];
  resourceType: ResourceType;
  amount: number;
}

export function ResourceDrops() {
  const [drops, setDrops] = useState<ResourceDrop[]>([]);
  const { subscribe } = useEvents();
  
  // Subscribe to enemy death events to show resource drops
  useEffect(() => {
    // Clean up function for removing completed resource drops
    const removeResourceDrop = (id: string) => {
      setDrops(current => current.filter(drop => drop.id !== id));
    };
    
    // Listen for enemy defeated events 
    const unsubscribe = subscribe('enemyDefeated', (data: any) => {
      if (!data.resourceDrops || !data.position) return;
      
      // Process each resource drop from the enemy
      data.resourceDrops.forEach((drop: { type: ResourceType; amount: number }, index: number) => {
        if (drop.amount <= 0) return;
        
        const newDrop: ResourceDrop = {
          id: `${data.enemyId}-${drop.type}-${index}`,
          position: data.position,
          resourceType: drop.type,
          amount: drop.amount
        };
        
        setDrops(current => [...current, newDrop]);
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [subscribe]);
  
  return (
    <>
      {drops.map(drop => (
        <ResourceDropEffect
          key={drop.id}
          position={drop.position}
          resourceType={drop.resourceType}
          amount={drop.amount}
          onComplete={() => setDrops(current => current.filter(d => d.id !== drop.id))}
        />
      ))}
    </>
  );
}