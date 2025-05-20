import React, { useEffect, useState } from 'react';
import { ResourceDropEffect } from './ResourceDropEffect';
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
  
  // Create a mock test drop to verify the component works
  useEffect(() => {
    // Testing function - create a test resource drop every few seconds
    const createTestDrop = () => {
      const resourceTypes = [ResourceType.TRIBUTE, ResourceType.ESSENCE, ResourceType.RELIC_SHARD];
      const randomType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const randomAmount = Math.floor(Math.random() * 10) + 1;
      
      const position: [number, number, number] = [
        Math.random() * 10 - 5,  // x between -5 and 5
        1,                       // y at height 1
        Math.random() * 10 - 5   // z between -5 and 5
      ];
      
      const dropId = `drop-${Date.now()}-${Math.random()}`;
      
      const newDrop: ResourceDrop = {
        id: dropId,
        position,
        resourceType: randomType,
        amount: randomAmount
      };
      
      setDrops(current => [...current, newDrop]);
    };
    
    // Create a test drop every 5 seconds
    const interval = setInterval(createTestDrop, 5000);
    
    // Initial test drop
    createTestDrop();
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
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