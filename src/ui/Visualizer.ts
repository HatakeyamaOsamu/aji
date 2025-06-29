import type { SynthEngine } from '../synth/SynthEngine';

export class Visualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private synthEngine: SynthEngine;
  private animationId: number | null = null;

  constructor(synthEngine: SynthEngine) {
    this.synthEngine = synthEngine;
    this.canvas = document.getElementById('waveform') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.setupCanvas();
    this.startAnimation();
    
    // Update voice count display
    this.synthEngine.setVoiceCountCallback((count) => {
      this.updateVoiceCount(count);
    });
  }

  private setupCanvas(): void {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private startAnimation(): void {
    this.drawWaveform();
  }

  private drawWaveform = (): void => {
    const voiceCount = this.synthEngine.getVoiceCount();
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    
    if (voiceCount === 0) {
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fillRect(0, 0, width, height);
      this.animationId = requestAnimationFrame(this.drawWaveform);
      return;
    }
    
    const analyser = this.synthEngine.getAnalyser();
    if (!analyser) {
      this.animationId = requestAnimationFrame(this.drawWaveform);
      return;
    }
    
    const values = analyser.getValue() as Float32Array;
    
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, width, height);
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < values.length; i++) {
      const x = (i / values.length) * width;
      const y = ((values[i] + 1) / 2) * height;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.animationId = requestAnimationFrame(this.drawWaveform);
  };

  private updateVoiceCount(count: number): void {
    const voiceCountElement = document.getElementById('voice-count');
    if (voiceCountElement) {
      voiceCountElement.textContent = count.toString();
    }
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}