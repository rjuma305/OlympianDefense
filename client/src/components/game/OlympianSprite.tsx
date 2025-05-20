import React from 'react';
import { Tower } from '../../types';

// Map Olympian names to their sprite image paths
const olympianSpritePaths: Record<string, string> = {
  'Apollo': '/images/olympians/apollo.png',
  'Heracles': '/images/olympians/heracles.png',
  'Circe': '/images/olympians/circe.png',
  'Aphrodite': '/images/olympians/aphrodite.png',
  'Zeus': '/images/olympians/zeus.png',
  'Poseidon': '/images/olympians/poseidon.png',
  'Artemis': '/images/olympians/artemis.png',
  'Ares': '/images/olympians/ares.png',
  'Hera': '/images/olympians/hera.png',
  'Athena': '/images/olympians/athena.png',
  'Hermes': '/images/olympians/hermes.png',
  'Nyx': '/images/olympians/nyx.png',
  'Hestia': '/images/olympians/hestia.png',
  'Dionysus': '/images/olympians/dionysus.png',
  'Hecate': '/images/olympians/hecate.png',
  'Hades': '/images/olympians/hades.png',
  'Demeter': '/images/olympians/demeter.png'
};

interface OlympianSpriteProps {
  olympianName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function OlympianSprite({ olympianName, size = 'medium', className = '' }: OlympianSpriteProps) {
  const spritePath = olympianSpritePaths[olympianName] || '/images/olympians/zeus.png'; // Default fallback
  
  // Define size classes
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img 
        src={spritePath} 
        alt={`${olympianName} sprite`} 
        className="object-contain w-full h-full"
      />
    </div>
  );
}

// Component for displaying upgrade path with sprites
interface UpgradePathDisplayProps {
  heroName: string;
  demigodName: string;
  olympianName: string;
}

export function UpgradePathDisplay({ heroName, demigodName, olympianName }: UpgradePathDisplayProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-center">
        <p className="text-xs font-medium">{heroName}</p>
        {/* Hero representation (no sprite, just a generic icon) */}
        <div className="w-8 h-8 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs">Lvl 1</span>
        </div>
      </div>
      
      <div className="text-gray-400">→</div>
      
      <div className="text-center">
        <p className="text-xs font-medium">{demigodName}</p>
        {/* Demigod representation */}
        <div className="w-8 h-8 mx-auto bg-blue-300 rounded-full flex items-center justify-center">
          <span className="text-xs">Lvl 2</span>
        </div>
      </div>
      
      <div className="text-gray-400">→</div>
      
      <div className="text-center">
        <p className="text-xs font-medium">{olympianName}</p>
        {/* Olympian sprite */}
        <OlympianSprite olympianName={olympianName} size="small" />
      </div>
    </div>
  );
}