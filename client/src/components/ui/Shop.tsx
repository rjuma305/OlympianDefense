import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { heroTowers } from "../../lib/towers";
import { useOlympians } from "../../lib/stores/useOlympians";
import { useResources } from "../../lib/stores/useResources";
import { Coins, ZapIcon, SwordIcon, WandIcon } from "lucide-react";

export default function Shop() {
  const { setPlacementMode } = useOlympians();
  const { resources } = useResources();
  
  const handleSelectTower = (towerId: string) => {
    setPlacementMode(true, towerId);
  };
  
  // Tower icon mapping
  const getTowerIcon = (type: string) => {
    switch (type) {
      case 'archer':
        return <ZapIcon className="mr-2" size={18} />;
      case 'warrior':
        return <SwordIcon className="mr-2" size={18} />;
      case 'mage':
        return <WandIcon className="mr-2" size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
      <Card className="w-72 max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tower Shop</h2>
            <Badge className="flex items-center">
              <Coins className="mr-1" size={16} />
              {resources}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {heroTowers.map(tower => (
              <div 
                key={tower.id} 
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold flex items-center" style={{ color: tower.color }}>
                    {getTowerIcon(tower.type)}
                    {tower.name}
                  </h3>
                  <Badge variant={resources >= tower.cost ? "default" : "outline"}>
                    {tower.cost}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{tower.description}</p>
                
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="text-center border rounded p-1">
                    <div className="text-xs text-gray-600">Damage</div>
                    <div className="font-semibold">{tower.damage}</div>
                  </div>
                  <div className="text-center border rounded p-1">
                    <div className="text-xs text-gray-600">Range</div>
                    <div className="font-semibold">{tower.range}</div>
                  </div>
                  <div className="text-center border rounded p-1">
                    <div className="text-xs text-gray-600">Speed</div>
                    <div className="font-semibold">{tower.attackSpeed}/s</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectTower(tower.id)}
                  disabled={resources < tower.cost}
                >
                  Place Tower
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
