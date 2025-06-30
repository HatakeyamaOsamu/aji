import React from 'react';
import './SynthControls.css';

export interface EnvelopeControlProps {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  onAttackChange: (value: number) => void;
  onDecayChange: (value: number) => void;
  onSustainChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
}

export const EnvelopeControl: React.FC<EnvelopeControlProps> = ({
  attack,
  decay,
  sustain,
  release,
  onAttackChange,
  onDecayChange,
  onSustainChange,
  onReleaseChange
}) => {
  return (
    <div className="control-section">
      <h3>Envelope</h3>
      <div className="control-content envelope-grid">
        <div className="envelope-control">
          <label>Attack: {attack}s</label>
          <input
            type="range"
            min="0.001"
            max="2"
            step="0.001"
            value={attack}
            onChange={(e) => onAttackChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="envelope-control">
          <label>Decay: {decay}s</label>
          <input
            type="range"
            min="0.001"
            max="2"
            step="0.001"
            value={decay}
            onChange={(e) => onDecayChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="envelope-control">
          <label>Sustain: {sustain}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sustain}
            onChange={(e) => onSustainChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="envelope-control">
          <label>Release: {release}s</label>
          <input
            type="range"
            min="0.001"
            max="5"
            step="0.001"
            value={release}
            onChange={(e) => onReleaseChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
      </div>
    </div>
  );
};