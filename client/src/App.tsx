import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Game from "./components/game/Game";
import GameUI from "./components/ui/GameUI";
import { useOlympians } from "./lib/stores/useOlympians";
import { useAudio } from "./lib/stores/useAudio";
import { loadSounds } from "./lib/sounds";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "place", keys: ["KeyP"] },
  { name: "cancel", keys: ["Escape"] },
  { name: "upgrade", keys: ["KeyU"] },
  { name: "nextWave", keys: ["KeyN"] },
  { name: "toggleShop", keys: ["KeyB"] },
];

// Main App component
function App() {
  const { gameState, initialize } = useOlympians();
  const [loaded, setLoaded] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Initialize the game and load sounds
  useEffect(() => {
    initialize();
    
    // Load game sounds
    loadSounds({ 
      setBackgroundMusic, 
      setHitSound, 
      setSuccessSound 
    }).then(() => {
      setLoaded(true);
    });
  }, [initialize, setBackgroundMusic, setHitSound, setSuccessSound]);

  if (!loaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <div className="text-white text-3xl font-bold">Loading The Olympians...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 20, 20],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#87ceeb"]} />
          <OrbitControls 
            enableZoom={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            minDistance={5}
            maxDistance={50}
          />
          <Game />
        </Canvas>
        <GameUI />
      </KeyboardControls>
    </div>
  );
}

export default App;
