import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOlympians } from "../../lib/stores/useOlympians";

export function EnvironmentDecorations() {
  const grid = useOlympians(state => state.grid);
  const mountOlympusPosition = useOlympians(state => state.mountOlympusPosition);
  const titanKeep = useOlympians(state => state.titanKeep);
  
  // Ref for animated flames
  const flameRef = useRef<THREE.Group>(null);
  
  // Animate the flames
  useFrame(({ clock }) => {
    if (flameRef.current) {
      const time = clock.getElapsedTime();
      flameRef.current.scale.y = 1 + Math.sin(time * 5) * 0.1;
      flameRef.current.scale.x = 1 + Math.cos(time * 4) * 0.05;
      flameRef.current.scale.z = 1 + Math.sin(time * 3) * 0.05;
    }
  });
  
  // Generate positions for decorative elements
  const decorations = [];
  const terrainSize = grid.length * 2;
  const terrainHalfSize = terrainSize / 2;
  
  // Decorative columns around Mount Olympus
  const olympusX = mountOlympusPosition[0];
  const olympusZ = mountOlympusPosition[2];
  const radius = 6;
  
  // Get titan keep position
  let titanKeepX = 0;
  let titanKeepZ = terrainHalfSize - 1; // Default position
  
  if (titanKeep) {
    titanKeepX = titanKeep.position[0];
    titanKeepZ = titanKeep.position[2];
  }
  
  // Add columns around Mount Olympus
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x = olympusX + Math.sin(angle) * radius;
    const z = olympusZ + Math.cos(angle) * radius;
    
    decorations.push({
      type: 'column',
      position: [x, 0, z] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
      scale: 1 + Math.random() * 0.3
    });
  }
  
  // Add altars
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const x = olympusX + Math.sin(angle) * (radius + 2);
    const z = olympusZ + Math.cos(angle) * (radius + 2);
    
    decorations.push({
      type: 'altar',
      position: [x, 0, z] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
      scale: 1.2,
      isMainAltar: i === 0 // Only the first altar gets the flame ref
    });
  }
  
  // Add olive trees
  for (let i = 0; i < 10; i++) {
    // Create a spiral pattern of trees
    const angle = (i / 10) * Math.PI * 6;
    const distance = 10 + i * 1.5;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;
    
    // Don't place too close to Mount Olympus or Titan Keep
    const distToOlympus = Math.sqrt(
      Math.pow(x - olympusX, 2) + 
      Math.pow(z - olympusZ, 2)
    );
    
    const distToTitanKeep = Math.sqrt(
      Math.pow(x - titanKeepX, 2) + 
      Math.pow(z - titanKeepZ, 2)
    );
    
    // Skip if too close
    if (distToOlympus < 8 || distToTitanKeep < 8) {
      continue;
    }
    
    decorations.push({
      type: 'tree',
      position: [x, 0, z] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
      scale: 1.2 + Math.random() * 0.5
    });
  }
  
  return (
    <group>
      {decorations.map((decoration, index) => {
        if (decoration.type === 'column') {
          return (
            <Column 
              key={`column-${index}`}
              position={decoration.position}
              rotation={decoration.rotation}
              scale={decoration.scale}
            />
          );
        } else if (decoration.type === 'altar') {
          return (
            <Altar 
              key={`altar-${index}`}
              position={decoration.position}
              rotation={decoration.rotation}
              scale={decoration.scale}
              flameRef={decoration.isMainAltar ? flameRef : undefined}
            />
          );
        } else if (decoration.type === 'tree') {
          return (
            <OliveTree 
              key={`tree-${index}`}
              position={decoration.position}
              rotation={decoration.rotation}
              scale={decoration.scale}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

function Column({ position, rotation, scale }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  scale: number 
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Column base */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Column shaft */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Column capital */}
      <mesh castShadow receiveShadow position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
}

function Altar({ position, rotation, scale, flameRef }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  scale: number,
  flameRef?: React.RefObject<THREE.Group>
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Altar base */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      
      {/* Altar bowl */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      
      {/* Custom flame on top */}
      <group position={[0, 1.1, 0]} ref={flameRef}>
        <pointLight color="#ff6a00" intensity={1.5} distance={8} />
        <mesh>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshBasicMaterial color="#ff9d00" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function OliveTree({ position, rotation, scale }: { 
  position: [number, number, number], 
  rotation: [number, number, number],
  scale: number 
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Tree trunk */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Tree foliage */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#556B2F" />
      </mesh>
      
      {/* Additional branch */}
      <group position={[0.5, 1.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#556B2F" />
        </mesh>
      </group>
      
      {/* Additional branch on other side */}
      <group position={[-0.4, 1.5, 0.3]} rotation={[0, 0, -Math.PI / 5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.7, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#556B2F" />
        </mesh>
      </group>
    </group>
  );
}