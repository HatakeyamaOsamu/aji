import type { Volume, Filter, Chorus, FeedbackDelay, Reverb } from 'tone';

export class EffectChain {
  constructor(
    public masterVolume: Volume,
    public filter: Filter,
    public chorus: Chorus,
    public delay: FeedbackDelay,
    public reverb: Reverb
  ) {}

  setMasterVolume(volumePercent: number): void {
    const volumeDb = (volumePercent / 100) * 60 - 60;
    this.masterVolume.volume.value = volumeDb;
  }

  setFilterFrequency(frequency: number): void {
    this.filter.frequency.value = frequency;
  }

  setFilterResonance(Q: number): void {
    this.filter.Q.value = Q;
  }

  setFilterType(type: BiquadFilterType): void {
    this.filter.type = type;
  }

  setChorusFrequency(frequency: number): void {
    this.chorus.frequency.value = frequency;
  }

  setChorusDepth(depth: number): void {
    this.chorus.depth = depth;
  }

  setChorusMix(wet: number): void {
    this.chorus.wet.value = wet;
  }

  setDelayTime(time: number): void {
    this.delay.delayTime.value = time;
  }

  setDelayFeedback(feedback: number): void {
    this.delay.feedback.value = feedback;
  }

  setDelayMix(wet: number): void {
    this.delay.wet.value = wet;
  }

  setReverbSize(size: number): void {
    // Map 0-1 to 0.5s-10s decay time
    this.reverb.decay = 0.5 + size * 9.5;
  }

  setReverbDampening(_frequency: number): void {
    // Tone.js Reverb doesn't have a dampening property
    // This method is kept for API compatibility but does nothing
    // TODO: Consider using a different reverb effect or removing this method
  }

  setReverbMix(wet: number): void {
    this.reverb.wet.value = wet;
  }
}