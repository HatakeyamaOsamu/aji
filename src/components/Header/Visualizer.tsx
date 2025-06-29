import React, { useEffect, useRef } from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { FPSLimiter } from '../../utils/performance';

export const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const fpsLimiterRef = useRef(new FPSLimiter(30));
  const { synthEngine, voiceCount } = useSynth();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(resizeCanvas, 250);
    };

    window.addEventListener('resize', handleResize);

    const drawWaveform = (currentTime: number = 0) => {
      animationIdRef.current = requestAnimationFrame(drawWaveform);

      if (!fpsLimiterRef.current.shouldRender(currentTime)) {
        return;
      }

      const width = canvas.width / Math.min(window.devicePixelRatio, 2);
      const height = canvas.height / Math.min(window.devicePixelRatio, 2);

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Skip waveform drawing if no voices active
      if (voiceCount === 0) {
        return;
      }

      const analyser = synthEngine.getAnalyser();
      if (!analyser) return;

      const values = analyser.getValue() as Float32Array;
      if (values.length === 0) return;

      // Draw waveform
      ctx.beginPath();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;

      const step = Math.ceil(values.length / width);

      for (let i = 0; i < values.length; i += step) {
        const x = (i / values.length) * width;
        const y = ((values[i] + 1) / 2) * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    drawWaveform();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [synthEngine, voiceCount]);

  return <canvas ref={canvasRef} className="waveform-display" />;
};