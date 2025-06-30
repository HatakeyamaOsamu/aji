import React, { useRef } from 'react';
import './Piano.css';

export interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  position: number;
  keyboardKey?: string;
  isActive: boolean;
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack,
  position,
  keyboardKey,
  isActive,
  onNoteStart,
  onNoteStop
}) => {
  const isPressedRef = useRef(false);
  
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isPressedRef.current) return;
    isPressedRef.current = true;
    onNoteStart(note);
  };
  
  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    onNoteStop(note);
  };
  
  return (
    <div
      className={`piano-key ${isBlack ? 'black-key' : 'white-key'} ${isActive ? 'active' : ''}`}
      style={{ left: `${position}px` }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={() => {
        if (isPressedRef.current) {
          isPressedRef.current = false;
          onNoteStop(note);
        }
      }}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      {keyboardKey && <span className="key-label">{keyboardKey.toUpperCase()}</span>}
      {!isBlack && <span className="note-label">{note}</span>}
    </div>
  );
};