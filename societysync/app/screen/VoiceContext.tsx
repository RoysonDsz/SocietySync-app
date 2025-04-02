// src/context/VoiceContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import * as Speech from 'expo-speech';

// Define context type
interface VoiceContextType {
  speak: (text: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

interface VoiceProviderProps {
  children: ReactNode;
}

// Provide global speak function
export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const speak = (text: string) => {
    Speech.speak(text);
  };

  return (
    <VoiceContext.Provider value={{ speak }}>
      {children}
    </VoiceContext.Provider>
  );
};

// Custom hook for easy access
export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error("useVoice must be used within VoiceProvider");
  return context;
};
