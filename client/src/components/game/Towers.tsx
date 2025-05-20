import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useOlympians } from "../../lib/stores/useOlympians";
import { heroTowers } from "../../lib/towers";
import { Tower } from "../../types";
import { getNearestGridCell } from "../../lib/path";
import { TowerModel } from "./TowerModel";

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
          {/* Use the new TowerModel component */}
          <TowerModel tower={tower} isHovered={hoverTowerId === tower.id} />
          
          {/* Attack range indicator (only when selected or hovered) */}
          {(hoverTowerId === tower.id || upgradeMode) && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[tower.range - 0.1, tower.range, 36]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
            </mesh>
          )}
          
          {/* Upgrade indicator - glow effect above towers that can be upgraded */}
          {tower.upgradeName && (
            <group>
              <pointLight 
                position={[0, 2.5, 0]} 
                color={tower.tier === 'hero' ? "#4FC3F7" : "#FFC107"} 
                intensity={1.5} 
                distance={2}
              />
              <mesh position={[0, 2.5, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                  color={tower.tier === 'hero' ? "#4FC3F7" : "#FFC107"} 
                  emissive={tower.tier === 'hero' ? "#4FC3F7" : "#FFC107"} 
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            </group>
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
          {/* Create a preview version of the tower */}
          {(() => {
            const blueprint = heroTowers.find(t => t.id === selectedBlueprint);
            if (!blueprint) return null;
            
            // Create a simplified preview tower
            const previewTower = {
              id: 'preview',
              position: [0, 0, 0] as [number, number, number],
              tier: 'hero' as const,
              type: blueprint.type,
              damage: blueprint.damage,
              range: blueprint.range,
              attackSpeed: blueprint.attackSpeed,
              cost: blueprint.cost,
              upgradeProgress: 0,
              targetId: null,
              lastAttackTime: 0,
              upgradeCost: blueprint.upgradeCost,
              upgradeName: blueprint.upgradeName,
              color: validPlacement ? '#4caf50' : '#f44336'
            };
            
            return <TowerModel tower={previewTower} isHovered={false} />;
          })()}
          
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
