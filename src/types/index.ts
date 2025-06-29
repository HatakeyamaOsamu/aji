import type { Synth, Volume, Filter, Chorus, FeedbackDelay, Reverb, Analyser, Gain, Compressor } from 'tone';

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
  smoothingGain?: Gain;
  compressor?: Compressor;
  antiAliasFilter?: Filter;
}

export interface VirtualKeyNote {
  note: string;
  isBlack: boolean;
  key: string;
}

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

// Deep partial type for nested partial updates
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Performance monitoring types
export interface PerformanceMetrics {
  timestamp: number;
  audioContext: {
    state: AudioContextState;
    sampleRate: number;
    currentTime: number;
    baseLatency: number;
    outputLatency: number;
  };
  cpu: {
    memoryUsage: number;
    frameDrops: number;
  };
  audio: {
    activeVoices: number;
    bufferUnderruns: boolean;
    latency: number;
  };
}

export interface DeviceOptimization {
  bufferSize: number;
  polyphony: number;
  sampleRate: number;
  enabledEffects: string[];
}
