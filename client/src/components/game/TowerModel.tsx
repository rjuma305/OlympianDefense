import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Tower, TowerTier } from '../../types';
import * as THREE from 'three';

// Map tower types to model paths
const modelPaths = {
  archer: {
    olympian: '/models/apollo_tower.glb'
  },
  warrior: {
    olympian: '/models/heracles_tower.glb'
  },
  mage: {
    olympian: '/models/circe_tower.glb'
  },
  enchantress: {
    olympian: '/models/aphrodite_tower.glb'
  },
  storm: {
    olympian: '/models/zeus_tower.glb'
  },
  ocean: {
    olympian: '/models/poseidon_tower.glb'
  }
};

interface TowerModelProps {
  tower: Tower;
  isHovered: boolean;
}

export function TowerModel({ tower, isHovered }: TowerModelProps) {
  const [modelPath, setModelPath] = useState<string | null>(null);
  const [showDefaultModel, setShowDefaultModel] = useState(true);

  // Determine which model to use based on tower type and tier
  useEffect(() => {
    if (tower.tier === 'olympian') {
      const path = modelPaths[tower.type as keyof typeof modelPaths]?.olympian;
      if (path) {
        setModelPath(path);
        setShowDefaultModel(false);
      } else {
        setShowDefaultModel(true);
      }
    } else {
      setShowDefaultModel(true);
    }
  }, [tower.type, tower.tier]);

  // Try to load model if available
  const { scene } = useGLTF(modelPath || '/models/apollo_tower.glb', true);
  const model = scene.clone();

  // Scale the model appropriately
  model.scale.set(2.5, 2.5, 2.5);

  if (showDefaultModel) {
    // Render default tower models for non-Olympian tiers
    return (
      <group>
        {/* Base/platform */}
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        
        {/* Tower body - style based on type and tier */}
        {tower.type === 'archer' && (
          <group>
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
              <meshStandardMaterial color={tower.color || "#8bc34a"} />
            </mesh>
            
            <mesh position={[0, 1.6, 0]} castShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#ffe4b5" />
            </mesh>
            
            <mesh position={[0.3, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.2, 0.03, 16, 16, Math.PI]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        )}
        
        {tower.type === 'warrior' && (
          <group>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.45, 0.5, 1.2, 16]} />
              <meshStandardMaterial color={tower.color || "#f44336"} />
            </mesh>
            
            <mesh position={[0, 1.4, 0]} castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#ffe4b5" />
            </mesh>
            
            <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.05]} />
              <meshStandardMaterial color="#c0c0c0" />
            </mesh>
          </group>
        )}
        
        {tower.type === 'mage' && (
          <group>
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.35, 0.45, 1.4, 16]} />
              <meshStandardMaterial color={tower.color || "#9c27b0"} />
            </mesh>
            
            <mesh position={[0, 1.5, 0]} castShadow>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#ffe4b5" />
            </mesh>
            
            <group position={[0.3, 1.2, 0]} rotation={[0, 0, Math.PI / 8]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              <mesh position={[0, 0.45, 0]} castShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={tower.color || "#9c27b0"} emissive={tower.color || "#9c27b0"} emissiveIntensity={0.5} />
              </mesh>
            </group>
          </group>
        )}

        {/* Tower tier indicator (aura/crown for higher tiers) */}
        {tower.tier === 'demigod' && (
          <mesh position={[0, 2, 0]} castShadow>
            <torusGeometry args={[0.4, 0.05, 16, 32]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>
    );
  }

  // Render 3D model for Olympians
  return (
    <group>
      {/* Base/platform */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* 3D Model */}
      <primitive object={model} position={[0, 0, 0]} />
      
      {/* Tower tier indicator for Olympian */}
      <group position={[0, 2, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.4, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Preload all models
useGLTF.preload('/models/apollo_tower.glb');
useGLTF.preload('/models/heracles_tower.glb');
useGLTF.preload('/models/circe_tower.glb');
useGLTF.preload('/models/aphrodite_tower.glb');
useGLTF.preload('/models/zeus_tower.glb');
useGLTF.preload('/models/poseidon_tower.glb');