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
    // Pre-create all voices for better performance
    // This prevents audio glitches from dynamic voice creation
    for (let i = 0; i < this.maxPoolSize; i++) {
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
      // No available voices, steal the oldest one
      const oldestKey = this.activeVoices.keys().next().value;
      if (oldestKey) {
        const oldestVoice = this.activeVoices.get(oldestKey)!;
        this.activeVoices.delete(oldestKey);
        oldestVoice.reset();
        voice = oldestVoice;
      } else {
        return null; // Should never happen with proper initialization
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
    
    // Always return to pool for reuse
    voice.reset();
    this.pool.push(voice);
  }

  getActiveVoice(key: string): Voice | undefined {
    return this.activeVoices.get(key);
  }

  updateSynthOptions(synthOptions: SynthOptions): void {
    this.synthOptions = synthOptions;
    
    // Update all voices (both pooled and active)
    this.pool.forEach(voice => {
      voice.updateOptions(synthOptions);
    });
    
    this.activeVoices.forEach(voice => {
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