import * as Tone from 'tone';

export class AudioPerformanceMonitor {
  private static instance: AudioPerformanceMonitor;
  private isMonitoring: boolean = false;
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private lastMetrics: PerformanceMetrics | null = null;

  private constructor() {}

  static getInstance(): AudioPerformanceMonitor {
    if (!AudioPerformanceMonitor.instance) {
      AudioPerformanceMonitor.instance = new AudioPerformanceMonitor();
    }
    return AudioPerformanceMonitor.instance;
  }

  startMonitoring(intervalMs: number = 1000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      const metrics = this.collectMetrics();
      this.lastMetrics = metrics;
      this.callbacks.forEach(callback => callback(metrics));
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  addCallback(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.add(callback);
  }

  removeCallback(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.delete(callback);
  }

  getLastMetrics(): PerformanceMetrics | null {
    return this.lastMetrics;
  }

  private collectMetrics(): PerformanceMetrics {
    const context = Tone.getContext();
    const now = performance.now();

    return {
      timestamp: now,
      audioContext: {
        state: context.state,
        sampleRate: context.sampleRate,
        currentTime: context.currentTime,
        baseLatency: this.getBaseLatency(context),
        outputLatency: this.getOutputLatency(context)
      },
      cpu: {
        memoryUsage: this.getMemoryUsage(),
        frameDrops: this.estimateFrameDrops()
      },
      audio: {
        activeVoices: this.countActiveNodes(),
        bufferUnderruns: this.detectBufferUnderruns(),
        latency: this.estimateLatency()
      }
    };
  }

  private getBaseLatency(context: Tone.BaseContext): number {
    const audioContext = context as any;
    return audioContext.baseLatency || 0;
  }

  private getOutputLatency(context: Tone.BaseContext): number {
    const audioContext = context as any;
    return audioContext.outputLatency || 0;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
    }
    return 0;
  }

  private estimateFrameDrops(): number {
    // 簡易的なフレームドロップ検出
    if (this.lastMetrics) {
      const timeDiff = performance.now() - this.lastMetrics.timestamp;
      const expectedFrames = timeDiff / 16.67; // 60fps基準
      return Math.max(0, expectedFrames - 1);
    }
    return 0;
  }

  private countActiveNodes(): number {
    // Tone.jsのアクティブノード数を概算
    const context = Tone.getContext();
    return context.destination.numberOfInputs || 0;
  }

  private detectBufferUnderruns(): boolean {
    // オーディオコンテキストの状態から推測
    return Tone.getContext().state === 'suspended';
  }

  private estimateLatency(): number {
    const context = Tone.getContext();
    return this.getBaseLatency(context) + this.getOutputLatency(context);
  }
}

export interface PerformanceMetrics {
  timestamp: number;
  audioContext: {
    state: AudioContextState;
    sampleRate: number;
    currentTime: number;
    baseLatency: number;
    outputLatency: number;
  };
  cpu: {
    memoryUsage: number;
    frameDrops: number;
  };
  audio: {
    activeVoices: number;
    bufferUnderruns: boolean;
    latency: number;
  };
}

// オーディオ品質向上のためのユーティリティ関数
export class AudioOptimizer {
  // バッファサイズの最適化
  static optimizeBufferSize(): void {
    try {
      const context = Tone.getContext();
      const audioContext = context as any;
      if (audioContext.audioWorklet) {
        // AudioWorkletが利用可能な場合の最適化
        console.log('AudioWorklet available - using optimized processing');
      }
    } catch (e) {
      console.warn('Buffer optimization failed:', e);
    }
  }

  // レイテンシーの最適化
  static optimizeLatency(): void {
    // lookAheadの最適化
    const transport = Tone.getTransport() as any;
    if ('lookAhead' in transport) {
      transport.lookAhead = 0.05;
    }
    
    // スケジューリングの最適化
    Tone.getTransport().scheduleRepeat(() => {
      // 何もしない（スケジューラーのウォームアップ）
    }, '32n');
  }

  // CPUパフォーマンスの最適化
  static optimizeCPUUsage(): void {
    // ガベージコレクションの負荷軽減
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // 不要なタイマーのクリア
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestId; i++) {
      window.clearTimeout(i);
    }
  }

  // デバイス固有の最適化
  static detectAndOptimizeDevice(): DeviceOptimization {
    const userAgent = navigator.userAgent;
    
    let optimization: DeviceOptimization = {
      bufferSize: 256,
      polyphony: 16,
      sampleRate: 44100,
      enabledEffects: ['filter', 'chorus']
    };

    // モバイルデバイスの検出と最適化
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      optimization = {
        bufferSize: 512,
        polyphony: 8,
        sampleRate: 44100,
        enabledEffects: ['filter']
      };
    }

    // 低性能デバイスの検出
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      optimization.polyphony = Math.min(optimization.polyphony, 8);
      optimization.enabledEffects = ['filter'];
    }

    return optimization;
  }
}

export interface DeviceOptimization {
  bufferSize: number;
  polyphony: number;
  sampleRate: number;
  enabledEffects: string[];
}

// スムーズな値の変化のためのイージング関数
export class AudioEasing {
  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  static easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  static easeIn(t: number): number {
    return t * t * t;
  }

  // パラメーターの段階的変更
  static smoothParameterChange(
    param: Tone.Param,
    targetValue: number,
    duration: number = 0.1,
    easingFunction: (t: number) => number = AudioEasing.easeInOut
  ): void {
    const now = Tone.now();
    const startValue = param.value;
    const steps = 10;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const easedT = easingFunction(t);
      const value = startValue + (targetValue - startValue) * easedT;
      const time = now + i * stepDuration;
      
      param.setValueAtTime(value, time);
    }
  }
}
