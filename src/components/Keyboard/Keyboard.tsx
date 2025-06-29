import React from 'react';

export const Keyboard: React.FC = () => {
  return (
    <div className="keyboard-container">
      <div className="virtual-keyboard">
        {/* TODO: Implement virtual keyboard */}
        <p>Virtual keyboard coming soon...</p>
      </div>
      <div className="keyboard-hints">
        <span className="hint">Use keyboard keys Z-M (lower octave) and Q-I (upper octave) to play</span>
      </div>
    </div>
  );
};