import { Synth } from 'tone';
import type { SynthOptions } from '../types';

export class Voice {
  private synth: Synth;
  private _id: string;
  private _note: string;
  private _startTime: number;

  constructor(id: string, note: string, options: SynthOptions) {
    this._id = id;
    this._note = note;
    this._startTime = Date.now();
    this.synth = new Synth(options);
  }

  get id(): string {
    return this._id;
  }

  get note(): string {
    return this._note;
  }

  get startTime(): number {
    return this._startTime;
  }

  connect(destination: any): void {
    this.synth.connect(destination);
  }

  triggerAttack(note: string, time?: number): void {
    this.synth.triggerAttack(note, time);
  }

  triggerRelease(time?: number): void {
    this.synth.triggerRelease(time);
  }

  dispose(): void {
    this.synth.dispose();
  }
}