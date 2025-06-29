import { Voice } from './Voice';
import type { SynthOptions } from '../types';

export class VoicePool {
  private pool: Voice[] = [];
  private activeVoices: Map<string, Voice> = new Map();
  private maxPoolSize: number;
  private synthOptions: SynthOptions;

  constructor(maxPoolSize: number = 16, synthOptions: SynthOptions) {
    this.maxPoolSize = maxPoolSize;
    this.synthOptions = synthOptions;
    this.initializePool();
  }

  private initializePool(): void {
    // Pre-create voices for better performance
    for (let i = 0; i < Math.min(8, this.maxPoolSize); i++) {
      this.pool.push(this.createVoice());
    }
  }

  private createVoice(): Voice {
    // Create a voice with a placeholder key and note
    const voice = new Voice('pool', 'A4', this.synthOptions);
    return voice;
  }

  acquire(key: string, note: string): Voice | null {
    if (this.activeVoices.has(key)) {
      return null; // Voice already active for this key
    }

    let voice = this.pool.pop();
    
    if (!voice) {
      // Pool is empty, create new voice if under limit
      if (this.activeVoices.size < this.maxPoolSize) {
        voice = this.createVoice();
      } else {
        return null; // At capacity
      }
    }

    // Reconfigure the voice for the new note
    voice.reconfigure(key, note, this.synthOptions);
    this.activeVoices.set(key, voice);
    
    return voice;
  }

  release(key: string): void {
    const voice = this.activeVoices.get(key);
    if (!voice) return;

    this.activeVoices.delete(key);
    
    // Reset and return to pool if pool isn't full
    if (this.pool.length < this.maxPoolSize) {
      voice.reset();
      this.pool.push(voice);
    } else {
      // Dispose of excess voices
      voice.dispose();
    }
  }

  updateSynthOptions(synthOptions: SynthOptions): void {
    this.synthOptions = synthOptions;
    
    // Update all pooled voices
    this.pool.forEach(voice => {
      voice.updateOptions(synthOptions);
    });
  }

  getActiveCount(): number {
    return this.activeVoices.size;
  }

  dispose(): void {
    // Clean up all voices
    this.activeVoices.forEach(voice => voice.dispose());
    this.pool.forEach(voice => voice.dispose());
    
    this.activeVoices.clear();
    this.pool = [];
  }
}