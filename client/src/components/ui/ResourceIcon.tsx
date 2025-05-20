import React from 'react';
import { ResourceType } from '../../lib/resources';

interface ResourceIconProps {
  type: ResourceType;
  size?: 'small' | 'medium' | 'large';
  amount?: number;
  showAmount?: boolean;
  className?: string;
}

export function ResourceIcon({ 
  type, 
  size = 'medium', 
  amount, 
  showAmount = true,
  className = '' 
}: ResourceIconProps) {
  
  // Define size classes
  const sizeClasses = {
    small: 'w-4 h-4 text-xs',
    medium: 'w-6 h-6 text-sm',
    large: 'w-8 h-8 text-base'
  };
  
  // Define colors and icons for each resource type
  const resourceStyles: Record<ResourceType, { color: string; icon: string; bgColor: string }> = {
    [ResourceType.TRIBUTE]: { 
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-100',
      icon: '🏛️' // Temple/tribute icon
    },
    [ResourceType.ESSENCE]: { 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-100',
      icon: '✨' // Sparkles/essence icon
    },
    [ResourceType.RELIC_SHARD]: { 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-100',
      icon: '🔮' // Crystal/relic icon
    }
  };
  
  const { color, bgColor, icon } = resourceStyles[type];
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`${sizeClasses[size]} ${color} ${bgColor} rounded-full flex items-center justify-center`}>
        <span>{icon}</span>
      </div>
      
      {showAmount && amount !== undefined && (
        <span className={`font-medium ${color}`}>
          {amount}
        </span>
      )}
    </div>
  );
}

// Resource list component to show multiple resources
interface ResourceListProps {
  tribute?: number;
  essence?: number;
  relicShards?: number;
  size?: 'small' | 'medium' | 'large';
}

export function ResourceList({ 
  tribute, 
  essence, 
  relicShards, 
  size = 'medium' 
}: ResourceListProps) {
  return (
    <div className="flex items-center gap-4">
      {tribute !== undefined && (
        <ResourceIcon 
          type={ResourceType.TRIBUTE} 
          amount={tribute} 
          size={size} 
        />
      )}
      
      {essence !== undefined && (
        <ResourceIcon 
          type={ResourceType.ESSENCE} 
          amount={essence} 
          size={size} 
        />
      )}
      
      {relicShards !== undefined && (
        <ResourceIcon 
          type={ResourceType.RELIC_SHARD} 
          amount={relicShards} 
          size={size} 
        />
      )}
    </div>
  );
}