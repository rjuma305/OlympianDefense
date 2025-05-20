import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useOlympians } from "../../lib/stores/useOlympians";
import { Enemy } from "../../types";
import * as THREE from "three";

// Preload models
useGLTF.preload("/models/titan.glb");
useGLTF.preload("/models/cyclops.glb");
useGLTF.preload("/models/harpy.glb");
useGLTF.preload("/models/kronos.glb");

export function Enemies() {
  const enemies = useOlympians(state => state.enemies);
  
  return (
    <>
      {enemies.map(enemy => (
        <EnemyModel key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}

function EnemyModel({ enemy }: { enemy: Enemy }) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  
  // Load model based on enemy type
  const titanModel = useGLTF("/models/titan.glb");
  const cyclopsModel = useGLTF("/models/cyclops.glb");
  const harpyModel = useGLTF("/models/harpy.glb");
  const kronosModel = useGLTF("/models/kronos.glb");
  
  // Animate enemy
  useFrame(({ clock }) => {
    if (groupRef.current && !enemy.isDead) {
      const t = clock.getElapsedTime();
      
      // Bobbing animation based on enemy type
      if (modelRef.current) {
        if (enemy.type === 'harpy') {
          // Fly with a more dynamic movement
          modelRef.current.position.y = Math.sin(t * 3 + enemy.id.charCodeAt(0)) * 0.2 + 0.8;
          // Slight roll as it flies
          modelRef.current.rotation.z = Math.sin(t * 2 + enemy.id.charCodeAt(0)) * 0.1;
        } else {
          // Ground enemies have a simpler bob
          modelRef.current.position.y = Math.sin(t * 4 + enemy.id.charCodeAt(0)) * 0.05 + 0.1;
        }
        
        // Make Kronos glow
        if (enemy.isKronos) {
          // Find emissive materials in Kronos model and make them pulse
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              if (child.material.name?.includes('Eye') || child.material.name?.includes('Glow')) {
                child.material.emissive.set(0xff0000);
                child.material.emissiveIntensity = Math.sin(t * 2) * 0.3 + 0.7;
              }
            }
          });
          
          // Add slight rotation to the scythe if present
          const scythe = modelRef.current.getObjectByName('Scythe');
          if (scythe) {
            scythe.rotation.y = Math.sin(t) * 0.1;
          }
        }
        
        // If enemy is transformed (by Circe), scale down and add particle effect
        if (enemy.transformedUntil && enemy.transformedUntil > Date.now()) {
          modelRef.current.scale.set(0.5, 0.5, 0.5);
        } else {
          modelRef.current.scale.set(1, 1, 1);
        }
        
        // If enemy is slowed, add visual indicator
        if (enemy.slowed && enemy.slowedUntil && enemy.slowedUntil > Date.now()) {
          // Slow-pulsing blue aura effect could be added here
        }
      }
    }
  });
  
  // Health percentage for the health bar
  const healthPercent = enemy.health / enemy.maxHealth;
  
  // Figure out correct model position based on type
  const getModelYOffset = () => {
    switch(enemy.type) {
      case 'harpy': return 0;
      case 'cyclops': return -0.5;
      case 'kronos': return -1;
      default: return -0.5;
    }
  };
  
  // Determine model scale based on type
  const getModelScale = () => {
    switch(enemy.type) {
      case 'harpy': return 1.8;  // Harpies are smaller
      case 'cyclops': return 2.2; // Cyclops are larger
      case 'kronos': return 3;   // Kronos is largest
      default: return 2;        // Standard titan scale
    }
  };
  
  // Get health bar y-position based on enemy height
  const getHealthBarY = () => {
    switch(enemy.type) {
      case 'harpy': return 1.5;
      case 'cyclops': return 2.2;
      case 'kronos': return 3;
      default: return 1.8;
    }
  };
  
  return (
    <group position={enemy.position}>
      {/* Enemy model based on type */}
      <group ref={groupRef}>
        <group 
          ref={modelRef} 
          position={[0, getModelYOffset(), 0]} 
          rotation={[0, Math.PI, 0]} 
          scale={getModelScale()}>
          
          {enemy.type === 'titan' && (
            <primitive object={titanModel.scene.clone()} />
          )}
          
          {enemy.type === 'cyclops' && (
            <primitive object={cyclopsModel.scene.clone()} />
          )}
          
          {enemy.type === 'harpy' && (
            <primitive object={harpyModel.scene.clone()} />
          )}
          
          {enemy.type === 'kronos' && (
            <primitive object={kronosModel.scene.clone()} />
          )}
          
          {/* If enemy is transformed, show a simple frog shape */}
          {enemy.transformedUntil && enemy.transformedUntil > Date.now() && (
            <mesh scale={[0.5, 0.5, 0.5]} position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial color="#00aa00" />
            </mesh>
          )}
        </group>
      </group>
      
      {/* Health bar background */}
      <mesh position={[0, getHealthBarY(), 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar fill */}
      <mesh 
        position={[
          (healthPercent - 1) * 0.5, 
          getHealthBarY(), 
          0.01
        ]}
        scale={[healthPercent, 1, 1]}
      >
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color={enemy.isKronos ? "#ff0000" : "#00ff00"} />
      </mesh>
      
      {/* Status effect indicators */}
      {enemy.slowed && enemy.slowedUntil && enemy.slowedUntil > Date.now() && (
        <mesh position={[0, getHealthBarY() + 0.3, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
