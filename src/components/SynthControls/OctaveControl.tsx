import React from 'react';
import { MIN_OCTAVE, MAX_OCTAVE } from '../../constants/keyboard';
import './SynthControls.css';

export interface OctaveControlProps {
  baseOctave: number;
  onChange: (octave: number) => void;
}

export const OctaveControl: React.FC<OctaveControlProps> = ({ baseOctave, onChange }) => {
  return (
    <div className="control-section octave-control">
      <h3>Octave Control</h3>
      <div className="octave-display">
        <button 
          onClick={() => onChange(Math.max(MIN_OCTAVE, baseOctave - 1))} 
          disabled={baseOctave <= MIN_OCTAVE}
          className="octave-button"
        >
          ←
        </button>
        <span className="octave-value">Base Octave: {baseOctave}</span>
        <button 
          onClick={() => onChange(Math.min(MAX_OCTAVE, baseOctave + 1))} 
          disabled={baseOctave >= MAX_OCTAVE}
          className="octave-button"
        >
          →
        </button>
      </div>
      <p className="hint">Use ← → arrow keys to shift octaves</p>
    </div>
  );
};

// Add to SynthControls.css
const octaveStyles = `
.octave-control {
  grid-column: span 2;
}

.octave-display {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}

.octave-button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.octave-button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #4CAF50;
}

.octave-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.octave-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.hint {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 10px 0 0 0;
}
`;