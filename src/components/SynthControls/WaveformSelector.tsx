import React from 'react';
import { WAVEFORM_OPTIONS, WaveformType } from '../../constants/synth';
import './SynthControls.css';

export interface WaveformSelectorProps {
  waveform: WaveformType;
  onChange: (waveform: WaveformType) => void;
}

export const WaveformSelector: React.FC<WaveformSelectorProps> = ({ waveform, onChange }) => {
  return (
    <div className="control-section">
      <h3>Waveform</h3>
      <div className="control-content">
        <select 
          value={waveform} 
          onChange={(e) => onChange(e.target.value as WaveformType)}
          className="control-select"
        >
          {WAVEFORM_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};