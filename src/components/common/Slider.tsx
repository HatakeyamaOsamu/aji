import React from 'react';
import { throttle } from '../../utils/performance';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  displayValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  unit = '', 
  onChange,
  displayValue 
}) => {
  // Throttle slider updates for better performance
  const handleChange = React.useCallback(
    throttle((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    }, 16), // ~60fps
    [onChange]
  );

  const displayText = displayValue 
    ? displayValue(value) 
    : `${value}${unit}`;

  return (
    <div className="control-group">
      <label className="control-label">
        {label} <span className="value-display">{displayText}</span>
      </label>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};