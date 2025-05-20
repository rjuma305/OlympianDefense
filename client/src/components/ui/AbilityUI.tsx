import { useState, useEffect } from 'react';
import { Ability, Tower, Olympian } from '../../types';
import { useOlympians } from '../../lib/stores/useOlympians';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Zap, Clock, Info } from 'lucide-react';
import { getAbilityCooldownPercentage } from '../../lib/abilities';

interface AbilityCardProps {
  ability: Ability;
  onUse: () => void;
}

function AbilityCard({ ability, onUse }: AbilityCardProps) {
  const [cooldown, setCooldown] = useState(getAbilityCooldownPercentage(ability));

  // Update cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown(getAbilityCooldownPercentage(ability));
    }, 100);
    
    return () => clearInterval(interval);
  }, [ability]);

  return (
    <Card className="p-4 flex flex-col w-full mb-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold flex items-center">
          <Zap className="mr-2 text-yellow-500" size={20} />
          {ability.name}
        </h3>
        <Badge variant={ability.isReady ? "default" : "outline"} className="mr-1">
          {ability.isReady ? "Ready" : "Cooldown"}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500 mb-3">{ability.description}</p>
      
      {!ability.isReady && (
        <div className="flex items-center mb-2">
          <Clock className="mr-2 text-blue-500" size={16} />
          <Progress value={cooldown} className="flex-grow" />
        </div>
      )}
      
      <Button 
        onClick={onUse} 
        disabled={!ability.isReady}
        variant={ability.isReady ? "default" : "outline"}
        className="w-full"
      >
        {ability.isReady ? 'Activate Ability' : `Cooldown: ${Math.ceil((ability.cooldown - (Date.now() - ability.lastUsed)) / 1000)}s`}
      </Button>
    </Card>
  );
}

export default function AbilityUI() {
  const { selectedTower } = useOlympians();
  
  // selectedTower is already the Tower object, no need to find it again
  const tower = selectedTower;
  
  // Check if it's an Olympian with abilities
  const isOlympian = tower && tower.tier === 'olympian' as const;
  
  if (!tower || !isOlympian) return null;
  
  const olympianTower = tower as Olympian;
  
  // Check if the tower has abilities
  const hasSpecialAbility = !!olympianTower.specialAbility;
  const hasUltimateAbility = !!olympianTower.ultimateAbility;
  
  if (!hasSpecialAbility && !hasUltimateAbility) return null;
  
  // Handlers for using abilities
  const handleUseSpecialAbility = () => {
    if (olympianTower.specialAbility && olympianTower.specialAbility.isReady) {
      console.log('Using special ability:', olympianTower.specialAbility.name);
      
      // Import and use the triggerAbility function
      import('../../lib/abilityEffects').then(({ triggerAbility }) => {
        // Create a copy of the tower with the updated ability
        const updatedAbility = triggerAbility(olympianTower, olympianTower.specialAbility!);
        
        // Update the tower in the game state
        const updatedTower = {
          ...olympianTower,
          specialAbility: updatedAbility
        };
        
        // Update the tower in the state
        const { towers } = useOlympians.getState();
        const towerIndex = towers.findIndex(t => t.id === olympianTower.id);
        
        if (towerIndex !== -1) {
          const updatedTowers = [...towers];
          updatedTowers[towerIndex] = updatedTower;
          useOlympians.setState({ towers: updatedTowers });
        }
      });
    }
  };
  
  const handleUseUltimateAbility = () => {
    if (olympianTower.ultimateAbility && olympianTower.ultimateAbility.isReady) {
      console.log('Using ultimate ability:', olympianTower.ultimateAbility.name);
      
      // Import and use the triggerAbility function
      import('../../lib/abilityEffects').then(({ triggerAbility }) => {
        // Create a copy of the tower with the updated ability
        const updatedAbility = triggerAbility(olympianTower, olympianTower.ultimateAbility!);
        
        // Update the tower in the game state
        const updatedTower = {
          ...olympianTower,
          ultimateAbility: updatedAbility
        };
        
        // Update the tower in the state
        const { towers } = useOlympians.getState();
        const towerIndex = towers.findIndex(t => t.id === olympianTower.id);
        
        if (towerIndex !== -1) {
          const updatedTowers = [...towers];
          updatedTowers[towerIndex] = updatedTower;
          useOlympians.setState({ towers: updatedTowers });
        }
      });
    }
  };
  
  return (
    <div className="absolute right-4 top-1/3 transform -translate-y-1/2 pointer-events-auto">
      <Card className="p-4 bg-black bg-opacity-80 border-yellow-500 w-64">
        <div className="flex items-center mb-4">
          <Zap className="mr-2 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Divine Powers</h2>
        </div>
        
        <div className="space-y-3">
          {hasSpecialAbility && (
            <AbilityCard 
              ability={olympianTower.specialAbility!} 
              onUse={handleUseSpecialAbility} 
            />
          )}
          
          {hasUltimateAbility && (
            <AbilityCard 
              ability={olympianTower.ultimateAbility!} 
              onUse={handleUseUltimateAbility} 
            />
          )}
        </div>
        
        <div className="mt-4 flex items-start text-xs text-gray-400">
          <Info className="mr-2 flex-shrink-0" size={14} />
          <p>Select an Olympian tower to use its divine powers against the Titans</p>
        </div>
      </Card>
    </div>
  );
}