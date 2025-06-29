import type { Synth, Volume, Filter, Chorus, FeedbackDelay, Reverb, Analyser } from 'tone';

export interface SynthOptions {
  oscillator: {
    type: OscillatorType;
  };
  envelope: EnvelopeOptions;
}

export interface EnvelopeOptions {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface Voice {
  id: string;
  note: string;
  synth: Synth;
  startTime: number;
}

export interface FilterSettings {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
}

export interface EffectChain {
  masterVolume: Volume;
  filter: Filter;
  chorus: Chorus;
  delay: FeedbackDelay;
  reverb: Reverb;
  analyser: Analyser;
}

export interface VirtualKeyNote {
  note: string;
  isBlack: boolean;
  key: string;
}

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';