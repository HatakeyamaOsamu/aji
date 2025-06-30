// Synthesizer default values
export const SYNTH_DEFAULTS = {
  volume: -10,
  attack: 0.005,
  decay: 0.1,
  sustain: 0.3,
  release: 0.3,
  waveform: 'sine' as const,
  maxPolyphony: 32
};

export const EFFECT_DEFAULTS = {
  reverbWet: 0,
  reverbDecay: 2.5,
  delayWet: 0,
  delayTime: 0.25,
  delayFeedback: 0.3,
  chorusWet: 0,
  chorusFrequency: 1.5,
  chorusDepth: 0.7,
  filterFreq: 2000,
  filterType: 'lowpass' as const
};

export const LFO_DEFAULTS = {
  rate: 2,
  pitchDepth: 0,
  filterDepth: 0,
  ampDepth: 0,
  waveform: 'sine' as const,
  sync: false
};

export const WAVEFORM_OPTIONS = ['sine', 'square', 'sawtooth', 'triangle'] as const;
export type WaveformType = typeof WAVEFORM_OPTIONS[number];

export const LFO_WAVEFORM_OPTIONS = ['sine', 'square', 'sawtooth', 'random'] as const;
export type LfoWaveformType = typeof LFO_WAVEFORM_OPTIONS[number];

export const LFO_TARGET_OPTIONS = ['pitch', 'filter', 'amplitude'] as const;
export type LfoTargetType = typeof LFO_TARGET_OPTIONS[number];