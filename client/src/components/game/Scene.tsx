import { Suspense } from "react";
import { Terrain } from "./Terrain";
import { Zeus } from "./Zeus";
import { TitanKeep } from "./TitanKeep";
import { Towers } from "./Towers";
import { Enemies } from "./Enemies";
import { Projectiles } from "./Projectiles";
import { Effects } from "./Effects";
import { ParticleEffects } from "./ParticleEffects";
import { EnvironmentDecorations } from "./EnvironmentDecorations";
import { useOlympians } from "../../lib/stores/useOlympians";

export function Scene() {
  const gameState = useOlympians(state => state.gameState);
  const path = useOlympians(state => state.path);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={["#87ceeb", "#006400", 0.6]} />
      
      {/* Game components */}
      <Suspense fallback={null}>
        <Terrain />
        <EnvironmentDecorations />
        <Zeus />
        <TitanKeep />
        <Towers />
        <Enemies />
        <Projectiles />
        <Effects />
        
        {/* Debug: Visualize path */}
        {gameState === 'playing' && path && path.map((point, index) => (
          <mesh 
            key={`path-${index}`} 
            position={[point.x, 0.05, point.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.2, 16]} />
            <meshBasicMaterial color="#ffcc00" transparent opacity={0.5} />
          </mesh>
        ))}
      </Suspense>
    </>
  );
}
