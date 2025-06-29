import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';

export const MasterControl: React.FC = () => {
  const { effectController } = useSynth();
  const [volume, setVolume] = useState(70);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    effectController.setMasterVolume(value);
  };

  return (
    <section className="control-section master-section">
      <h2 className="section-title">Master</h2>
      <Slider
        label="Volume"
        value={volume}
        min={0}
        max={100}
        step={1}
        onChange={handleVolumeChange}
        displayValue={(v) => `${v}%`}
      />
    </section>
  );
};