import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useOlympians } from "../../lib/stores/useOlympians";

export function Zeus() {
  const ref = useRef<THREE.Group>(null);
  const mountOlympusPosition = useOlympians(state => state.mountOlympusPosition);
  const zeusHealth = useOlympians(state => state.zeusHealth);
  const maxZeusHealth = useOlympians(state => state.maxZeusHealth);
  
  // Zeus position on top of Mount Olympus
  const zeusPosition = [
    mountOlympusPosition[0],
    mountOlympusPosition[1] + 7,
    mountOlympusPosition[2]
  ];
  
  // Animate Zeus slightly floating
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = zeusPosition[1] + Math.sin(t) * 0.1;
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    }
  });
  
  // Health percentage for the health bar
  const healthPercent = zeusHealth / maxZeusHealth;
  
  return (
    <group ref={ref} position={zeusPosition}>
      {/* Zeus body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.5, 1.8, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Zeus head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffe4b5" />
      </mesh>
      
      {/* Zeus beard */}
      <mesh position={[0, 0.9, 0.2]} castShadow>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      
      {/* Zeus crown/helmet */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.3, 0.4, 16]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      
      {/* Zeus lightning bolt */}
      <group position={[0.7, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Lightning zigs */}
        {[0.3, 0, -0.3].map((y, i) => (
          <mesh key={i} position={[0.1 * (i % 2 ? -1 : 1), y, 0]} castShadow>
            <boxGeometry args={[0.3, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
      
      {/* Zeus health bar background */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Zeus health bar fill */}
      <mesh 
        position={[
          (healthPercent - 1) * 0.5, 
          2, 
          0.01
        ]}
        scale={[healthPercent, 1, 1]}
      >
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}
