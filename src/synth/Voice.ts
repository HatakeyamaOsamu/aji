import * as Tone from 'tone';
import type { SynthOptions } from '../types';

export class Voice {
  private synth: Tone.PolySynth;
  private key: string;
  private note: string;
  private isActive: boolean = false;

  constructor(key: string, note: string, options: SynthOptions) {
    this.key = key;
    this.note = note;
    this.synth = new Tone.PolySynth(Tone.Synth, {
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
    this.synth.triggerRelease(this.note, Tone.now());
    this.isActive = false;
  }

  reconfigure(key: string, note: string, options: SynthOptions): void {
    this.key = key;
    this.note = note;
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
      this.synth.releaseAll();
    }
    this.isActive = false;
  }

  dispose(): void {
    this.synth.dispose();
  }

  getKey(): string {
    return this.key;
  }
}