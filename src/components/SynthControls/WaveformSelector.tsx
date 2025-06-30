import React from 'react';
import { WAVEFORM_OPTIONS, WaveformType } from '../../constants/synth';
import './SynthControls.css';

export interface WaveformSelectorProps {
  waveform: WaveformType;
  onChange: (waveform: WaveformType) => void;
}

const WaveformDisplay: React.FC<{ waveform: WaveformType }> = ({ waveform }) => {
  const generatePath = (type: WaveformType): string => {
    const width = 80;
    const height = 30;
    const centerY = height / 2;
    
    switch (type) {
      case 'sine':
        return `M 5,${centerY} Q 20,5 35,${centerY} Q 50,${height-5} 65,${centerY} Q 80,5 95,${centerY}`;
      case 'square':
        return `M 5,${height-5} L 5,5 L 25,5 L 25,${height-5} L 45,${height-5} L 45,5 L 65,5 L 65,${height-5} L 85,${height-5}`;
      case 'sawtooth':
        return `M 5,${height-5} L 25,5 L 25,${height-5} L 45,5 L 45,${height-5} L 65,5 L 65,${height-5} L 85,5`;
      case 'triangle':
        return `M 5,${centerY} L 15,5 L 25,${height-5} L 35,5 L 45,${height-5} L 55,5 L 65,${height-5} L 75,5 L 85,${centerY}`;
      default:
        return '';
    }
  };

  return (
    <div className="waveform-display">
      <svg width="90" height="35" viewBox="0 0 100 35">
        <path
          d={generatePath(waveform)}
          stroke="#007bff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

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
        <WaveformDisplay waveform={waveform} />
      </div>
    </div>
  );
};