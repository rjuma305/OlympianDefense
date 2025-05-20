import { useState } from "react";
import { createPortal } from "react-dom";
import { useOlympians } from "../../lib/stores/useOlympians";
import { useResources } from "../../lib/stores/useResources";
import { useWaves } from "../../lib/stores/useWaves";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";
import Shop from "./Shop";
import TowerSelector from "./TowerSelector";
import GameOver from "./GameOver";
import AbilityUI from "./AbilityUI";
import { TalentTreeUI } from "./TalentTreeUI";
import { Olympian, Tower } from "../../types";
import { AlertCircle, Info, Crown, Coins, Heart, Shield, Swords, Sparkles } from "lucide-react";

export default function GameUI() {
  const { 
    gameState, 
    gameOverState,
    startGame, 
    zeusHealth, 
    maxZeusHealth,
    titanKeep,
    placementMode,
    selectedTower,
    upgradeMode,
    setUpgradeMode,
    upgradeTower,
    deselectTower,
    showShop,
    toggleShop,
    towers
  } = useOlympians();
  
  const [showTalentTree, setShowTalentTree] = useState(false);
  
  const { resources } = useResources();
  const { currentWave, isSpawning, startNextWave } = useWaves();
  
  const [showInstructions, setShowInstructions] = useState(false);
  
  // If player is in tower placement mode, show the tower selector
  if (placementMode) {
    return <TowerSelector />;
  }
  
  return createPortal(
    <div className="absolute inset-0 pointer-events-none">
      {/* Game state UI */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <Card className="w-96 pointer-events-auto">
            <div className="p-6 flex flex-col items-center">
              <h1 className="text-3xl font-bold mb-4 text-center text-primary">The Olympians</h1>
              <p className="text-center mb-6">
                Defend Mount Olympus from the invading Titans! Build and upgrade towers to protect Zeus and defeat Kronos.
              </p>
              
              <Button 
                className="w-full mb-2" 
                onClick={() => startGame()}
              >
                Start Game
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowInstructions(!showInstructions)}
              >
                {showInstructions ? "Hide" : "Show"} Instructions
              </Button>
              
              {showInstructions && (
                <div className="mt-4 bg-gray-100 p-4 rounded-md text-sm">
                  <h3 className="font-bold mb-2">How to Play:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Place towers to defend the path to Mount Olympus</li>
                    <li>Defeat enemies to earn resources</li>
                    <li>Upgrade your towers from heroes to demigods to Olympians</li>
                    <li>Don't let enemies reach Zeus</li>
                    <li>Defeat Kronos to win</li>
                  </ul>
                  
                  <h3 className="font-bold mt-3 mb-2">Controls:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><kbd>P</kbd> - Place selected tower</li>
                    <li><kbd>ESC</kbd> - Cancel placement</li>
                    <li><kbd>U</kbd> - Upgrade selected tower</li>
                    <li><kbd>N</kbd> - Start next wave</li>
                    <li><kbd>B</kbd> - Toggle shop</li>
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
      
      {gameState === 'gameOver' && <GameOver state={gameOverState} />}
      
      {/* In-game UI */}
      {gameState === 'playing' && (
        <>
          {/* Top bar - Resources, Zeus health and Titan Keep health */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <div className="bg-black bg-opacity-70 rounded-lg p-2 flex items-center pointer-events-auto">
              <Coins className="text-yellow-400 mr-2" size={20} />
              <span className="text-white font-bold">{resources}</span>
            </div>
            
            <div className="bg-black bg-opacity-70 rounded-lg p-2 flex items-center">
              <span className="text-white mr-2">Mount Olympus:</span>
              <Progress 
                value={(zeusHealth / maxZeusHealth) * 100} 
                className="w-32"
                indicatorClassName="bg-blue-500"
              />
              <Heart className="text-blue-500 ml-2" size={20} />
            </div>
            
            <div className="bg-black bg-opacity-70 rounded-lg p-2 flex items-center">
              <span className="text-white mr-2">Titan Keep:</span>
              <Progress 
                value={(titanKeep?.health || 0) / (titanKeep?.maxHealth || 1) * 100} 
                className="w-32"
                indicatorClassName="bg-red-500"
              />
              <Swords className="text-red-500 ml-2" size={20} />
            </div>
            
            <div className="bg-black bg-opacity-70 rounded-lg p-2 flex items-center">
              <Shield className="text-blue-400 mr-2" size={20} />
              <span className="text-white">Wave: {currentWave}</span>
            </div>
          </div>
          
          {/* Selected tower info */}
          {selectedTower && (
            <div className="absolute bottom-24 left-4 pointer-events-auto">
              <Card className="w-64">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">
                      {selectedTower.type.charAt(0).toUpperCase() + selectedTower.type.slice(1)}
                    </h3>
                    <Badge>
                      {selectedTower.tier.charAt(0).toUpperCase() + selectedTower.tier.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span>Damage:</span>
                      <span>{selectedTower.damage.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Range:</span>
                      <span>{selectedTower.range.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attack Speed:</span>
                      <span>{selectedTower.attackSpeed.toFixed(1)}/s</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedTower.upgradeName && (
                      <Button 
                        className="flex-1"
                        onClick={() => setUpgradeMode(!upgradeMode)}
                        variant={upgradeMode ? "destructive" : "default"}
                      >
                        {upgradeMode ? "Cancel" : "Upgrade"}
                      </Button>
                    )}
                    
                    {selectedTower.tier === 'olympian' && (
                      <Button 
                        className="flex-1"
                        onClick={() => setShowTalentTree(true)}
                        variant="secondary"
                      >
                        <Sparkles className="mr-1" size={16} />
                        Talents
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => deselectTower()}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Tower upgrade confirmation */}
          {upgradeMode && selectedTower && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <Card className="w-72">
                <div className="p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Crown className="text-yellow-400 mr-2" size={20} />
                    Upgrade Tower
                  </h3>
                  
                  <p className="mb-4">
                    Upgrade {selectedTower.type} to {selectedTower.upgradeName} for {selectedTower.upgradeCost} resources?
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        upgradeTower(selectedTower.id);
                        setUpgradeMode(false);
                      }}
                      disabled={resources < selectedTower.upgradeCost}
                    >
                      Upgrade
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setUpgradeMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Next wave button */}
          <div className="absolute bottom-4 right-4 pointer-events-auto">
            <Button
              onClick={() => startNextWave()}
              disabled={isSpawning}
              className="flex items-center"
            >
              <Swords className="mr-2" size={20} />
              {isSpawning ? `Wave ${currentWave} in progress...` : `Start Wave ${currentWave + 1}`}
            </Button>
          </div>
          
          {/* Shop toggle button */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <Button
              onClick={() => toggleShop()}
              variant={showShop ? "destructive" : "default"}
            >
              {showShop ? "Close Shop" : "Open Shop"}
            </Button>
          </div>
          
          {/* Abilities UI for Olympian towers */}
          <AbilityUI />
          
          {/* Shop panel */}
          {showShop && <Shop />}
          
          {/* Talent Tree UI */}
          {showTalentTree && selectedTower && selectedTower.tier === 'olympian' && (
            <TalentTreeUI 
              tower={selectedTower as Olympian}
              onClose={() => setShowTalentTree(false)}
            />
          )}
        </>
      )}
    </div>,
    document.body
  );
}
