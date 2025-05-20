import { Card } from "./card";
import { Button } from "./button";
import { useOlympians } from "../../lib/stores/useOlympians";
import { Badge } from "./badge";
import { Info, XIcon } from "lucide-react";

export default function TowerSelector() {
  const { setPlacementMode, selectedBlueprint } = useOlympians();
  
  // Get the tower type from the selected blueprint
  let towerType = "unknown";
  if (selectedBlueprint === "archer") towerType = "Archer";
  if (selectedBlueprint === "warrior") towerType = "Warrior";
  if (selectedBlueprint === "mage") towerType = "Mage";
  
  const handleCancel = () => {
    setPlacementMode(false);
  };
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
      <Card className="p-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-bold mr-2">Placing {towerType}</h3>
          <Badge variant="outline" className="flex items-center">
            <Info className="mr-1" size={14} />
            Click to place
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Place the tower on any valid location (green preview). Red indicates an invalid placement.
        </p>
        
        <Button 
          variant="destructive" 
          className="flex items-center" 
          onClick={handleCancel}
        >
          <XIcon className="mr-1" size={16} />
          Cancel Placement
        </Button>
      </Card>
    </div>
  );
}
