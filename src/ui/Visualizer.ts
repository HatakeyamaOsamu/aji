import type { SynthEngine } from '../synth/SynthEngine';
import { FPSLimiter } from '../utils/performance';

export class Visualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private synthEngine: SynthEngine;
  private animationId: number | null = null;
  private fpsLimiter: FPSLimiter;
  private isActive: boolean = false;

  constructor(synthEngine: SynthEngine) {
    this.synthEngine = synthEngine;
    this.canvas = document.getElementById('waveform') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
    
    // Limit to 30 FPS for better performance
    this.fpsLimiter = new FPSLimiter(30);
    
    this.setupCanvas();
    this.startAnimation();
    
    // Update voice count display
    this.synthEngine.setVoiceCountCallback((count) => {
      this.updateVoiceCount(count);
      this.isActive = count > 0;
    });
  }

  private setupCanvas(): void {
    this.resizeCanvas();
    
    // Debounce resize for better performance
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    window.addEventListener('resize', () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => this.resizeCanvas(), 250);
    });
  }

  private resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private startAnimation(): void {
    this.drawWaveform();
  }

  private drawWaveform = (currentTime: number = 0): void => {
    this.animationId = requestAnimationFrame(this.drawWaveform);
    
    // Skip rendering if FPS limit not reached
    if (!this.fpsLimiter.shouldRender(currentTime)) {
      return;
    }
    
    const width = this.canvas.width / Math.min(window.devicePixelRatio, 2);
    const height = this.canvas.height / Math.min(window.devicePixelRatio, 2);
    
    // Clear canvas
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);
    
    // Skip waveform drawing if no voices active
    if (!this.isActive) {
      return;
    }
    
    const analyser = this.synthEngine.getAnalyser();
    if (!analyser) return;
    
    const values = analyser.getValue() as Float32Array;
    if (values.length === 0) return;
    
    // Draw waveform
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 2;
    
    const step = Math.ceil(values.length / width); // Sample reduction for performance
    
    for (let i = 0; i < values.length; i += step) {
      const x = (i / values.length) * width;
      const y = ((values[i] + 1) / 2) * height;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
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
      this.animationId = null;
    }
  }
}