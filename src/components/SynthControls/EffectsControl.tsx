import React from 'react';
import './SynthControls.css';

export interface EffectsControlProps {
  reverbWet: number;
  delayWet: number;
  chorusWet: number;
  onReverbChange: (value: number) => void;
  onDelayChange: (value: number) => void;
  onChorusChange: (value: number) => void;
}

export const EffectsControl: React.FC<EffectsControlProps> = ({
  reverbWet,
  delayWet,
  chorusWet,
  onReverbChange,
  onDelayChange,
  onChorusChange
}) => {
  return (
    <div className="control-section">
      <h3>Effects</h3>
      <div className="control-content effects-grid">
        <div className="effect-control">
          <label>Reverb: {(reverbWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbWet}
            onChange={(e) => onReverbChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="effect-control">
          <label>Delay: {(delayWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delayWet}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
        <div className="effect-control">
          <label>Chorus: {(chorusWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={chorusWet}
            onChange={(e) => onChorusChange(Number(e.target.value))}
            className="control-slider"
          />
        </div>
      </div>
    </div>
  );
};