import { Card } from "./card";
import { Button } from "./button";
import { GameOverState } from "../../types";
import { useOlympians } from "../../lib/stores/useOlympians";
import { Trophy, SkullIcon } from "lucide-react";

interface GameOverProps {
  state: GameOverState | null;
}

export default function GameOver({ state }: GameOverProps) {
  const { initialize, startGame, titanKeep } = useOlympians();
  
  const handleRestart = () => {
    initialize();
    startGame();
  };
  
  // Check if victory is due to Titan Keep destruction
  const isTitanKeepDestroyed = titanKeep?.isDefeated || false;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <Card className="w-96 pointer-events-auto">
        <div className="p-6 flex flex-col items-center">
          {state === 'victory' ? (
            <>
              <Trophy className="text-yellow-400 w-16 h-16 mb-4" />
              <h1 className="text-3xl font-bold mb-2 text-center text-green-600">Victory!</h1>
              {isTitanKeepDestroyed ? (
                <p className="text-center mb-6">
                  You have destroyed the Titan Keep! The Titans' stronghold has fallen, and Mount Olympus is safe once more. The Olympians celebrate your triumph!
                </p>
              ) : (
                <p className="text-center mb-6">
                  You have defeated Kronos and saved Mount Olympus! Zeus and the Olympians can now rest easy knowing their realm is secure.
                </p>
              )}
            </>
          ) : (
            <>
              <SkullIcon className="text-red-500 w-16 h-16 mb-4" />
              <h1 className="text-3xl font-bold mb-2 text-center text-red-600">Defeat</h1>
              <p className="text-center mb-6">
                Zeus has fallen and Mount Olympus has been conquered by the Titans. The age of the Olympians has come to an end.
              </p>
            </>
          )}
          
          <Button 
            className="w-full" 
            onClick={handleRestart}
          >
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
}
