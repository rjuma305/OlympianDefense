import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOlympians } from "../../lib/stores/useOlympians";
import * as THREE from "three";

export function TitanKeep() {
  const ref = useRef<THREE.Group>(null);
  const titanKeep = useOlympians(state => state.titanKeep);
  
  if (!titanKeep) return null;
  
  // Health percentage for the health bar
  const healthPercent = titanKeep.health / titanKeep.maxHealth;
  
  // Animate the Titan Keep slightly
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      // Subtle pulsing effect
      ref.current.scale.set(
        1 + Math.sin(t * 0.5) * 0.02,
        1 + Math.sin(t * 0.5) * 0.02,
        1 + Math.sin(t * 0.5) * 0.02
      );
      
      // Apply a slight glow effect to the materials
      ref.current.children.forEach(child => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = 0.2 + Math.sin(t) * 0.1;
        }
      });
    }
  });
  
  return (
    <group position={titanKeep.position} ref={ref}>
      {/* Base of the Titan Keep */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 5, 2, 32]} />
        <meshStandardMaterial color="#800000" emissive="#ff4500" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Middle part */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 4, 2, 32]} />
        <meshStandardMaterial color="#8b0000" emissive="#ff4500" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Upper part */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 3, 2, 32]} />
        <meshStandardMaterial color="#a52a2a" emissive="#ff4500" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Top part */}
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0, 2, 3, 5]} />
        <meshStandardMaterial color="#b22222" emissive="#ff4500" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Decorative spikes */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <group 
          key={i} 
          position={[0, 6, 0]} 
          rotation={[0, THREE.MathUtils.degToRad(angle), 0]}
        >
          <mesh position={[2.5, 0, 0]} castShadow>
            <coneGeometry args={[0.5, 2, 4]} />
            <meshStandardMaterial color="#8b0000" emissive="#ff4500" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      
      {/* Lava pool around the base */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[5, 7, 32]} />
        <meshStandardMaterial color="#ff4500" emissive="#ff4500" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Health bar background */}
      <mesh position={[0, 10, 0]}>
        <planeGeometry args={[8, 1]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar fill */}
      <mesh 
        position={[
          (healthPercent - 1) * 4, 
          10, 
          0.01
        ]}
        scale={[healthPercent, 1, 1]}
      >
        <planeGeometry args={[8, 1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Keep name */}
      <group position={[0, 11.5, 0]}>
        <mesh>
          <planeGeometry args={[10, 1.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[9.8, 1.3]} />
          <meshBasicMaterial color="#ff4500" />
        </mesh>
      </group>
    </group>
  );
}