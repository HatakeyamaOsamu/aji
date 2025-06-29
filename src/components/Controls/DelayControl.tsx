import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';

export const DelayControl: React.FC = () => {
  const { effectController } = useSynth();
  const [delay, setDelay] = useState({
    time: 0.25,
    feedback: 0.3,
    mix: 0
  });

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
    effectController.setDelayMix(value);
  };

  return (
    <section className="control-section delay-section">
      <h2 className="section-title">Delay</h2>
      <Slider
        label="Time"
        value={delay.time}
        min={0}
        max={1}
        step={0.01}
        onChange={handleTimeChange}
        displayValue={(v) => `${v.toFixed(2)}s`}
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
    </section>
  );
};