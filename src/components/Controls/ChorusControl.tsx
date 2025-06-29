import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';

export const ChorusControl: React.FC = () => {
  const { effectController } = useSynth();
  const [chorus, setChorus] = useState({
    frequency: 1.5,
    depth: 0.7,
    mix: 0
  });

  const handleFrequencyChange = (value: number) => {
    setChorus(prev => ({ ...prev, frequency: value }));
    effectController.setChorusFrequency(value);
  };

  const handleDepthChange = (value: number) => {
    setChorus(prev => ({ ...prev, depth: value }));
    effectController.setChorusDepth(value);
  };

  const handleMixChange = (value: number) => {
    setChorus(prev => ({ ...prev, mix: value }));
    effectController.setChorusMix(value);
  };

  return (
    <section className="control-section chorus-section">
      <h2 className="section-title">Chorus</h2>
      <Slider
        label="Frequency"
        value={chorus.frequency}
        min={0.1}
        max={10}
        step={0.1}
        onChange={handleFrequencyChange}
        displayValue={(v) => `${v.toFixed(1)}Hz`}
      />
      <Slider
        label="Depth"
        value={chorus.depth}
        min={0}
        max={1}
        step={0.01}
        onChange={handleDepthChange}
        displayValue={(v) => `${Math.round(v * 100)}%`}
      />
      <Slider
        label="Mix"
        value={chorus.mix}
        min={0}
        max={1}
        step={0.01}
        onChange={handleMixChange}
        displayValue={(v) => `${Math.round(v * 100)}%`}
      />
    </section>
  );
};