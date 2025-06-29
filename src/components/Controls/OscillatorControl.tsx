import React, { useState } from 'react';
import { useSynth } from '../../contexts/SynthContext';

type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export const OscillatorControl: React.FC = () => {
  const { setSynthOptions } = useSynth();
  const [activeWaveform, setActiveWaveform] = useState<WaveformType>('sawtooth');

  const handleWaveformChange = (waveform: WaveformType) => {
    setActiveWaveform(waveform);
    setSynthOptions({
      oscillator: { type: waveform }
    });
  };

  return (
    <section className="control-section oscillator-section">
      <h2 className="section-title">Oscillator</h2>
      <div className="waveform-selector">
        <button 
          className={`waveform-button ${activeWaveform === 'sine' ? 'active' : ''}`}
          onClick={() => handleWaveformChange('sine')}
          title="Sine Wave"
        >
          <svg viewBox="0 0 40 20">
            <path d="M0,10 Q10,0 20,10 T40,10" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </button>
        <button 
          className={`waveform-button ${activeWaveform === 'square' ? 'active' : ''}`}
          onClick={() => handleWaveformChange('square')}
          title="Square Wave"
        >
          <svg viewBox="0 0 40 20">
            <path d="M0,15 L0,5 L10,5 L10,15 L20,15 L20,5 L30,5 L30,15 L40,15" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </button>
        <button 
          className={`waveform-button ${activeWaveform === 'sawtooth' ? 'active' : ''}`}
          onClick={() => handleWaveformChange('sawtooth')}
          title="Sawtooth Wave"
        >
          <svg viewBox="0 0 40 20">
            <path d="M0,15 L10,5 L10,15 L20,5 L20,15 L30,5 L30,15 L40,5" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </button>
        <button 
          className={`waveform-button ${activeWaveform === 'triangle' ? 'active' : ''}`}
          onClick={() => handleWaveformChange('triangle')}
          title="Triangle Wave"
        >
          <svg viewBox="0 0 40 20">
            <path d="M0,15 L10,5 L20,15 L30,5 L40,15" stroke="currentColor" fill="none" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </section>
  );
};