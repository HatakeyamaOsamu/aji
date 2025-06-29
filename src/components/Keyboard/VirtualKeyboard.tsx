import React, { useEffect, useCallback } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { PianoKey } from './PianoKey';

// Keyboard mapping
const KEYBOARD_MAP: Record<string, string> = {
  // Lower octave (C3-B3)
  'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
  'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3',
  'j': 'A#3', 'm': 'B3',
  // Upper octave (C4-B4)
  'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4',
  'r': 'F4', '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4',
  '7': 'A#4', 'u': 'B4', 'i': 'C5'
};

const PIANO_KEYS = [
  { note: 'C3', isBlack: false, position: 0 },
  { note: 'C#3', isBlack: true, position: 28 },
  { note: 'D3', isBlack: false, position: 40 },
  { note: 'D#3', isBlack: true, position: 68 },
  { note: 'E3', isBlack: false, position: 80 },
  { note: 'F3', isBlack: false, position: 120 },
  { note: 'F#3', isBlack: true, position: 148 },
  { note: 'G3', isBlack: false, position: 160 },
  { note: 'G#3', isBlack: true, position: 188 },
  { note: 'A3', isBlack: false, position: 200 },
  { note: 'A#3', isBlack: true, position: 228 },
  { note: 'B3', isBlack: false, position: 240 },
  { note: 'C4', isBlack: false, position: 280 },
  { note: 'C#4', isBlack: true, position: 308 },
  { note: 'D4', isBlack: false, position: 320 },
  { note: 'D#4', isBlack: true, position: 348 },
  { note: 'E4', isBlack: false, position: 360 },
  { note: 'F4', isBlack: false, position: 400 },
  { note: 'F#4', isBlack: true, position: 428 },
  { note: 'G4', isBlack: false, position: 440 },
  { note: 'G#4', isBlack: true, position: 468 },
  { note: 'A4', isBlack: false, position: 480 },
  { note: 'A#4', isBlack: true, position: 508 },
  { note: 'B4', isBlack: false, position: 520 },
  { note: 'C5', isBlack: false, position: 560 },
];

export const VirtualKeyboard: React.FC = () => {
  const { startNote, stopNote } = useSynth();
  const [activeKeys, setActiveKeys] = React.useState<Set<string>>(new Set());

  const handleNoteStart = useCallback((note: string) => {
    startNote(note, note);
    setActiveKeys(prev => new Set(prev).add(note));
  }, [startNote]);

  const handleNoteStop = useCallback((note: string) => {
    stopNote(note);
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, [stopNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note && !activeKeys.has(note)) {
        handleNoteStart(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) {
        handleNoteStop(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Stop all active notes on unmount
      activeKeys.forEach(note => stopNote(note));
    };
  }, [activeKeys, handleNoteStart, handleNoteStop, stopNote]);

  // Find keyboard key for note
  const getKeyboardKey = (note: string): string | undefined => {
    return Object.entries(KEYBOARD_MAP).find(([key, n]) => n === note)?.[0];
  };

  return (
    <div className="virtual-keyboard">
      {/* Render white keys first */}
      {PIANO_KEYS.filter(key => !key.isBlack).map(key => (
        <PianoKey
          key={key.note}
          note={key.note}
          isBlack={false}
          position={key.position}
          isActive={activeKeys.has(key.note)}
          keyboardKey={getKeyboardKey(key.note)}
          onNoteStart={handleNoteStart}
          onNoteStop={handleNoteStop}
        />
      ))}
      {/* Render black keys on top */}
      {PIANO_KEYS.filter(key => key.isBlack).map(key => (
        <PianoKey
          key={key.note}
          note={key.note}
          isBlack={true}
          position={key.position}
          isActive={activeKeys.has(key.note)}
          keyboardKey={getKeyboardKey(key.note)}
          onNoteStart={handleNoteStart}
          onNoteStop={handleNoteStop}
        />
      ))}
    </div>
  );
};