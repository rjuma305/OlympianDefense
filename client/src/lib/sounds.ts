// Sound loader for the game
interface SoundLoaderProps {
  setBackgroundMusic: (audio: HTMLAudioElement) => void;
  setHitSound: (audio: HTMLAudioElement) => void;
  setSuccessSound: (audio: HTMLAudioElement) => void;
}

// Load all game sounds
export async function loadSounds({
  setBackgroundMusic,
  setHitSound,
  setSuccessSound
}: SoundLoaderProps): Promise<void> {
  
  return new Promise((resolve) => {
    // Background music
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    
    // Hit sound (for attacks)
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.3;
    
    // Success sound (for upgrades, tower placement)
    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    
    // Set the audio elements in the store
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    // All sounds loaded
    resolve();
  });
}

// Start background music (call this when game starts)
export function startBackgroundMusic(backgroundMusic: HTMLAudioElement | null) {
  if (backgroundMusic) {
    backgroundMusic.play().catch(error => {
      console.log("Background music play prevented by browser policy:", error);
    });
  }
}

// Stop background music
export function stopBackgroundMusic(backgroundMusic: HTMLAudioElement | null) {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
}

// Play a sound
export function playSound(sound: HTMLAudioElement) {
  if (sound) {
    // Clone the sound to allow overlapping playback
    const soundClone = sound.cloneNode() as HTMLAudioElement;
    soundClone.play().catch(error => {
      console.log("Sound play prevented by browser policy:", error);
    });
  }
}
