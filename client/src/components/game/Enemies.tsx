import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOlympians } from "../../lib/stores/useOlympians";
import { Enemy } from "../../types";
import * as THREE from "three";

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
  const ref = useRef<THREE.Group>(null);
  
  // Animate enemy bobbing slightly as it moves
  useFrame(({ clock }) => {
    if (ref.current && !enemy.isDead) {
      const t = clock.getElapsedTime();
      ref.current.position.y = Math.sin(t * 5 + enemy.id.charCodeAt(0)) * 0.1 + 0.5;
      
      // Make Kronos slightly glow
      if (enemy.isKronos && ref.current.children.length > 0) {
        const bodyMesh = ref.current.children[0] as THREE.Mesh;
        const material = bodyMesh.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = Math.sin(t * 2) * 0.2 + 0.3;
      }
    }
  });
  
  // Health percentage for the health bar
  const healthPercent = enemy.health / enemy.maxHealth;
  
  return (
    <group position={enemy.position}>
      {/* Enemy body - style based on type */}
      <group ref={ref}>
        {enemy.type === 'titan' && (
          <mesh castShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        )}
        
        {enemy.type === 'cyclops' && (
          <group>
            <mesh castShadow>
              <boxGeometry args={[1, 1.2, 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 0.7, 0.4]} castShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ff0000" />
            </mesh>
          </group>
        )}
        
        {enemy.type === 'harpy' && (
          <group>
            <mesh castShadow>
              <coneGeometry args={[0.4, 1, 16]} />
              <meshStandardMaterial color="#9370db" />
            </mesh>
            <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.3]} />
              <meshStandardMaterial color="#9370db" />
            </mesh>
            <mesh position={[-0.4, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.3]} />
              <meshStandardMaterial color="#9370db" />
            </mesh>
          </group>
        )}
        
        {enemy.type === 'kronos' && (
          <group>
            {/* Kronos body */}
            <mesh castShadow>
              <boxGeometry args={[1.5, 2, 1.5]} />
              <meshStandardMaterial 
                color="#4a0000" 
                emissive="#ff0000" 
                emissiveIntensity={0.3} 
              />
            </mesh>
            
            {/* Crown */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.6, 0.8, 0.4, 6]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            
            {/* Scythe */}
            <group position={[1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
                <meshStandardMaterial color="#222222" />
              </mesh>
              <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <torusGeometry args={[0.4, 0.05, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#c0c0c0" />
              </mesh>
            </group>
          </group>
        )}
      </group>
      
      {/* Health bar background */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar fill */}
      <mesh 
        position={[
          (healthPercent - 1) * 0.5, 
          1.5, 
          0.01
        ]}
        scale={[healthPercent, 1, 1]}
      >
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color={enemy.isKronos ? "#ff0000" : "#00ff00"} />
      </mesh>
    </group>
  );
}
