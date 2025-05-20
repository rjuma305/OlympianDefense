import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Scene } from './Scene';
import { useOlympians } from '../../lib/stores/useOlympians';
import { useWaves } from '../../lib/stores/useWaves';
import { updateGameState } from '../../lib/gameLogic';

// Main game component that handles the game loop
export default function Game() {
  // Refs for timing
  const lastUpdateTimeRef = useRef(Date.now());
  
  // Game state
  const gameState = useOlympians(state => state.gameState);
  const showShop = useOlympians(state => state.showShop);
  
  // Keyboard controls
  const nextWavePressed = useKeyboardControls(state => state.nextWave);
  const toggleShopPressed = useKeyboardControls(state => state.toggleShop);
  
  // Handle key presses
  const lastNextWaveRef = useRef(false);
  const lastToggleShopRef = useRef(false);
  
  // Game loop
  useFrame(() => {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000; // Convert to seconds
    lastUpdateTimeRef.current = currentTime;
    
    // Only update game when playing
    if (gameState === 'playing') {
      updateGameState(deltaTime);
      
      // Handle next wave key press
      if (nextWavePressed && !lastNextWaveRef.current) {
        const { isSpawning, startNextWave } = useWaves.getState();
        if (!isSpawning) {
          startNextWave();
        }
      }
      lastNextWaveRef.current = nextWavePressed;
      
      // Handle shop toggle key press
      if (toggleShopPressed && !lastToggleShopRef.current) {
        useOlympians.getState().toggleShop();
      }
      lastToggleShopRef.current = toggleShopPressed;
    }
  });
  
  return (
    <>
      <Scene />
    </>
  );
}
