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
  private isAudioStarted: boolean = false;
  private smoothingGain: Tone.Gain;
  private compressor: Tone.Compressor;

  constructor() {
    this.voicePool = new VoicePool(MAX_VOICES, this.synthOptions);
    this.smoothingGain = new Tone.Gain(1);
    this.compressor = new Tone.Compressor(-30, 3);
    this.initAudio();
  }

  private async initAudio(): Promise<void> {
    // Audio Context の最適化設定
    await this.configureAudioContext();
    
    // Create effects chain with smoothing
    const masterVolume = new Tone.Volume(-6).toDestination();
    const analyser = new Tone.Analyser('waveform', 512);
    
    // Create effects with optimized settings
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
      Q: this.filterSettings.Q,
      rolloff: -24 // より滑らかなフィルタリング
    });
    
    // スムージング用のローパスフィルター追加
    const antiAliasFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 18000,
      Q: 0.707
    });
    
    // 改善されたオーディオチェーン接続
    filter.connect(antiAliasFilter);
    antiAliasFilter.connect(this.smoothingGain);
    this.smoothingGain.connect(this.compressor);
    this.compressor.connect(chorus);
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
      analyser,
      smoothingGain: this.smoothingGain,
      compressor: this.compressor,
      antiAliasFilter
    };

    // エフェクトの準備完了を待つ
    await Promise.all([
      reverb.ready,
      delay.ready,
      chorus.start()
    ]);
  }

  private async configureAudioContext(): Promise<void> {
    // Audio Context の最適化
    if (Tone.getContext().state === 'suspended') {
      await Tone.start();
    }

    // 低レイテンシー設定
    const context = Tone.getContext();
    
    // look-ahead時間を短縮してレスポンスを向上
    Tone.getTransport().lookAhead = 0.05;
    
    // バッファサイズの最適化（可能な場合）
    try {
      if (context.audioWorklet) {
        // AudioWorkletを使用可能な場合はより高品質な処理
        context.destination.channelInterpretation = 'speakers';
      }
    } catch (e) {
      console.log('AudioWorklet not available, using fallback');
    }
  }

  private async ensureAudioStarted(): Promise<void> {
    if (!this.isAudioStarted) {
      await Tone.start();
      this.isAudioStarted = true;
      
      // スムージングゲインを段階的に上げる
      this.smoothingGain.gain.setValueAtTime(0, Tone.now());
      this.smoothingGain.gain.linearRampToValueAtTime(1, Tone.now() + 0.1);
    }
  }

  setVoiceCountCallback(callback: (count: number) => void): void {
    this.onVoiceCountChange = callback;
  }

  setSynthOptions(options: DeepPartial<SynthOptions>): void {
    if (options.oscillator) {
      this.synthOptions.oscillator = { ...this.synthOptions.oscillator, ...options.oscillator };
    }
    if (options.envelope) {
      // エンベロープの急激な変化を防ぐ
      const smoothedEnvelope = {
        ...this.synthOptions.envelope,
        ...options.envelope
      };
      
      // 最小値を設定してクリック音を防止
      if (smoothedEnvelope.attack < 0.001) smoothedEnvelope.attack = 0.001;
      if (smoothedEnvelope.release < 0.001) smoothedEnvelope.release = 0.001;
      
      this.synthOptions.envelope = smoothedEnvelope;
    }
    
    // Voice poolの更新をスムーズに行う
    this.voicePool.updateSynthOptions(this.synthOptions);
  }

  setFilterSettings(settings: Partial<FilterSettings>): void {
    this.filterSettings = { ...this.filterSettings, ...settings };
    if (this.effectChain?.filter) {
      const now = Tone.now();
      
      // フィルター変更時のスムージング
      if (settings.type !== undefined) {
        this.effectChain.filter.type = settings.type;
      }
      if (settings.frequency !== undefined) {
        // 急激な周波数変化を防ぐ
        this.effectChain.filter.frequency.cancelScheduledValues(now);
        this.effectChain.filter.frequency.linearRampToValueAtTime(
          settings.frequency, 
          now + 0.05
        );
      }
      if (settings.Q !== undefined) {
        // Q値の変化もスムーズに
        this.effectChain.filter.Q.cancelScheduledValues(now);
        this.effectChain.filter.Q.linearRampToValueAtTime(
          settings.Q, 
          now + 0.05
        );
      }
    }
  }

  async startNote(key: string, note: string, velocity: number = 0.8): Promise<void> {
    // 既存のリリースタイムアウトをクリア
    const existingTimeout = this.releaseTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.releaseTimeouts.delete(key);
    }
    
    if (!this.effectChain) {
      await this.initAudio();
    }
    
    await this.ensureAudioStarted();
    
    const voice = this.voicePool.acquire(key, note);
    if (!voice) return;
    
    // ベロシティによる音量調整
    const adjustedVelocity = Math.max(0.1, Math.min(1.0, velocity));
    
    voice.connect(this.effectChain!.filter);
    
    // スムーズなアタック開始
    voice.triggerAttack(note, undefined, adjustedVelocity);
    
    this.onVoiceCountChange?.(this.voicePool.getActiveCount());
  }

  stopNote(key: string): void {
    const voice = this.voicePool.getActiveVoice(key);
    if (!voice) return;
    
    // スムーズなリリース
    voice.triggerRelease();
    
    // リリース時間の計算（少し余裕を持たせる）
    const releaseTime = Math.max(this.synthOptions.envelope.release * 1000 + 200, 300);
    const timeout = setTimeout(() => {
      try {
        voice.disconnect();
        this.voicePool.release(key);
        this.releaseTimeouts.delete(key);
        this.onVoiceCountChange?.(this.voicePool.getActiveCount());
      } catch (e) {
        // 既に切断済みの場合のエラーを無視
        console.warn('Voice already disconnected:', e);
      }
    }, releaseTime);
    
    this.releaseTimeouts.set(key, timeout);
  }

  // パニック機能：全音をスムーズに停止
  allNotesOff(): void {
    const activeVoices = this.voicePool.getAllActiveVoices();
    const now = Tone.now();
    
    activeVoices.forEach((voice, key) => {
      voice.triggerRelease(now);
      
      const timeout = setTimeout(() => {
        try {
          voice.disconnect();
          this.voicePool.release(key);
          this.releaseTimeouts.delete(key);
        } catch (e) {
          console.warn('Voice cleanup error:', e);
        }
      }, 500);
      
      this.releaseTimeouts.set(key, timeout);
    });
    
    this.onVoiceCountChange?.(0);
  }

  // エフェクトの段階的な変更
  setEffectParameter(effectName: keyof EffectChain, parameter: string, value: number): void {
    if (!this.effectChain || !(effectName in this.effectChain)) return;
    
    const effect = this.effectChain[effectName] as any;
    if (effect && parameter in effect) {
      const now = Tone.now();
      if (effect[parameter].cancelScheduledValues) {
        effect[parameter].cancelScheduledValues(now);
        effect[parameter].linearRampToValueAtTime(value, now + 0.1);
      } else {
        effect[parameter] = value;
      }
    }
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

  // CPU使用率の監視
  getPerformanceInfo(): { activeVoices: number; contextState: string; sampleRate: number } {
    return {
      activeVoices: this.voicePool.getActiveCount(),
      contextState: Tone.getContext().state,
      sampleRate: Tone.getContext().sampleRate
    };
  }

  dispose(): void {
    // すべての音を緊急停止
    this.allNotesOff();
    
    // タイムアウトをクリア
    this.releaseTimeouts.forEach(timeout => clearTimeout(timeout));
    this.releaseTimeouts.clear();
    
    // リソースの解放
    this.voicePool.dispose();
    
    if (this.effectChain) {
      Object.values(this.effectChain).forEach(effect => {
        if (effect && 'dispose' in effect) {
          try {
            effect.dispose();
          } catch (e) {
            console.warn('Effect disposal error:', e);
          }
        }
      });
    }
    
    this.smoothingGain?.dispose();
    this.compressor?.dispose();
  }
}
