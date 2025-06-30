import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export interface WaveformVisualizerProps {
  isActive: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create analyser if it doesn't exist
    if (!analyserRef.current) {
      analyserRef.current = new Tone.Analyser('waveform', 1024);
      // Connect to master output
      Tone.getDestination().connect(analyserRef.current);
    }

    const analyser = analyserRef.current;

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, width, height);

      if (isActive) {
        // Get waveform data
        const dataArray = analyser.getValue() as Float32Array;
        
        // Draw waveform
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] + 1) / 2; // Normalize from [-1, 1] to [0, 1]
          const y = v * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();
      } else {
        // Draw flat line when inactive
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (analyserRef.current) {
        analyserRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="waveform-visualizer">
      <canvas
        ref={canvasRef}
        width={180}
        height={60}
        style={{ width: '180px', height: '60px' }}
      />
    </div>
  );
};