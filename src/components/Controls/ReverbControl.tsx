import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';
import { Switch } from '../common/Switch';

export const ReverbControl: React.FC = () => {
  const { effectController } = useSynth();
  const [enabled, setEnabled] = useState(false);
  const [reverb, setReverb] = useState({
    size: 0.2,
    dampening: 3000,
    mix: 0
  });

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value);
    effectController.setReverbMix(value ? reverb.mix : 0);
  };

  const handleSizeChange = (value: number) => {
    setReverb(prev => ({ ...prev, size: value }));
    effectController.setReverbSize(value);
  };

  const handleDampeningChange = (value: number) => {
    setReverb(prev => ({ ...prev, dampening: value }));
    effectController.setReverbDampening(value);
  };

  const handleMixChange = (value: number) => {
    setReverb(prev => ({ ...prev, mix: value }));
    if (enabled) {
      effectController.setReverbMix(value);
    }
  };

  return (
    <section className="control-section reverb-section">
      <div className="section-header">
        <h2 className="section-title">Reverb</h2>
        <Switch
          label="ON"
          checked={enabled}
          onChange={handleEnabledChange}
        />
      </div>
      <div className={`control-content ${!enabled ? 'disabled' : ''}`}>
        <Slider
          label="Size"
          value={reverb.size}
          min={0}
          max={1}
          step={0.01}
          onChange={handleSizeChange}
          displayValue={(v) => `${Math.round(v * 100)}%`}
        />
        <Slider
          label="Dampening"
          value={reverb.dampening}
          min={100}
          max={20000}
          step={100}
          unit="Hz"
          onChange={handleDampeningChange}
        />
        <Slider
          label="Mix"
          value={reverb.mix}
          min={0}
          max={1}
          step={0.01}
          onChange={handleMixChange}
          displayValue={(v) => `${Math.round(v * 100)}%`}
        />
      </div>
    </section>
  );
};