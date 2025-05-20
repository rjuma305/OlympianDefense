import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useOlympians } from "../../lib/stores/useOlympians";
import { heroTowers } from "../../lib/towers";
import { Tower } from "../../types";
import { getNearestGridCell } from "../../lib/path";

export function Towers() {
  const { towers, grid, placementMode, selectedBlueprint, placeTower, selectTower, upgradeMode } = useOlympians();
  const { mouse, viewport, camera } = useThree();
  const [hoverTowerId, setHoverTowerId] = useState<string | null>(null);
  
  // Placement preview
  const placementRef = useRef<THREE.Group>(null);
  const [placementPosition, setPlacementPosition] = useState<[number, number, number] | null>(null);
  const [validPlacement, setValidPlacement] = useState(false);
  
  // Keyboard controls
  const placePressed = useKeyboardControls(state => state.place);
  
  // Tower placement ray
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const planeIntersection = new THREE.Vector3();
  
  // Handle click on terrain for tower placement
  const handleTerrainClick = (e: any) => {
    if (placementMode && selectedBlueprint && validPlacement && placementPosition) {
      e.stopPropagation();
      console.log("Clicked to place tower:", placementPosition, selectedBlueprint);
      placeTower(placementPosition, selectedBlueprint);
    }
  };
  
  // Tower selection
  const handleTowerClick = (e: any, tower: Tower) => {
    e.stopPropagation();
    selectTower(tower.id);
  };
  
  useFrame(() => {
    if (placementMode && selectedBlueprint && placementRef.current) {
      // Convert mouse position to 3D space
      raycaster.setFromCamera(mouse, camera);
      const ray = raycaster.ray;
      
      if (ray.intersectPlane(plane, planeIntersection)) {
        // Find nearest grid cell for placement
        const cell = getNearestGridCell(grid, [
          planeIntersection.x,
          0,
          planeIntersection.z
        ]);
        
        if (cell) {
          // Update placement preview position
          setPlacementPosition([cell.x, 0, cell.z]);
          
          // Check if placement is valid
          setValidPlacement(
            !cell.isOccupied && 
            cell.towerPlaceable
          );
          
          // Position the preview
          placementRef.current.position.set(cell.x, 0, cell.z);
          
          // Green for valid, red for invalid
          const blueprintTower = heroTowers.find(t => t.id === selectedBlueprint);
          const color = validPlacement ? 
            (blueprintTower?.color || '#4caf50') : 
            '#f44336';
          
          // Update material colors
          placementRef.current.children.forEach(child => {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            material.color.set(color);
            material.transparent = true;
            material.opacity = 0.5;
          });
          
          // Handle placement with keyboard
          if (placePressed && validPlacement && placementPosition) {
            placeTower(placementPosition, selectedBlueprint);
            console.log("Placing tower:", placementPosition, selectedBlueprint);
          }
        }
      }
    }
  });
  
  return (
    <>
      {/* Existing towers */}
      {towers.map(tower => (
        <group 
          key={tower.id}
          position={tower.position}
          onClick={(e) => handleTowerClick(e, tower)}
          onPointerOver={() => setHoverTowerId(tower.id)}
          onPointerOut={() => setHoverTowerId(null)}
        >
          {/* Base/platform */}
          <mesh position={[0, -0.25, 0]} receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          
          {/* Tower body - style based on type and tier */}
          {tower.type === 'archer' && (
            <group>
              {/* Thin tower for archer */}
              <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
                <meshStandardMaterial color={tower.color} />
              </mesh>
              
              {/* Archer figure */}
              <mesh position={[0, 1.6, 0]} castShadow>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffe4b5" />
              </mesh>
              
              {/* Bow */}
              <mesh position={[0.3, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <torusGeometry args={[0.2, 0.03, 16, 16, Math.PI]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
            </group>
          )}
          
          {tower.type === 'warrior' && (
            <group>
              {/* Stout tower for warrior */}
              <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.45, 0.5, 1.2, 16]} />
                <meshStandardMaterial color={tower.color} />
              </mesh>
              
              {/* Warrior figure */}
              <mesh position={[0, 1.4, 0]} castShadow>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#ffe4b5" />
              </mesh>
              
              {/* Sword/spear */}
              <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.1, 0.8, 0.05]} />
                <meshStandardMaterial color="#c0c0c0" />
              </mesh>
            </group>
          )}
          
          {tower.type === 'mage' && (
            <group>
              {/* Ornate tower for mage */}
              <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.35, 0.45, 1.4, 16]} />
                <meshStandardMaterial color={tower.color} />
              </mesh>
              
              {/* Mage figure */}
              <mesh position={[0, 1.5, 0]} castShadow>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#ffe4b5" />
              </mesh>
              
              {/* Staff */}
              <group position={[0.3, 1.2, 0]} rotation={[0, 0, Math.PI / 8]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
                  <meshStandardMaterial color="#8b4513" />
                </mesh>
                <mesh position={[0, 0.45, 0]} castShadow>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial color={tower.color} emissive={tower.color} emissiveIntensity={0.5} />
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
          
          {tower.tier === 'olympian' && (
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
          )}
          
          {/* Attack range indicator (only when selected or hovered) */}
          {(hoverTowerId === tower.id || upgradeMode) && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[tower.range - 0.1, tower.range, 36]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
            </mesh>
          )}
        </group>
      ))}
      
      {/* Tower placement preview */}
      {placementMode && selectedBlueprint && (
        <group 
          ref={placementRef} 
          position={[0, 0, 0]} 
          onClick={handleTerrainClick}
        >
          {/* Base platform */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          
          {/* Tower body based on selected blueprint */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
            <meshStandardMaterial color="#4caf50" />
          </mesh>
          
          {/* Range indicator */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[
              heroTowers.find(t => t.id === selectedBlueprint)?.range ? 
                heroTowers.find(t => t.id === selectedBlueprint)!.range - 0.1 : 
                4.9, 
              heroTowers.find(t => t.id === selectedBlueprint)?.range || 5, 
              36
            ]} />
            <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </>
  );
}
