import * as Tone from 'tone';
import { Voice } from './Voice';
import type { SynthOptions } from '../types';

interface VoiceState {
  voice: Voice;
  key: string | null;
  note: string | null;
  startTime: number;
  isReleasing: boolean;
}

export class VoicePool {
  private voices: VoiceState[] = [];
  private activeVoices: Map<string, Voice> = new Map();
  private maxVoices: number;
  private synthOptions: SynthOptions;

  constructor(maxVoices: number, synthOptions: SynthOptions) {
    this.maxVoices = maxVoices;
    this.synthOptions = { ...synthOptions };
    this.initializeVoices();
  }

  private initializeVoices(): void {
    // ボイスプールの初期化
    for (let i = 0; i < this.maxVoices; i++) {
      const voice = new Voice(this.synthOptions);
      this.voices.push({
        voice,
        key: null,
        note: null,
        startTime: 0,
        isReleasing: false
      });
    }
  }

  acquire(key: string, note: string): Voice | null {
    // 既に同じキーがアクティブな場合
    if (this.activeVoices.has(key)) {
      const existingVoice = this.activeVoices.get(key)!;
      // 既存のボイスを更新（レガート演奏対応）
      this.updateVoiceNote(existingVoice, note);
      return existingVoice;
    }

    // フリーボイスを検索
    let availableVoice = this.findFreeVoice();
    
    if (!availableVoice) {
      // ボイススティーリング（最も古いボイスを取得）
      availableVoice = this.stealOldestVoice();
    }

    if (!availableVoice) return null;

    // ボイスの設定
    availableVoice.key = key;
    availableVoice.note = note;
    availableVoice.startTime = Tone.now();
    availableVoice.isReleasing = false;

    // アクティブボイスマップに追加
    this.activeVoices.set(key, availableVoice.voice);

    return availableVoice.voice;
  }

  private findFreeVoice(): VoiceState | null {
    return this.voices.find(voiceState => 
      voiceState.key === null && !voiceState.isReleasing
    ) || null;
  }

  private stealOldestVoice(): VoiceState | null {
    // リリース中のボイスを優先的に選択
    const releasingVoice = this.voices.find(v => v.isReleasing);
    if (releasingVoice) {
      this.forceReleaseVoice(releasingVoice);
      return releasingVoice;
    }

    // 最も古いアクティブボイスを検索
    let oldestVoice: VoiceState | null = null;
    let oldestTime = Infinity;

    for (const voiceState of this.voices) {
      if (voiceState.key !== null && voiceState.startTime < oldestTime) {
        oldestTime = voiceState.startTime;
        oldestVoice = voiceState;
      }
    }

    if (oldestVoice) {
      this.forceReleaseVoice(oldestVoice);
    }

    return oldestVoice;
  }

  private forceReleaseVoice(voiceState: VoiceState): void {
    if (voiceState.key) {
      // スムーズな強制リリース
      const now = Tone.now();
      try {
        // 急速フェードアウト
        voiceState.voice.volume.cancelScheduledValues(now);
        voiceState.voice.volume.linearRampToValueAtTime(-60, now + 0.01);
        
        // 既存のキーマッピングを削除
        this.activeVoices.delete(voiceState.key);
        
        // ボイス状態をリセット
        voiceState.key = null;
        voiceState.note = null;
        voiceState.isReleasing = false;
        
        // 音量を元に戻す
        setTimeout(() => {
          voiceState.voice.volume.setValueAtTime(0, Tone.now());
        }, 50);
        
      } catch (e) {
        console.warn('Force release error:', e);
        // エラーが発生した場合でも状態はリセット
        voiceState.key = null;
        voiceState.note = null;
        voiceState.isReleasing = false;
      }
    }
  }

  private updateVoiceNote(voice: Voice, newNote: string): void {
    // レガート演奏：ポルタメント効果で音程変更
    try {
      const now = Tone.now();
      const glideTime = 0.05; // 50msでピッチをスライド
      
      // 新しい周波数を計算
      const newFreq = Tone.Frequency(newNote).toFrequency();
      
      // スムーズな音程変化
      voice.frequency.cancelScheduledValues(now);
      voice.frequency.exponentialRampToValueAtTime(newFreq, now + glideTime);
      
    } catch (e) {
      console.warn('Voice note update error:', e);
      // フォールバック：通常のトリガー
      voice.triggerAttack(newNote);
    }
  }

  release(key: string): void {
    const voiceState = this.voices.find(v => v.key === key);
    if (!voiceState) return;

    // リリース状態にマーク
    voiceState.isReleasing = true;
    
    // 遅延後にボイス状態をクリア
    const releaseTime = this.synthOptions.envelope.release * 1000 + 100;
    setTimeout(() => {
      if (voiceState.key === key) { // まだ同じキーが割り当てられている場合
        voiceState.key = null;
        voiceState.note = null;
        voiceState.isReleasing = false;
        this.activeVoices.delete(key);
      }
    }, releaseTime);
  }

  getActiveVoice(key: string): Voice | null {
    return this.activeVoices.get(key) || null;
  }

  getAllActiveVoices(): Map<string, Voice> {
    return new Map(this.activeVoices);
  }

  getActiveCount(): number {
    return this.activeVoices.size;
  }

  updateSynthOptions(newOptions: SynthOptions): void {
    this.synthOptions = { ...newOptions };
    
    // 全ボイスの設定を段階的に更新
    this.voices.forEach((voiceState, index) => {
      // 更新を分散して処理負荷を軽減
      setTimeout(() => {
        try {
          voiceState.voice.updateOptions(newOptions);
        } catch (e) {
          console.warn(`Voice ${index} update error:`, e);
        }
      }, index * 2); // 2msずつ遅延
    });
  }

  // パフォーマンス情報の取得
  getPoolStatus(): {
    total: number;
    active: number;
    free: number;
    releasing: number;
  } {
    const releasing = this.voices.filter(v => v.isReleasing).length;
    const active = this.activeVoices.size;
    const free = this.maxVoices - active - releasing;

    return {
      total: this.maxVoices,
      active,
      free,
      releasing
    };
  }

  // デバッグ用：ボイスプールの状態表示
  debugStatus(): void {
    const status = this.getPoolStatus();
    console.log('Voice Pool Status:', status);
    
    this.voices.forEach((voiceState, index) => {
      console.log(`Voice ${index}:`, {
        key: voiceState.key,
        note: voiceState.note,
        active: voiceState.key !== null,
        releasing: voiceState.isReleasing,
        age: voiceState.startTime ? Tone.now() - voiceState.startTime : 0
      });
    });
  }

  dispose(): void {
    // すべてのアクティブボイスを停止
    this.activeVoices.forEach((voice, key) => {
      try {
        voice.triggerRelease();
      } catch (e) {
        console.warn(`Voice disposal error for key ${key}:`, e);
      }
    });

    // 少し待ってからボイスを破棄
    setTimeout(() => {
      this.voices.forEach((voiceState, index) => {
        try {
          voiceState.voice.dispose();
        } catch (e) {
          console.warn(`Voice ${index} disposal error:`, e);
        }
      });
      
      this.voices = [];
      this.activeVoices.clear();
    }, 100);
  }
}
