import React from 'react';
import { Tower } from '../../types';
import { OlympianSprite, UpgradePathDisplay } from '../game/OlympianSprite';
import { ResourceIcon } from './ResourceIcon';
import { ResourceType } from '../../lib/resources';

interface TowerTooltipProps {
  tower: Tower;
  showUpgradePath?: boolean;
}

export function TowerTooltip({ tower, showUpgradePath = true }: TowerTooltipProps) {
  // Get the appropriate tower name for display
  const displayName = tower.upgradeName || tower.type.charAt(0).toUpperCase() + tower.type.slice(1);
  
  // Get the upgrade information if available
  const hasUpgrade = tower.upgradeName !== null && tower.tier !== 'olympian';
  
  // Helper function to get tier display name
  const getTierDisplayName = (tier: string): string => {
    switch (tier) {
      case 'hero': return 'Hero';
      case 'demigod': return 'Demigod';
      case 'olympian': return 'Olympian';
      default: return tier;
    }
  };
  
  // Map tower types to their complete upgrade paths
  const upgradePaths: Record<string, { hero: string; demigod: string; olympian: string }> = {
    'archer': { hero: 'Archer', demigod: 'Marksman', olympian: 'Apollo' },
    'warrior': { hero: 'Warrior', demigod: 'Hoplite', olympian: 'Heracles' },
    'mage': { hero: 'Mage', demigod: 'Sorcerer', olympian: 'Circe' },
    'enchanter': { hero: 'Enchanter', demigod: 'Charmer', olympian: 'Aphrodite' },
    'lightning': { hero: 'Thunderer', demigod: 'Storm Caller', olympian: 'Zeus' },
    'water': { hero: 'Tide Caller', demigod: 'Wave Mage', olympian: 'Poseidon' },
    'huntress': { hero: 'Huntress', demigod: 'Tracker', olympian: 'Artemis' },
    'queen': { hero: 'Royal Guard', demigod: 'Regent', olympian: 'Hera' },
    'warlord': { hero: 'Berserker', demigod: 'Warlord', olympian: 'Ares' },
    'swift': { hero: 'Messenger', demigod: 'Scout', olympian: 'Hermes' },
    'shadow': { hero: 'Shadow Adept', demigod: 'Night Walker', olympian: 'Nyx' },
    'hearth': { hero: 'Keeper', demigod: 'Guardian', olympian: 'Hestia' },
    'wine': { hero: 'Reveler', demigod: 'Celebrant', olympian: 'Dionysus' },
    'magic': { hero: 'Mystic', demigod: 'Occultist', olympian: 'Hecate' }
  };
  
  // Get the upgrade path for this tower type
  const upgradePath = upgradePaths[tower.type] || { 
    hero: 'Hero', 
    demigod: 'Demigod', 
    olympian: tower.upgradeName || 'Olympian' 
  };
  
  return (
    <div className="bg-gray-800 text-white rounded-md p-3 shadow-lg max-w-sm">
      <div className="flex items-start space-x-3">
        {/* Tower icon/sprite */}
        {tower.tier === 'olympian' ? (
          <OlympianSprite olympianName={displayName} size="medium" />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="font-bold text-lg">{displayName.charAt(0)}</span>
          </div>
        )}
        
        <div>
          {/* Tower name and tier */}
          <h3 className="font-bold text-lg">{displayName}</h3>
          <p className="text-sm text-gray-300">{getTierDisplayName(tower.tier)}</p>
          
          {/* Tower stats */}
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            <div>Range: <span className="text-blue-300">{tower.range.toFixed(1)}</span></div>
            <div>Damage: <span className="text-red-300">{tower.damage}</span></div>
            <div>Rate: <span className="text-green-300">{tower.attackSpeed.toFixed(1)}/s</span></div>
            {tower.type && (
              <div>Type: <span className="text-purple-300">{tower.type}</span></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Upgrade information */}
      {hasUpgrade && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Upgrade to: <span className="font-semibold text-yellow-300">{tower.upgradeName}</span></span>
            <ResourceIcon 
              type={ResourceType.TRIBUTE} 
              amount={tower.upgradeCost} 
              size="small" 
            />
          </div>
        </div>
      )}
      
      {/* Upgrade path display */}
      {showUpgradePath && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          <p className="text-xs text-gray-400 mb-1">Upgrade Path:</p>
          <UpgradePathDisplay 
            heroName={upgradePath.hero}
            demigodName={upgradePath.demigod}
            olympianName={upgradePath.olympian}
          />
        </div>
      )}
    </div>
  );
}