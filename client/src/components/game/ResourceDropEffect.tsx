import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { ResourceType } from '../../lib/resources';
import * as THREE from 'three';

interface ResourceDropEffectProps {
  position: [number, number, number];
  resourceType: ResourceType;
  amount: number;
  onComplete: () => void;
}

export function ResourceDropEffect({ 
  position, 
  resourceType, 
  amount, 
  onComplete 
}: ResourceDropEffectProps) {
  const group = useRef<THREE.Group>(null);
  const elapsedTime = useRef(0);
  const duration = 1.5; // Effect lasts for 1.5 seconds
  
  // Colors for each resource type
  const resourceColors = {
    [ResourceType.TRIBUTE]: '#FFD700', // Gold for tribute
    [ResourceType.ESSENCE]: '#7DF9FF', // Bright blue for essence
    [ResourceType.RELIC_SHARD]: '#DA70D6' // Purple for relic shards
  };
  
  // Resource symbols
  const resourceSymbols = {
    [ResourceType.TRIBUTE]: '+',
    [ResourceType.ESSENCE]: '*',
    [ResourceType.RELIC_SHARD]: '◆'
  };
  
  // Set initial position and trigger animation
  useEffect(() => {
    if (group.current) {
      group.current.position.set(position[0], position[1] + 1, position[2]);
    }
  }, [position]);
  
  // Animate the resource drop
  useFrame((_, delta) => {
    if (!group.current) return;
    
    elapsedTime.current += delta;
    
    // Calculate animation progress (0 to 1)
    const progress = Math.min(elapsedTime.current / duration, 1);
    
    // Ease-out function for smoother animation
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    
    // Apply easing to progress
    const easedProgress = easeOut(progress);
    
    // Move upward with easing and add slight wobble
    const wobble = Math.sin(elapsedTime.current * 10) * 0.1;
    group.current.position.y = position[1] + 1 + easedProgress * 2;
    group.current.position.x = position[0] + wobble * (1 - progress);
    
    // Scale up slightly at the beginning then back down
    const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
    group.current.scale.set(scale, scale, scale);
    
    // Fade out as it rises
    if (group.current.children.length > 0) {
      group.current.children.forEach((child) => {
        if ('material' in child && child.material instanceof THREE.Material) {
          child.material.opacity = 1 - easedProgress;
        }
      });
    }
    
    // Add rotation for more dynamic effect
    group.current.rotation.z = wobble * 0.5;
    
    // Remove when animation completes
    if (progress >= 1) {
      onComplete();
    }
  });
  
  // Convert amount to string with + prefix
  const displayText = `+${amount}`;
  
  return (
    <group ref={group}>
      {/* Glowing background for better visibility */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshBasicMaterial 
          color={resourceColors[resourceType]}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Resource symbol or icon */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.5}
        color={resourceColors[resourceType]}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {resourceSymbols[resourceType]}
      </Text>
      
      {/* Resource amount */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.4}
        color={resourceColors[resourceType]}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {displayText}
      </Text>
    </group>
  );
}