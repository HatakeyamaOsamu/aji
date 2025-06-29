import * as Tone from 'tone';
import type { SynthOptions } from '../types';

export class Voice {
  private synth: Tone.Synth;
  private key: string;
  private note: string;
  private isActive: boolean = false;

  constructor(key: string, note: string, options: SynthOptions) {
    this.key = key;
    this.note = note;
    // Use single Synth instead of PolySynth for better performance
    this.synth = new Tone.Synth({
      oscillator: options.oscillator,
      envelope: options.envelope
    });
  }

  connect(destination: Tone.ToneAudioNode): void {
    this.synth.connect(destination);
  }

  disconnect(): void {
    this.synth.disconnect();
  }

  triggerAttack(note: string): void {
    this.synth.triggerAttack(note, Tone.now());
    this.isActive = true;
  }

  triggerRelease(): void {
    this.synth.triggerRelease(Tone.now());
    this.isActive = false;
  }

  reconfigure(key: string, note: string, options: SynthOptions): void {
    this.key = key;
    this.note = note;
    // Only update options if they've changed
    this.updateOptions(options);
  }

  updateOptions(options: SynthOptions): void {
    this.synth.set({
      oscillator: options.oscillator,
      envelope: options.envelope
    });
  }

  reset(): void {
    if (this.isActive) {
      this.synth.triggerRelease(Tone.now());
    }
    this.isActive = false;
  }

  dispose(): void {
    this.synth.dispose();
  }

  getKey(): string {
    return this.key;
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}