import * as Tone from 'tone';
import { VoicePool } from './VoicePool';
import type { SynthOptions, EffectChain, FilterSettings, DeepPartial } from '../types';
import { MAX_VOICES, DEFAULT_SYNTH_OPTIONS, DEFAULT_FILTER_SETTINGS } from '../utils/constants';

export class SynthEngine {
  private voicePool: VoicePool;
  private synthOptions: SynthOptions = { ...DEFAULT_SYNTH_OPTIONS };
  private filterSettings: FilterSettings = { ...DEFAULT_FILTER_SETTINGS };
  private effectChain: EffectChain | null = null;
  private onVoiceCountChange?: (count: number) => void;
  private releaseTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor() {
    this.voicePool = new VoicePool(MAX_VOICES, this.synthOptions);
    this.initAudio();
  }

  private async initAudio(): Promise<void> {
    // Create effects chain
    const masterVolume = new Tone.Volume(-6).toDestination();
    const analyser = new Tone.Analyser('waveform', 256);
    
    // Create effects
    const reverb = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.01,
      wet: 0
    });
    
    const delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.3,
      wet: 0
    });
    
    const chorus = new Tone.Chorus({
      frequency: 1.5,
      delayTime: 3.5,
      depth: 0.7,
      type: 'sine',
      spread: 180,
      wet: 0
    });
    
    const filter = new Tone.Filter({
      type: this.filterSettings.type,
      frequency: this.filterSettings.frequency,
      Q: this.filterSettings.Q
    });
    
    // Connect audio chain
    filter.connect(chorus);
    chorus.connect(delay);
    delay.connect(reverb);
    reverb.connect(masterVolume);
    masterVolume.connect(analyser);

    this.effectChain = {
      masterVolume,
      filter,
      chorus,
      delay,
      reverb,
      analyser
    };
  }

  setVoiceCountCallback(callback: (count: number) => void): void {
    this.onVoiceCountChange = callback;
  }

  setSynthOptions(options: DeepPartial<SynthOptions>): void {
    if (options.oscillator) {
      this.synthOptions.oscillator = { ...this.synthOptions.oscillator, ...options.oscillator };
    }
    if (options.envelope) {
      this.synthOptions.envelope = { ...this.synthOptions.envelope, ...options.envelope };
    }
    
    // Update voice pool with new options
    this.voicePool.updateSynthOptions(this.synthOptions);
  }

  setFilterSettings(settings: Partial<FilterSettings>): void {
    this.filterSettings = { ...this.filterSettings, ...settings };
    if (this.effectChain?.filter) {
      if (settings.type !== undefined) {
        this.effectChain.filter.type = settings.type;
      }
      if (settings.frequency !== undefined) {
        this.effectChain.filter.frequency.value = settings.frequency;
      }
      if (settings.Q !== undefined) {
        this.effectChain.filter.Q.value = settings.Q;
      }
    }
  }

  async startNote(key: string, note: string): Promise<void> {
    // Clear any pending release timeout for this key
    const existingTimeout = this.releaseTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.releaseTimeouts.delete(key);
    }
    
    if (!this.effectChain) {
      await this.initAudio();
    }
    
    await Tone.start();
    
    const voice = this.voicePool.acquire(key, note);
    if (!voice) return; // No available voices or key already active
    
    voice.connect(this.effectChain!.filter);
    voice.triggerAttack(note);
    
    this.onVoiceCountChange?.(this.voicePool.getActiveCount());
  }

  stopNote(key: string): void {
    const voice = this.voicePool.getActiveVoice(key);
    if (!voice) return;
    
    voice.triggerRelease();
    
    // Schedule voice cleanup after release time
    const releaseTime = this.synthOptions.envelope.release * 1000 + 100;
    const timeout = setTimeout(() => {
      voice.disconnect();
      this.voicePool.release(key);
      this.releaseTimeouts.delete(key);
      this.onVoiceCountChange?.(this.voicePool.getActiveCount());
    }, releaseTime);
    
    this.releaseTimeouts.set(key, timeout);
  }

  getEffectChain(): EffectChain | null {
    return this.effectChain;
  }

  getVoiceCount(): number {
    return this.voicePool.getActiveCount();
  }

  getAnalyser(): Tone.Analyser | null {
    return this.effectChain?.analyser || null;
  }

  dispose(): void {
    // Clear all timeouts
    this.releaseTimeouts.forEach(timeout => clearTimeout(timeout));
    this.releaseTimeouts.clear();
    
    // Dispose of voice pool and effects
    this.voicePool.dispose();
    
    if (this.effectChain) {
      Object.values(this.effectChain).forEach(effect => {
        if (effect && 'dispose' in effect) {
          effect.dispose();
        }
      });
    }
  }
}