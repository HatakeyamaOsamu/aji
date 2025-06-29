import * as Tone from 'tone';
import type { SynthOptions } from '../types';

export class Voice {
  private synth: Tone.Synth;
  private isActive: boolean = false;
  private currentNote: string | null = null;
  private smoothingGain: Tone.Gain;
  private antiClickFilter: Tone.Filter;

  constructor(options: SynthOptions) {
    // スムージング用ゲインノード
    this.smoothingGain = new Tone.Gain(1);
    
    // クリック音防止用ローパスフィルター
    this.antiClickFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 12000,
      Q: 0.707
    });

    // シンセサイザーの作成（改善された設定）
    this.synth = new Tone.Synth({
      oscillator: {
        type: options.oscillator.type,
        partialCount: 8, // 倍音の数を制限してCPU負荷軽減
        phase: Math.random() * 360 // ランダムフェーズでビート防止
      },
      envelope: {
        attack: Math.max(0.001, options.envelope.attack), // 最小値を保証
        decay: Math.max(0.001, options.envelope.decay),
        sustain: Math.max(0.001, Math.min(1, options.envelope.sustain)),
        release: Math.max(0.001, options.envelope.release),
        attackCurve: 'exponential', // より自然なアタック
        decayCurve: 'exponential',  // より自然なディケイ
        releaseCurve: 'exponential' // より自然なリリース
      },
      volume: -12 // デフォルト音量を下げて余裕を確保
    });

    // オーディオチェーンの接続
    this.synth.connect(this.antiClickFilter);
    this.antiClickFilter.connect(this.smoothingGain);
  }

  triggerAttack(note: string, time?: Tone.Unit.Time, velocity: number = 0.8): void {
    if (this.isActive && this.currentNote === note) {
      return; // 同じノートが既に再生中の場合は何もしない
    }

    try {
      const now = time || Tone.now();
      const adjustedVelocity = Math.max(0.1, Math.min(1.0, velocity));

      // 既に再生中の場合はスムーズに停止
      if (this.isActive) {
        this.smoothStop(now);
      }

      // スムーズな開始
      this.smoothStart(now);
      
      // ノートをトリガー
      this.synth.triggerAttack(note, now, adjustedVelocity);
      
      this.isActive = true;
      this.currentNote = note;

    } catch (error) {
      console.warn('Voice trigger attack error:', error);
    }
  }

  triggerRelease(time?: Tone.Unit.Time): void {
    if (!this.isActive) return;

    try {
      const now = time || Tone.now();
      
      // エンベロープのリリースを開始
      this.synth.triggerRelease(now);
      
      // スムージングゲインで追加的なフェードアウト
      this.smoothStop(now + 0.001);
      
      this.isActive = false;
      
      // ノート情報は少し遅れてクリア（リリース中に参照可能）
      setTimeout(() => {
        this.currentNote = null;
      }, 50);

    } catch (error) {
      console.warn('Voice trigger release error:', error);
      this.isActive = false;
      this.currentNote = null;
    }
  }

  private smoothStart(time: Tone.Unit.Time): void {
    // ゲインを0から1へスムーズに変化
    this.smoothingGain.gain.cancelScheduledValues(time);
    this.smoothingGain.gain.setValueAtTime(0, time);
    this.smoothingGain.gain.linearRampToValueAtTime(1, time + 0.005);
  }

  private smoothStop(time: Tone.Unit.Time): void {
    // 現在の値から0へスムーズに変化
    this.smoothingGain.gain.cancelScheduledValues(time);
    this.smoothingGain.gain.linearRampToValueAtTime(0, time + 0.01);
    
    // 少し後に音量を復帰（次回の使用に備えて）
    this.smoothingGain.gain.setValueAtTime(1, time + 0.02);
  }

  // レガート演奏用：音程を滑らかに変更
  changeNote(newNote: string, glideTime: number = 0.05): void {
    if (!this.isActive) return;

    try {
      const now = Tone.now();
      const newFreq = Tone.Frequency(newNote).toFrequency();
      
      // 現在の周波数から新しい周波数へスムーズに変化
      this.synth.frequency.cancelScheduledValues(now);
      this.synth.frequency.exponentialRampToValueAtTime(newFreq, now + glideTime);
      
      this.currentNote = newNote;

    } catch (error) {
      console.warn('Voice note change error:', error);
      // フォールバック：新しいノートで再トリガー
      this.triggerAttack(newNote);
    }
  }

  updateOptions(newOptions: SynthOptions): void {
    try {
      // オシレーター設定の更新
      if (newOptions.oscillator.type !== this.synth.oscillator.type) {
        this.synth.oscillator.type = newOptions.oscillator.type;
      }

      // エンベロープ設定の更新（最小値を保証）
      const envelope = this.synth.envelope;
      const newEnv = newOptions.envelope;

      // アクティブでない場合のみ即座に更新
      if (!this.isActive) {
        envelope.attack = Math.max(0.001, newEnv.attack);
        envelope.decay = Math.max(0.001, newEnv.decay);
        envelope.sustain = Math.max(0.001, Math.min(1, newEnv.sustain));
        envelope.release = Math.max(0.001, newEnv.release);
      } else {
        // アクティブな場合は段階的に更新
        const now = Tone.now();
        envelope.attack = Math.max(0.001, newEnv.attack);
        envelope.decay = Math.max(0.001, newEnv.decay);
        envelope.sustain = Math.max(0.001, Math.min(1, newEnv.sustain));
        envelope.release = Math.max(0.001, newEnv.release);
      }

    } catch (error) {
      console.warn('Voice options update error:', error);
    }
  }

  connect(destination: Tone.InputNode): void {
    this.smoothingGain.connect(destination);
  }

  disconnect(): void {
    try {
      // まず音をフェードアウト
      if (this.isActive) {
        this.triggerRelease();
      }

      // 少し遅延してから切断
      setTimeout(() => {
        this.smoothingGain.disconnect();
      }, 10);

    } catch (error) {
      console.warn('Voice disconnect error:', error);
    }
  }

  // ボイスの状態取得
  getStatus(): {
    isActive: boolean;
    currentNote: string | null;
    frequency: number | null;
  } {
    return {
      isActive: this.isActive,
      currentNote: this.currentNote,
      frequency: this.currentNote ? Tone.Frequency(this.currentNote).toFrequency() : null
    };
  }

  // 音量コントロール
  get volume(): Tone.Param<"decibels"> {
    return this.synth.volume;
  }

  // 周波数コントロール（ピッチベンド用）
  get frequency(): Tone.Signal<"frequency"> {
    return this.synth.frequency;
  }

  // デチューン（微調整）
  get detune(): Tone.Param<"cents"> {
    return this.synth.detune;
  }

  // 既存のAPIとの互換性を保つためのメソッド
  reset(): void {
    if (this.isActive) {
      this.triggerRelease();
    }
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  dispose(): void {
    try {
      // アクティブな場合は停止
      if (this.isActive) {
        this.synth.triggerRelease();
      }

      // リソースを順次解放
      setTimeout(() => {
        this.synth.dispose();
        this.smoothingGain.dispose();
        this.antiClickFilter.dispose();
      }, 100);

      this.isActive = false;
      this.currentNote = null;

    } catch (error) {
      console.warn('Voice disposal error:', error);
    }
  }
}
