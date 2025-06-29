import React from 'react';
import { VirtualKeyboard } from './VirtualKeyboard';

export const Keyboard: React.FC = () => {
  return (
    <div className="keyboard-container">
      <VirtualKeyboard />
      <div className="keyboard-hints">
        <span className="hint">Use keyboard keys Z-M (lower octave) and Q-I (upper octave) to play</span>
      </div>
    </div>
  );
};