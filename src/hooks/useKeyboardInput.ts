import { useEffect, useCallback } from 'react';
import { getKeyboardMap } from '../utils/noteMapping';
import { MIN_OCTAVE, MAX_OCTAVE } from '../constants/keyboard';

export interface UseKeyboardInputProps {
  baseOctave: number;
  onOctaveChange: (octave: number) => void;
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
}

export const useKeyboardInput = ({
  baseOctave,
  onOctaveChange,
  onNoteStart,
  onNoteStop
}: UseKeyboardInputProps) => {
  const keyboardMap = getKeyboardMap(baseOctave);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Handle octave shifting
    if (e.key === 'ArrowLeft' && !e.repeat) {
      onOctaveChange(Math.max(MIN_OCTAVE, baseOctave - 1));
      return;
    }
    if (e.key === 'ArrowRight' && !e.repeat) {
      onOctaveChange(Math.min(MAX_OCTAVE, baseOctave + 1));
      return;
    }
    
    if (e.repeat) return;
    const note = keyboardMap[e.key.toLowerCase()];
    if (note) onNoteStart(note);
  }, [baseOctave, keyboardMap, onOctaveChange, onNoteStart]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const note = keyboardMap[e.key.toLowerCase()];
    if (note) onNoteStop(note);
  }, [keyboardMap, onNoteStop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};