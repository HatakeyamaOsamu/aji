import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SynthEngine } from '../synth/SynthEngine';
import { EffectController } from '../effects/EffectController';
import type { SynthOptions, FilterSettings, DeepPartial } from '../types';

interface SynthContextType {
  synthEngine: SynthEngine;
  effectController: EffectController;
  voiceCount: number;
  setSynthOptions: (options: DeepPartial<SynthOptions>) => void;
  setFilterSettings: (settings: Partial<FilterSettings>) => void;
  startNote: (key: string, note: string) => Promise<void>;
  stopNote: (key: string) => void;
}

const SynthContext = createContext<SynthContextType | undefined>(undefined);

export const SynthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [synthEngine] = useState(() => new SynthEngine());
  const [effectController] = useState(() => new EffectController(synthEngine));
  const [voiceCount, setVoiceCount] = useState(0);

  useEffect(() => {
    // Set up voice count callback
    synthEngine.setVoiceCountCallback(setVoiceCount);
    
    // Cleanup
    return () => {
      synthEngine.dispose();
    };
  }, [synthEngine]);

  const setSynthOptions = useCallback((options: DeepPartial<SynthOptions>) => {
    synthEngine.setSynthOptions(options);
  }, [synthEngine]);

  const setFilterSettings = useCallback((settings: Partial<FilterSettings>) => {
    synthEngine.setFilterSettings(settings);
  }, [synthEngine]);

  const startNote = useCallback(async (key: string, note: string) => {
    await synthEngine.startNote(key, note);
  }, [synthEngine]);

  const stopNote = useCallback((key: string) => {
    synthEngine.stopNote(key);
  }, [synthEngine]);

  return (
    <SynthContext.Provider 
      value={{
        synthEngine,
        effectController,
        voiceCount,
        setSynthOptions,
        setFilterSettings,
        startNote,
        stopNote
      }}
    >
      {children}
    </SynthContext.Provider>
  );
};

export const useSynth = () => {
  const context = useContext(SynthContext);
  if (!context) {
    throw new Error('useSynth must be used within a SynthProvider');
  }
  return context;
};