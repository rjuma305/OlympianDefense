import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOlympians } from '../../lib/stores/useOlympians';
import { Projectile } from '../../types';
import * as THREE from 'three';

// Particle system for projectile trails
export function ParticleEffects() {
  const { towers } = useOlympians();
  const projectiles = useOlympians(state => state.projectiles || []);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create particle system
  const [particles, setParticles] = useState<{
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    lifetimes: Float32Array;
    velocities: Float32Array;
    count: number;
  }>({
    positions: new Float32Array(5000 * 3), // x, y, z
    colors: new Float32Array(5000 * 3), // r, g, b
    sizes: new Float32Array(5000),
    lifetimes: new Float32Array(5000),
    velocities: new Float32Array(5000 * 3),
    count: 0
  });
  
  // Update particles on each frame
  useFrame((_, delta) => {
    const { positions, colors, sizes, lifetimes, velocities, count } = particles;
    
    if (count === 0) return;
    
    let aliveCount = 0;
    
    // Update existing particles
    for (let i = 0; i < count; i++) {
      // Decrease lifetime
      lifetimes[i] -= delta;
      
      if (lifetimes[i] > 0) {
        // Update position
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        
        // Fade out color based on lifetime
        const alpha = Math.min(1, lifetimes[i] * 2);
        colors[i * 3 + 0] *= alpha;
        colors[i * 3 + 1] *= alpha;
        colors[i * 3 + 2] *= alpha;
        
        // Decrease size
        sizes[i] = Math.max(0.05, sizes[i] * 0.95);
        
        // Copy to active part of the array
        if (i !== aliveCount) {
          positions[aliveCount * 3] = positions[i * 3];
          positions[aliveCount * 3 + 1] = positions[i * 3 + 1];
          positions[aliveCount * 3 + 2] = positions[i * 3 + 2];
          
          colors[aliveCount * 3] = colors[i * 3];
          colors[aliveCount * 3 + 1] = colors[i * 3 + 1];
          colors[aliveCount * 3 + 2] = colors[i * 3 + 2];
          
          sizes[aliveCount] = sizes[i];
          lifetimes[aliveCount] = lifetimes[i];
          
          velocities[aliveCount * 3] = velocities[i * 3];
          velocities[aliveCount * 3 + 1] = velocities[i * 3 + 1];
          velocities[aliveCount * 3 + 2] = velocities[i * 3 + 2];
        }
        
        aliveCount++;
      }
    }
    
    // Create new particles for projectiles
    projectiles.forEach(projectile => {
      if (aliveCount < particles.positions.length / 3 - 10) {
        // Add particles based on tower type
        const tower = towers.find(t => t.id === projectile.fromTower);
        if (tower) {
          // Get particle color based on tower type
          let color = new THREE.Color(0xffffff);
          
          switch (tower.type) {
            case 'archer':
              color = new THREE.Color(0x8bc34a); // Light green
              break;
            case 'warrior':
              color = new THREE.Color(0xf44336); // Red
              break;
            case 'mage':
              color = new THREE.Color(0x2196f3); // Blue
              break;
            case 'enchanter':
              color = new THREE.Color(0xE91E63); // Pink
              break;
            case 'lightning':
              color = new THREE.Color(0xFFC107); // Amber
              break;
            case 'water':
              color = new THREE.Color(0x03A9F4); // Light Blue
              break;
          }
          
          // Emit particles
          const particleCount = tower.tier === 'olympian' ? 5 : 2;
          
          for (let i = 0; i < particleCount; i++) {
            if (aliveCount < particles.positions.length / 3) {
              // Position
              positions[aliveCount * 3] = projectile.position[0];
              positions[aliveCount * 3 + 1] = projectile.position[1];
              positions[aliveCount * 3 + 2] = projectile.position[2];
              
              // Color
              colors[aliveCount * 3] = color.r;
              colors[aliveCount * 3 + 1] = color.g;
              colors[aliveCount * 3 + 2] = color.b;
              
              // Size
              sizes[aliveCount] = tower.tier === 'olympian' ? 0.3 : 0.2;
              
              // Lifetime
              lifetimes[aliveCount] = 0.5 + Math.random() * 0.5;
              
              // Random velocity
              velocities[aliveCount * 3] = (Math.random() - 0.5) * 2;
              velocities[aliveCount * 3 + 1] = (Math.random() - 0.5) * 2;
              velocities[aliveCount * 3 + 2] = (Math.random() - 0.5) * 2;
              
              aliveCount++;
            }
          }
        }
      }
    });
    
    // Update buffer geometry
    if (particlesRef.current) {
      const geometry = particlesRef.current.geometry as THREE.BufferGeometry;
      
      // Update attributes
      const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      positionAttribute.needsUpdate = true;
      
      const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
      colorAttribute.needsUpdate = true;
      
      const sizeAttribute = geometry.getAttribute('size') as THREE.BufferAttribute;
      sizeAttribute.needsUpdate = true;
    }
    
    // Update particle count
    setParticles(prev => ({ ...prev, count: aliveCount }));
  });

  // Create initial particle system
  useEffect(() => {
    if (particlesRef.current) {
      const geometry = particlesRef.current.geometry as THREE.BufferGeometry;
      
      // Set initial attributes
      geometry.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1));
    }
  }, []);
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attachObject={['attributes', 'position']} 
          array={particles.positions} 
          count={particles.count} 
          itemSize={3} 
        />
        <bufferAttribute 
          attachObject={['attributes', 'color']} 
          array={particles.colors} 
          count={particles.count} 
          itemSize={3} 
        />
        <bufferAttribute 
          attachObject={['attributes', 'size']} 
          array={particles.sizes} 
          count={particles.count} 
          itemSize={1} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.25} 
        vertexColors
        transparent 
        opacity={0.8}
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}