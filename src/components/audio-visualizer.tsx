"use client";

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode;
}

const AudioVisualizer = ({ analyserNode }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteTimeDomainData(dataArray);

      const { width, height } = canvas;
      canvasCtx.clearRect(0, 0, width, height);

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
      
      const gradient = canvasCtx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `hsl(${primaryColor})`);
      gradient.addColorStop(1, `hsl(${accentColor})`);

      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = gradient;

      canvasCtx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode, resolvedTheme]);

  return <canvas ref={canvasRef} width="300" height="150" className="w-full h-full" />;
};

export default AudioVisualizer;
