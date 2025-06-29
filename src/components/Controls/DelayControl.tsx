import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';
import { Switch } from '../common/Switch';

export const DelayControl: React.FC = () => {
  const { effectController } = useSynth();
  const [enabled, setEnabled] = useState(false);
  const [delay, setDelay] = useState({
    time: 0.25,
    feedback: 0.3,
    mix: 0
  });

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value);
    effectController.setDelayMix(value ? delay.mix : 0);
  };

  const handleTimeChange = (value: number) => {
    setDelay(prev => ({ ...prev, time: value }));
    effectController.setDelayTime(value);
  };

  const handleFeedbackChange = (value: number) => {
    setDelay(prev => ({ ...prev, feedback: value }));
    effectController.setDelayFeedback(value);
  };

  const handleMixChange = (value: number) => {
    setDelay(prev => ({ ...prev, mix: value }));
    if (enabled) {
      effectController.setDelayMix(value);
    }
  };

  return (
    <section className="control-section delay-section">
      <div className="section-header">
        <h2 className="section-title">Delay</h2>
        <Switch
          label="ON"
          checked={enabled}
          onChange={handleEnabledChange}
        />
      </div>
      <div className={`control-content ${!enabled ? 'disabled' : ''}`}>
        <Slider
          label="Time"
          value={delay.time}
          min={0.01}
          max={1}
          step={0.01}
          unit="s"
          onChange={handleTimeChange}
        />
        <Slider
          label="Feedback"
          value={delay.feedback}
          min={0}
          max={0.95}
          step={0.01}
          onChange={handleFeedbackChange}
          displayValue={(v) => `${Math.round(v * 100)}%`}
        />
        <Slider
          label="Mix"
          value={delay.mix}
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