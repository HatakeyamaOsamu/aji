import { useEffect, useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';
import { SYNTH_DEFAULTS, EFFECT_DEFAULTS, WaveformType } from '../constants/synth';

export interface SynthParams {
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  waveform: WaveformType;
}

export interface EffectParams {
  reverbWet: number;
  delayWet: number;
  chorusWet: number;
  filterFreq: number;
}

export interface UseSynthReturn {
  synth: Tone.PolySynth | null;
  startNote: (note: string) => Promise<void>;
  stopNote: (note: string) => void;
  updateSynthParams: (params: Partial<SynthParams>) => void;
  updateEffectParams: (params: Partial<EffectParams>) => void;
  isAudioReady: boolean;
  audioError: string | null;
}

export const useSynth = (
  synthParams: SynthParams,
  effectParams: EffectParams
): UseSynthReturn => {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const chorusRef = useRef<Tone.Chorus | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  const activeNotesRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // オーディオコンテキストの初期化（ユーザーインタラクション時に呼び出す）
  const initializeAudio = useCallback(async (): Promise<boolean> => {
    if (isInitializedRef.current) {
      return true;
    }

    try {
      // ユーザーインタラクションが必要
      await Tone.start();
      
      console.log('AudioContext状態:', Tone.getContext().state);
      
      // シンセサイザーとエフェクトの作成
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: synthParams.waveform },
        envelope: {
          attack: synthParams.attack,
          decay: synthParams.decay,
          sustain: synthParams.sustain,
          release: synthParams.release
        }
      });
      synth.maxPolyphony = SYNTH_DEFAULTS.maxPolyphony;
      
      // エフェクトの作成
      const reverb = new Tone.Reverb({ 
        decay: EFFECT_DEFAULTS.reverbDecay, 
        wet: effectParams.reverbWet 
      });
      const delay = new Tone.FeedbackDelay({ 
        delayTime: EFFECT_DEFAULTS.delayTime, 
        feedback: EFFECT_DEFAULTS.delayFeedback, 
        wet: effectParams.delayWet 
      });
      const chorus = new Tone.Chorus({ 
        frequency: EFFECT_DEFAULTS.chorusFrequency, 
        depth: EFFECT_DEFAULTS.chorusDepth, 
        wet: effectParams.chorusWet 
      });
      const filter = new Tone.Filter({ 
        frequency: effectParams.filterFreq, 
        type: EFFECT_DEFAULTS.filterType 
      });
      const volumeNode = new Tone.Volume(synthParams.volume);
      
      // オーディオチェーンの接続
      synth.connect(filter);
      filter.connect(chorus);
      chorus.connect(delay);
      delay.connect(reverb);
      reverb.connect(volumeNode);
      volumeNode.toDestination();
      
      // リファレンスの保存
      synthRef.current = synth;
      reverbRef.current = reverb;
      delayRef.current = delay;
      chorusRef.current = chorus;
      filterRef.current = filter;
      volumeNodeRef.current = volumeNode;
      
      // リバーブの準備完了を待つ
      await reverb.ready;
      
      isInitializedRef.current = true;
      setIsAudioReady(true);
      setAudioError(null);
      
      console.log('オーディオシステムが正常に初期化されました');
      return true;
      
    } catch (error) {
      console.error('オーディオ初期化エラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'オーディオの初期化に失敗しました';
      setAudioError(errorMessage);
      setIsAudioReady(false);
      return false;
    }
  }, [synthParams, effectParams]);

  // ノートの開始（初期化を含む）
  const startNote = useCallback(async (note: string): Promise<void> => {
    // まだ初期化されていない場合は初期化を試行
    if (!isInitializedRef.current) {
      const initialized = await initializeAudio();
      if (!initialized) {
        console.warn('オーディオが初期化されていないため、音を再生できません');
        return;
      }
    }

    if (!synthRef.current || activeNotesRef.current.has(note)) return;
    
    try {
      activeNotesRef.current.add(note);
      synthRef.current.triggerAttack(note);
    } catch (error) {
      console.error('ノート再生エラー:', error);
      activeNotesRef.current.delete(note);
    }
  }, [initializeAudio]);
  
  const stopNote = useCallback((note: string) => {
    if (!synthRef.current || !activeNotesRef.current.has(note)) return;
    
    try {
      activeNotesRef.current.delete(note);
      synthRef.current.triggerRelease(note);
    } catch (error) {
      console.error('ノート停止エラー:', error);
    }
  }, []);

  // パラメーター更新関数
  const updateSynthParams = useCallback((params: Partial<SynthParams>) => {
    if (synthRef.current && (params.waveform || params.attack || params.decay || params.sustain || params.release)) {
      synthRef.current.set({
        oscillator: params.waveform ? { type: params.waveform } : undefined,
        envelope: {
          attack: params.attack ?? synthParams.attack,
          decay: params.decay ?? synthParams.decay,
          sustain: params.sustain ?? synthParams.sustain,
          release: params.release ?? synthParams.release
        }
      });
    }
    if (params.volume !== undefined && volumeNodeRef.current) {
      volumeNodeRef.current.volume.value = params.volume;
    }
  }, [synthParams]);

  const updateEffectParams = useCallback((params: Partial<EffectParams>) => {
    if (params.reverbWet !== undefined && reverbRef.current) {
      reverbRef.current.wet.value = params.reverbWet;
    }
    if (params.delayWet !== undefined && delayRef.current) {
      delayRef.current.wet.value = params.delayWet;
    }
    if (params.chorusWet !== undefined && chorusRef.current) {
      chorusRef.current.wet.value = params.chorusWet;
    }
    if (params.filterFreq !== undefined && filterRef.current) {
      filterRef.current.frequency.value = params.filterFreq;
    }
  }, []);

  // パラメーター変更時の更新
  useEffect(() => {
    if (isInitializedRef.current) {
      updateSynthParams(synthParams);
    }
  }, [synthParams, updateSynthParams]);

  useEffect(() => {
    if (isInitializedRef.current) {
      updateEffectParams(effectParams);
    }
  }, [effectParams, updateEffectParams]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      synthRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();
      chorusRef.current?.dispose();
      filterRef.current?.dispose();
      volumeNodeRef.current?.dispose();
    };
  }, []);

  return {
    synth: synthRef.current,
    startNote,
    stopNote,
    updateSynthParams,
    updateEffectParams,
    isAudioReady,
    audioError
  };
};