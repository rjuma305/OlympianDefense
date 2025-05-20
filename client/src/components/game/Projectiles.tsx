import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOlympians } from "../../lib/stores/useOlympians";
import { useProjectiles } from "../../lib/stores/useProjectiles";
import { Projectile } from "../../types";
import * as THREE from "three";

export function Projectiles() {
  const projectiles = useProjectiles(state => state.projectiles);
  
  return (
    <>
      {projectiles.map(projectile => (
        <ProjectileModel key={projectile.id} projectile={projectile} />
      ))}
    </>
  );
}

function ProjectileModel({ projectile }: { projectile: Projectile }) {
  const ref = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const trailPositions = useRef<{x: number, y: number, z: number}[]>([]);
  
  // Add a slight trail effect to projectiles
  useFrame(() => {
    if (ref.current) {
      // Store positions for trail
      if (trailPositions.current.length > 10) {
        trailPositions.current.shift();
      }
      
      trailPositions.current.push({
        x: ref.current.position.x,
        y: ref.current.position.y,
        z: ref.current.position.z
      });
      
      // Update trail geometry if it exists
      if (trailRef.current) {
        const positions = trailRef.current.geometry.attributes.position;
        const posArray = positions.array as Float32Array;
        
        // Update trail vertices based on stored positions
        for (let i = 0; i < trailPositions.current.length; i++) {
          const pos = trailPositions.current[i];
          const idx = i * 3;
          
          posArray[idx] = pos.x;
          posArray[idx + 1] = pos.y;
          posArray[idx + 2] = pos.z;
          
          // Mirror positions for the second side of the trail
          const mirrorIdx = (trailPositions.current.length * 2 - i - 1) * 3;
          posArray[mirrorIdx] = pos.x;
          posArray[mirrorIdx + 1] = pos.y;
          posArray[mirrorIdx + 2] = pos.z;
        }
        
        positions.needsUpdate = true;
      }
    }
  });
  
  // Determine projectile style based on type
  let projectileColor = "#ffffff";
  let emissiveColor = "#ffffff";
  let size = 0.2;
  
  if (projectile.type === 'archer') {
    projectileColor = "#ffcc00";
    emissiveColor = "#ffcc00";
    size = 0.15;
  } else if (projectile.type === 'warrior') {
    projectileColor = "#ff0000";
    emissiveColor = "#ff0000";
    size = 0.25;
  } else if (projectile.type === 'mage') {
    projectileColor = "#00ffff";
    emissiveColor = "#00ffff";
    size = 0.2;
  }
  
  return (
    <group ref={ref} position={projectile.position}>
      {/* Main projectile */}
      <mesh castShadow>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial 
          color={projectileColor} 
          emissive={emissiveColor} 
          emissiveIntensity={1} 
        />
      </mesh>
      
      {/* Trail effect */}
      <mesh ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={20} 
            itemSize={3} 
            array={new Float32Array(20 * 3)} 
          />
        </bufferGeometry>
        <meshBasicMaterial 
          color={projectileColor} 
          transparent 
          opacity={0.5} 
          side={2} // THREE.DoubleSide
        />
      </mesh>
    </group>
  );
}
