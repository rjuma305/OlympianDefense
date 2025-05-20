import { useTexture } from "@react-three/drei";
import { useOlympians } from "../../lib/stores/useOlympians";

export function Terrain() {
  const grid = useOlympians(state => state.grid);
  const mountOlympusPosition = useOlympians(state => state.mountOlympusPosition);
  
  // Load textures
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  
  // Make textures repeat
  grassTexture.repeat.set(5, 5);
  grassTexture.wrapS = grassTexture.wrapT = 1000; // THREE.RepeatWrapping
  
  sandTexture.repeat.set(2, 2);
  sandTexture.wrapS = sandTexture.wrapT = 1000; // THREE.RepeatWrapping
  
  // Grid size
  const gridSize = grid.length;
  const cellSize = 2;
  const terrainSize = gridSize * cellSize;
  
  return (
    <>
      {/* Base terrain */}
      <mesh 
        receiveShadow 
        position={[0, -0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[terrainSize, terrainSize]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      {/* Path */}
      {grid.flat().filter(cell => cell.isPath).map(cell => (
        <mesh
          key={`path-${cell.x}-${cell.z}`}
          position={[cell.x, 0, cell.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[cellSize * 0.9, cellSize * 0.9]} />
          <meshStandardMaterial map={sandTexture} color="#d2b48c" />
        </mesh>
      ))}
      
      {/* Mount Olympus */}
      <group position={mountOlympusPosition}>
        {/* Base of Mount Olympus */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3, 4, 2, 32]} />
          <meshStandardMaterial color="#a9a9a9" />
        </mesh>
        
        {/* Middle part */}
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 3, 2, 32]} />
          <meshStandardMaterial color="#d3d3d3" />
        </mesh>
        
        {/* Top part */}
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0, 2, 2, 32]} />
          <meshStandardMaterial color="#f8f8ff" />
        </mesh>
        
        {/* Temple on top */}
        <group position={[0, 6, 0]}>
          {/* Pillars */}
          {[
            [-0.8, 0, -0.8],
            [0.8, 0, -0.8],
            [-0.8, 0, 0.8],
            [0.8, 0, 0.8]
          ].map((pos, i) => (
            <mesh key={i} position={pos} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
          ))}
          
          {/* Roof */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[2, 0.2, 2]} />
            <meshStandardMaterial color="#daa520" />
          </mesh>
        </group>
      </group>
    </>
  );
}
