import React from 'react';
import './SynthControls.css';

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onChange }) => {
  return (
    <div className="control-section">
      <h3>Volume</h3>
      <div className="control-content">
        <input
          type="range"
          min="-60"
          max="0"
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          className="control-slider"
        />
        <span className="control-value">{volume} dB</span>
      </div>
    </div>
  );
};