import { create } from 'zustand';

// Define event types for the game
type EventType = 
  | 'enemyDefeated' 
  | 'towerPlaced' 
  | 'towerUpgraded' 
  | 'waveStarted' 
  | 'waveCompleted'
  | 'gameOver'
  | 'resourceDropped';

// Event listener function type
type EventListener = (data: any) => void;

interface EventsState {
  // Store event listeners by event type
  listeners: Record<EventType, EventListener[]>;
  
  // Function to emit an event with data
  emit: (eventType: EventType, data: any) => void;
  
  // Function to subscribe to an event type
  subscribe: (eventType: EventType, listener: EventListener) => () => void;
  
  // Function to clear all event listeners
  clearAllListeners: () => void;
}

export const useEvents = create<EventsState>((set, get) => ({
  listeners: {
    enemyDefeated: [],
    towerPlaced: [],
    towerUpgraded: [],
    waveStarted: [],
    waveCompleted: [],
    gameOver: [],
    resourceDropped: []
  },
  
  // Emit an event to all listeners of that event type
  emit: (eventType: EventType, data: any) => {
    const { listeners } = get();
    
    // Check if this event type exists
    if (listeners[eventType]) {
      // Call all listeners with the provided data
      listeners[eventType].forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${eventType} event listener:`, error);
        }
      });
    }
  },
  
  // Subscribe to an event type
  subscribe: (eventType: EventType, listener: EventListener) => {
    const { listeners } = get();
    
    // Add the listener to the appropriate event type
    set({
      listeners: {
        ...listeners,
        [eventType]: [...listeners[eventType], listener]
      }
    });
    
    // Return an unsubscribe function
    return () => {
      const currentListeners = get().listeners;
      
      set({
        listeners: {
          ...currentListeners,
          [eventType]: currentListeners[eventType].filter(l => l !== listener)
        }
      });
    };
  },
  
  // Clear all event listeners
  clearAllListeners: () => {
    set({
      listeners: {
        enemyDefeated: [],
        towerPlaced: [],
        towerUpgraded: [],
        waveStarted: [],
        waveCompleted: [],
        gameOver: [],
        resourceDropped: []
      }
    });
  }
}));