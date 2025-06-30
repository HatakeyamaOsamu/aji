import React from 'react';
import { PianoKey } from './PianoKey';
import { PianoKey as PianoKeyType } from '../../utils/pianoKeyGenerator';
import { OCTAVE_WIDTH } from '../../utils/pianoKeyGenerator';
import './Piano.css';

export interface PianoProps {
  pianoKeys: PianoKeyType[];
  activeKeys: Set<string>;
  keyboardMap: Record<string, string>;
  startOctave: number;
  numOctaves: number;
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
}

export const Piano: React.FC<PianoProps> = ({
  pianoKeys,
  activeKeys,
  keyboardMap,
  startOctave,
  numOctaves,
  onNoteStart,
  onNoteStop
}) => {
  return (
    <div className="keyboard-wrapper">
      <div className="virtual-keyboard extended">
        {/* Render white keys first */}
        {pianoKeys.filter(key => !key.isBlack).map(key => {
          const keyboardKey = Object.entries(keyboardMap).find(([_, n]) => n === key.note)?.[0];
          return (
            <PianoKey
              key={key.note}
              note={key.note}
              isBlack={false}
              position={key.position}
              keyboardKey={keyboardKey}
              isActive={activeKeys.has(key.note)}
              onNoteStart={onNoteStart}
              onNoteStop={onNoteStop}
            />
          );
        })}
        {/* Render black keys on top */}
        {pianoKeys.filter(key => key.isBlack).map(key => {
          const keyboardKey = Object.entries(keyboardMap).find(([_, n]) => n === key.note)?.[0];
          return (
            <PianoKey
              key={key.note}
              note={key.note}
              isBlack={true}
              position={key.position}
              keyboardKey={keyboardKey}
              isActive={activeKeys.has(key.note)}
              onNoteStart={onNoteStart}
              onNoteStop={onNoteStop}
            />
          );
        })}
        
        {/* Octave indicators */}
        {Array.from({ length: numOctaves }, (_, i) => (
          <div
            key={i}
            className="octave-indicator"
            style={{ left: `${i * OCTAVE_WIDTH}px` }}
          >
            C{startOctave + i}
          </div>
        ))}
      </div>
    </div>
  );
};