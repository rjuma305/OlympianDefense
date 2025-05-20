import React from 'react';
import { ResourceType } from '../../lib/resources';
import { useResources } from '../../lib/stores/useResources';

const ResourceDisplay: React.FC = () => {
  const tribute = useResources((state) => state[ResourceType.TRIBUTE]);
  const essence = useResources((state) => state[ResourceType.ESSENCE]);
  const relicShards = useResources((state) => state[ResourceType.RELIC_SHARD]);

  return (
    <div className="absolute top-2 right-2 flex gap-4 bg-black/70 backdrop-blur-sm p-2 rounded text-white z-50">
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
          <span className="text-xs">T</span>
        </div>
        <span>{tribute} Tribute</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
          <span className="text-xs">E</span>
        </div>
        <span>{essence} Essence</span>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center">
          <span className="text-xs">R</span>
        </div>
        <span>{relicShards} Relics</span>
      </div>
    </div>
  );
};

export default ResourceDisplay;