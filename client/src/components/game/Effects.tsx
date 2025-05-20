import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOlympians } from "../../lib/stores/useOlympians";
import { Effect } from "../../types";
import * as THREE from "three";

export function Effects() {
  const effects = useOlympians(state => state.effects);
  
  return (
    <>
      {effects.map(effect => (
        <EffectModel key={effect.id} effect={effect} />
      ))}
    </>
  );
}

function EffectModel({ effect }: { effect: Effect }) {
  const ref = useRef<THREE.Group>(null);
  
  // Calculate the lifecycle of the effect (0-1)
  const lifecycle = useRef(0);
  
  // Animate the effect
  useFrame(() => {
    if (ref.current) {
      const elapsed = Date.now() - effect.createdAt;
      const progress = Math.min(1, elapsed / effect.duration);
      lifecycle.current = progress;
      
      // Scale up and fade out
      ref.current.scale.set(
        1 + progress * 2,
        1 + progress * 2,
        1 + progress * 2
      );
      
      // Apply materials to all children
      ref.current.children.forEach(child => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = 1 - progress;
      });
    }
  });
  
  // Render different effects based on type
  if (effect.type === 'hit') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#ff9500" 
            emissive="#ff5500" 
            emissiveIntensity={1} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      </group>
    );
  }
  
  // Default effect (fallback)
  return (
    <group ref={ref} position={effect.position}>
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.6} 
        />
      </mesh>
    </group>
  );
}
