import React from 'react';
import { ResourceType } from '../../lib/resources';
import { useResources } from '../../lib/stores/useResources';
import { ResourceList } from './ResourceIcon';

export function ResourceDisplay() {
  const { tribute, essence, relicShards } = useResources();
  
  return (
    <div className="fixed top-4 right-4 bg-gray-800 bg-opacity-80 rounded-lg p-3 shadow-lg">
      <h3 className="text-white text-sm font-medium mb-2">Resources</h3>
      <ResourceList 
        tribute={tribute}
        essence={essence}
        relicShards={relicShards}
        size="medium"
      />
    </div>
  );
}

// Component for displaying resource costs (used in buttons, etc.)
interface ResourceCostProps {
  cost: number;
  type: ResourceType;
  canAfford: boolean;
  size?: 'small' | 'medium';
}

export function ResourceCost({ cost, type, canAfford, size = 'small' }: ResourceCostProps) {
  return (
    <div className={`inline-flex items-center space-x-1 ${canAfford ? 'text-white' : 'text-red-400'}`}>
      <ResourceList 
        tribute={type === ResourceType.TRIBUTE ? cost : undefined}
        essence={type === ResourceType.ESSENCE ? cost : undefined}
        relicShards={type === ResourceType.RELIC_SHARD ? cost : undefined}
        size={size}
      />
    </div>
  );
}

// Component for displaying resource rewards (from enemies, etc.)
interface ResourceRewardProps {
  tribute?: number;
  essence?: number;
  relicShards?: number;
  size?: 'small' | 'medium';
}

export function ResourceReward({ 
  tribute, 
  essence, 
  relicShards,
  size = 'small' 
}: ResourceRewardProps) {
  // Only show resources that have values
  const hasRewards = 
    (tribute !== undefined && tribute > 0) || 
    (essence !== undefined && essence > 0) || 
    (relicShards !== undefined && relicShards > 0);
  
  if (!hasRewards) return null;
  
  return (
    <div className="inline-flex items-center bg-gray-900 bg-opacity-75 rounded-md px-2 py-1">
      <span className="text-xs text-gray-300 mr-2">Rewards:</span>
      <ResourceList 
        tribute={tribute && tribute > 0 ? tribute : undefined}
        essence={essence && essence > 0 ? essence : undefined}
        relicShards={relicShards && relicShards > 0 ? relicShards : undefined}
        size={size}
      />
    </div>
  );
}