import React from 'react';
import './SynthControls.css';

export interface FilterControlProps {
  frequency: number;
  onChange: (frequency: number) => void;
}

export const FilterControl: React.FC<FilterControlProps> = ({ frequency, onChange }) => {
  return (
    <div className="control-section">
      <h3>Filter</h3>
      <div className="control-content">
        <label>Frequency: {frequency}Hz</label>
        <input
          type="range"
          min="20"
          max="20000"
          value={frequency}
          onChange={(e) => onChange(Number(e.target.value))}
          className="control-slider"
        />
      </div>
    </div>
  );
};