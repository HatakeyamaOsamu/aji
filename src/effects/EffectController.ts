import type { SynthEngine } from '../synth/SynthEngine';
import { EffectChain } from './EffectChain';

export class EffectController {
  private synthEngine: SynthEngine;
  private effectChain: EffectChain | null = null;

  constructor(synthEngine: SynthEngine) {
    this.synthEngine = synthEngine;
  }

  private getEffectChain(): EffectChain | null {
    const chain = this.synthEngine.getEffectChain();
    if (chain && !this.effectChain) {
      this.effectChain = new EffectChain(
        chain.masterVolume,
        chain.filter,
        chain.chorus,
        chain.delay,
        chain.reverb
      );
    }
    return this.effectChain;
  }

  // Master Volume
  setMasterVolume(volumePercent: number): void {
    this.getEffectChain()?.setMasterVolume(volumePercent);
  }

  // Filter controls
  setFilterFrequency(frequency: number): void {
    this.getEffectChain()?.setFilterFrequency(frequency);
    this.synthEngine.setFilterSettings({ frequency });
  }

  setFilterResonance(Q: number): void {
    this.getEffectChain()?.setFilterResonance(Q);
    this.synthEngine.setFilterSettings({ Q });
  }

  setFilterType(type: BiquadFilterType): void {
    this.getEffectChain()?.setFilterType(type);
    this.synthEngine.setFilterSettings({ type });
  }

  // Chorus controls
  setChorusFrequency(frequency: number): void {
    this.getEffectChain()?.setChorusFrequency(frequency);
  }

  setChorusDepth(depth: number): void {
    this.getEffectChain()?.setChorusDepth(depth);
  }

  setChorusMix(wet: number): void {
    this.getEffectChain()?.setChorusMix(wet);
  }

  // Delay controls
  setDelayTime(time: number): void {
    this.getEffectChain()?.setDelayTime(time);
  }

  setDelayFeedback(feedback: number): void {
    this.getEffectChain()?.setDelayFeedback(feedback);
  }

  setDelayMix(wet: number): void {
    this.getEffectChain()?.setDelayMix(wet);
  }

  // Reverb controls
  setReverbSize(size: number): void {
    this.getEffectChain()?.setReverbSize(size);
  }

  setReverbDampening(frequency: number): void {
    this.getEffectChain()?.setReverbDampening(frequency);
  }

  setReverbMix(wet: number): void {
    this.getEffectChain()?.setReverbMix(wet);
  }
}