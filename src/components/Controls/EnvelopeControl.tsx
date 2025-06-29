import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { Slider } from '../common/Slider';

export const EnvelopeControl: React.FC = () => {
  const { setSynthOptions } = useSynth();
  const [envelope, setEnvelope] = useState({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.8
  });

  const handleEnvelopeChange = (param: keyof typeof envelope, value: number) => {
    const newEnvelope = { ...envelope, [param]: value };
    setEnvelope(newEnvelope);
    setSynthOptions({ envelope: { [param]: value } });
  };

  return (
    <section className="control-section envelope-section">
      <h2 className="section-title">Envelope</h2>
      <Slider
        label="Attack"
        value={envelope.attack}
        min={0}
        max={2}
        step={0.01}
        unit="s"
        onChange={(value) => handleEnvelopeChange('attack', value)}
      />
      <Slider
        label="Decay"
        value={envelope.decay}
        min={0}
        max={2}
        step={0.01}
        unit="s"
        onChange={(value) => handleEnvelopeChange('decay', value)}
      />
      <Slider
        label="Sustain"
        value={envelope.sustain}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => handleEnvelopeChange('sustain', value)}
        displayValue={(v) => `${Math.round(v * 100)}%`}
      />
      <Slider
        label="Release"
        value={envelope.release}
        min={0}
        max={5}
        step={0.01}
        unit="s"
        onChange={(value) => handleEnvelopeChange('release', value)}
      />
    </section>
  );
};