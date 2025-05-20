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
  
  // Solar Flare (Apollo's ability)
  if (effect.type === 'solar-flare') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[effect.radius, effect.radius, 0.2, 32]} />
          <meshStandardMaterial 
            color="#ffcc00" 
            emissive="#ff9900" 
            emissiveIntensity={2}
            transparent 
            opacity={0.7 - lifecycle.current * 0.6} 
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[effect.radius / 2, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffaa" 
            emissive="#ffdd44" 
            emissiveIntensity={3}
            transparent 
            opacity={0.8 - lifecycle.current * 0.7} 
          />
        </mesh>
      </group>
    );
  }
  
  // Mighty Swing (Heracles' ability)
  if (effect.type === 'mighty-swing') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[effect.radius - 0.5, effect.radius, 32]} />
          <meshStandardMaterial 
            color="#ff3300" 
            emissive="#aa0000" 
            emissiveIntensity={2}
            transparent 
            opacity={0.8 - lifecycle.current * 0.7} 
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[effect.radius * 0.8, 16, 16]} />
          <meshStandardMaterial 
            color="#ff7755" 
            emissive="#ff4422" 
            emissiveIntensity={1.5}
            transparent 
            opacity={0.4 - lifecycle.current * 0.4} 
            wireframe
          />
        </mesh>
      </group>
    );
  }
  
  // Transformation (Circe's ability)
  if (effect.type === 'transformation') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[effect.radius, 32]} />
          <meshStandardMaterial 
            color="#cc44cc" 
            emissive="#aa00aa" 
            emissiveIntensity={1.5}
            transparent 
            opacity={0.5 - lifecycle.current * 0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[effect.radius * 0.7, 0.2, 16, 32]} />
          <meshStandardMaterial 
            color="#ff55ff" 
            emissive="#ff00ff" 
            emissiveIntensity={2}
            transparent 
            opacity={0.7 - lifecycle.current * 0.6} 
          />
        </mesh>
      </group>
    );
  }
  
  // Charm Aura (Aphrodite's ability)
  if (effect.type === 'charm-aura') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[effect.radius - 0.3, effect.radius, 32]} />
          <meshStandardMaterial 
            color="#ff66cc" 
            emissive="#ff3399" 
            emissiveIntensity={1.5}
            transparent 
            opacity={0.6 - lifecycle.current * 0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[effect.radius * 0.6, 16, 16]} />
          <meshStandardMaterial 
            color="#ffaadd" 
            emissive="#ff77aa" 
            emissiveIntensity={2}
            transparent 
            opacity={0.5 - lifecycle.current * 0.5} 
            wireframe
          />
        </mesh>
        {/* Heart particles */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * Math.PI / 4 + lifecycle.current * 5) * effect.radius * 0.7,
              0.5 + Math.sin(lifecycle.current * 3 + i) * 0.3,
              Math.cos(i * Math.PI / 4 + lifecycle.current * 5) * effect.radius * 0.7
            ]}
            scale={0.3}
          >
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial 
              color="#ff4488" 
              emissive="#ff2266" 
              emissiveIntensity={2}
              transparent 
              opacity={0.7 - lifecycle.current * 0.7} 
            />
          </mesh>
        ))}
      </group>
    );
  }
  
  // Chain Lightning (Zeus's ability)
  if (effect.type === 'chain-lightning') {
    return (
      <group ref={ref} position={effect.position}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color="#99ccff" 
            emissive="#4488ff" 
            emissiveIntensity={3}
            transparent 
            opacity={0.8 - lifecycle.current * 0.7} 
          />
        </mesh>
        {/* Lightning bolts radiating outward */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * Math.PI * 2 / 5) * effect.radius * lifecycle.current,
              0.5,
              Math.cos(i * Math.PI * 2 / 5) * effect.radius * lifecycle.current
            ]}
            rotation={[0, i * Math.PI * 2 / 5, 0]}
          >
            <cylinderGeometry args={[0.05, 0.2, effect.radius * lifecycle.current, 8]} />
            <meshStandardMaterial 
              color="#aaddff" 
              emissive="#88aaff" 
              emissiveIntensity={2}
              transparent 
              opacity={0.9 - lifecycle.current * 0.8} 
            />
          </mesh>
        ))}
      </group>
    );
  }
  
  // Tidal Wave (Poseidon's ability)
  if (effect.type === 'tidal-wave') {
    return (
      <group ref={ref} position={effect.position}>
        {/* Wave circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[
            effect.radius * (0.6 + lifecycle.current * 0.3), 
            effect.radius * (0.7 + lifecycle.current * 0.3), 
            32
          ]} />
          <meshStandardMaterial 
            color="#44aaff" 
            emissive="#0088ff" 
            emissiveIntensity={1.5}
            transparent 
            opacity={0.8 - lifecycle.current * 0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Wave particles */}
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * Math.PI / 6) * effect.radius * (0.7 + lifecycle.current * 0.3),
              0.3 + Math.sin(lifecycle.current * 10 + i) * 0.3,
              Math.cos(i * Math.PI / 6) * effect.radius * (0.7 + lifecycle.current * 0.3)
            ]}
          >
            <sphereGeometry args={[0.2 + Math.random() * 0.3, 8, 8]} />
            <meshStandardMaterial 
              color="#66ccff" 
              emissive="#33aaff" 
              emissiveIntensity={1.5}
              transparent 
              opacity={0.7 - lifecycle.current * 0.7} 
            />
          </mesh>
        ))}
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
