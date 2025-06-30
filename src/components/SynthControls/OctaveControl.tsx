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