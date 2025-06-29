import * as Tone from 'tone';
import { Voice } from './Voice';
import type { SynthOptions, EffectChain, FilterSettings } from '../types';
import { MAX_VOICES, DEFAULT_SYNTH_OPTIONS, DEFAULT_FILTER_SETTINGS } from '../utils/constants';

export class SynthEngine {
  private activeVoices: Map<string, Voice> = new Map();
  private voiceCount = 0;
  private synthOptions: SynthOptions = DEFAULT_SYNTH_OPTIONS;
  private filterSettings: FilterSettings = DEFAULT_FILTER_SETTINGS;
  private effectChain: EffectChain | null = null;
  private onVoiceCountChange?: (count: number) => void;

  constructor() {
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

  setSynthOptions(options: Partial<SynthOptions>): void {
    this.synthOptions = { ...this.synthOptions, ...options };
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
    if (this.activeVoices.has(key)) return;
    if (this.voiceCount >= MAX_VOICES) return;
    
    if (!this.effectChain) {
      await this.initAudio();
    }
    
    await Tone.start();
    
    const voice = new Voice(key, note, this.synthOptions);
    voice.connect(this.effectChain!.filter);
    voice.triggerAttack(note);
    
    this.activeVoices.set(key, voice);
    this.voiceCount++;
    this.onVoiceCountChange?.(this.voiceCount);
  }

  stopNote(key: string): void {
    const voice = this.activeVoices.get(key);
    if (!voice) return;
    
    voice.triggerRelease();
    
    setTimeout(() => {
      if (this.activeVoices.has(key)) {
        const v = this.activeVoices.get(key)!;
        v.dispose();
        this.activeVoices.delete(key);
        this.voiceCount--;
        this.onVoiceCountChange?.(this.voiceCount);
      }
    }, this.synthOptions.envelope.release * 1000 + 100);
  }

  getEffectChain(): EffectChain | null {
    return this.effectChain;
  }

  getVoiceCount(): number {
    return this.voiceCount;
  }

  getAnalyser(): Tone.Analyser | null {
    return this.effectChain?.analyser || null;
  }
}