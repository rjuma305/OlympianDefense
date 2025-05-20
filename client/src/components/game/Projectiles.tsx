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
  
  // Get related tower to determine appearance
  const { towers } = useOlympians();
  const tower = towers.find(t => t.id === projectile.fromTower);
  
  // Determine projectile style based on type and tier
  let projectileColor = "#ffffff";
  let emissiveColor = "#ffffff";
  let size = 0.2;
  let intensity = 1;
  let trailSize = 0.5;
  
  // Base colors by type
  if (projectile.type === 'archer') {
    projectileColor = "#8bc34a"; // Light green
    emissiveColor = "#4caf50"; 
    size = 0.15;
  } else if (projectile.type === 'warrior') {
    projectileColor = "#f44336"; // Red
    emissiveColor = "#d32f2f";
    size = 0.25;
  } else if (projectile.type === 'mage') {
    projectileColor = "#2196f3"; // Blue
    emissiveColor = "#1976d2";
    size = 0.2;
  } else if (projectile.type === 'enchanter') {
    projectileColor = "#E91E63"; // Pink
    emissiveColor = "#C2185B";
    size = 0.18;
  } else if (projectile.type === 'lightning') {
    projectileColor = "#FFC107"; // Amber
    emissiveColor = "#FF8F00";
    size = 0.22;
  } else if (projectile.type === 'water') {
    projectileColor = "#03A9F4"; // Light Blue
    emissiveColor = "#0288D1";
    size = 0.23;
  }
  
  // Enhance for higher tier towers
  if (tower?.tier === 'demigod') {
    intensity = 1.5;
    size *= 1.25;
    trailSize = 0.8;
  } else if (tower?.tier === 'olympian') {
    intensity = 2;
    size *= 1.5;
    trailSize = 1.2;
  }
  
  return (
    <group ref={ref} position={projectile.position}>
      {/* Main projectile */}
      <mesh castShadow>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial 
          color={projectileColor} 
          emissive={emissiveColor} 
          emissiveIntensity={intensity} 
        />
      </mesh>
      
      {/* Light for Olympian projectiles */}
      {tower?.tier === 'olympian' && (
        <pointLight 
          color={projectileColor} 
          intensity={2} 
          distance={5} 
        />
      )}
      
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
          opacity={0.6} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Additional particles for higher tier towers */}
      {(tower?.tier === 'demigod' || tower?.tier === 'olympian') && (
        <group>
          {[...Array(4)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.sin(Date.now() * 0.01 + i * Math.PI/2) * trailSize * 0.3,
                Math.cos(Date.now() * 0.01 + i * Math.PI/2) * trailSize * 0.3,
                0
              ]}
            >
              <sphereGeometry args={[size * 0.4, 8, 8]} />
              <meshStandardMaterial 
                color={projectileColor} 
                emissive={emissiveColor} 
                emissiveIntensity={intensity} 
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
