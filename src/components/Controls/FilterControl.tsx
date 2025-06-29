import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';

type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';

export const FilterControl: React.FC = () => {
  const { setFilterSettings } = useSynth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('lowpass');
  const [frequency, setFrequency] = useState(2000);
  const [resonance, setResonance] = useState(1);

  const handleFilterTypeChange = (type: FilterType) => {
    setActiveFilter(type);
    setFilterSettings({ type });
  };

  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    setFilterSettings({ frequency: value });
  };

  const handleResonanceChange = (value: number) => {
    setResonance(value);
    setFilterSettings({ Q: value });
  };

  return (
    <section className="control-section filter-section">
      <h2 className="section-title">Filter</h2>
      <div className="filter-type-selector">
        <button 
          className={`filter-type-button ${activeFilter === 'lowpass' ? 'active' : ''}`}
          onClick={() => handleFilterTypeChange('lowpass')}
        >
          LP
        </button>
        <button 
          className={`filter-type-button ${activeFilter === 'highpass' ? 'active' : ''}`}
          onClick={() => handleFilterTypeChange('highpass')}
        >
          HP
        </button>
        <button 
          className={`filter-type-button ${activeFilter === 'bandpass' ? 'active' : ''}`}
          onClick={() => handleFilterTypeChange('bandpass')}
        >
          BP
        </button>
        <button 
          className={`filter-type-button ${activeFilter === 'notch' ? 'active' : ''}`}
          onClick={() => handleFilterTypeChange('notch')}
        >
          N
        </button>
      </div>
      <Slider
        label="Cutoff"
        value={frequency}
        min={20}
        max={20000}
        step={1}
        unit="Hz"
        onChange={handleFrequencyChange}
      />
      <Slider
        label="Resonance"
        value={resonance}
        min={0.1}
        max={30}
        step={0.1}
        onChange={handleResonanceChange}
        displayValue={(v) => v.toFixed(1)}
      />
    </section>
  );
};