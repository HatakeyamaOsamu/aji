import React from 'react';

interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  position: number;
  isActive: boolean;
  keyboardKey?: string;
  onNoteStart: (note: string) => void;
  onNoteStop: (note: string) => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isBlack,
  position,
  isActive,
  keyboardKey,
  onNoteStart,
  onNoteStop
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onNoteStart(note);
  };

  const handleMouseUp = () => {
    onNoteStop(note);
  };

  const handleMouseLeave = () => {
    if (isActive) {
      onNoteStop(note);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onNoteStart(note);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    onNoteStop(note);
  };

  const className = `piano-key ${isBlack ? 'black-key' : 'white-key'} ${isActive ? 'active' : ''}`;
  
  return (
    <div
      className={className}
      style={{ left: `${position}px` }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {keyboardKey && <span className="key-label">{keyboardKey.toUpperCase()}</span>}
    </div>
  );
};