import React, { useState } from 'react';
import { X, Lightbulb, Crown, CheckCircle, Lock } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Olympian } from '../../types';
import { talentTrees, applyTalent } from '../../lib/talentTree';
import { useResources } from '../../lib/stores/useResources';
import { ResourceType } from '../../lib/resources';

interface TalentTreeUIProps {
  tower: Olympian;
  onClose: () => void;
}

export function TalentTreeUI({ tower, onClose }: TalentTreeUIProps) {
  const relicShards = useResources(state => state[ResourceType.RELIC_SHARD]);
  const [selectedTier, setSelectedTier] = useState(0);
  const [talentStatus, setTalentStatus] = useState<Record<string, boolean>>({});
  
  // Get the talent tree for this tower's type
  const talentTree = talentTrees[tower.type];
  if (!talentTree) return null;
  
  const handleSelectTalent = (talentId: string) => {
    const success = applyTalent(tower.type, talentId, tower.id);
    
    if (success) {
      setTalentStatus({
        ...talentStatus,
        [talentId]: true
      });
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 pointer-events-auto">
      <Card className="w-[600px] max-h-[80vh] overflow-y-auto relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Crown className="mr-2 text-yellow-500" size={24} /> 
              {talentTree.name} Talent Tree
            </h2>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
          
          <p className="text-gray-500 mb-6">{talentTree.description}</p>
          
          <div className="flex gap-4 mb-6">
            {talentTree.tiers.map((tier, index) => (
              <Button 
                key={tier.name} 
                variant={selectedTier === index ? "default" : "outline"}
                onClick={() => setSelectedTier(index)}
              >
                {tier.name}
              </Button>
            ))}
          </div>
          
          <Separator className="mb-6" />
          
          <div className="space-y-8">
            {talentTree.tiers[selectedTier].options.map(talent => {
              const isUnlocked = talentStatus[talent.id] || talent.isUnlocked;
              const hasPrerequisite = !talent.prerequisite || 
                talentStatus[talent.prerequisite] || 
                talentTree.tiers.some(t => 
                  t.options.some(o => o.id === talent.prerequisite && o.isUnlocked)
                );
              
              return (
                <div 
                  key={talent.id}
                  className={`p-4 border rounded-lg ${isUnlocked ? 'bg-green-900 bg-opacity-20 border-green-500' : 'bg-gray-800 border-gray-700'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {isUnlocked ? (
                        <CheckCircle className="mr-2 text-green-500" size={20} />
                      ) : (
                        <Lightbulb className="mr-2 text-yellow-500" size={20} />
                      )}
                      <h3 className="text-lg font-semibold">{talent.name}</h3>
                    </div>
                    
                    <Badge variant={isUnlocked ? "secondary" : "outline"}>
                      {isUnlocked ? "Unlocked" : `${talent.cost} Relic Shards`}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 mb-4">{talent.description}</p>
                  
                  {talent.prerequisite && !hasPrerequisite && (
                    <div className="flex items-center text-sm text-orange-400 mb-2">
                      <Lock size={14} className="mr-1" />
                      Requires prerequisite talent
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      variant={isUnlocked ? "secondary" : "default"}
                      disabled={isUnlocked || !hasPrerequisite || relicShards < talent.cost}
                      onClick={() => handleSelectTalent(talent.id)}
                    >
                      {isUnlocked ? "Learned" : "Learn Talent"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}