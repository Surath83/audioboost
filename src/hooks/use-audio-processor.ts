
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSettings } from './use-settings';
import { AUDIO_FREQUENCIES } from '@/lib/constants';

type AudioStatus = 'stopped' | 'starting' | 'running' | 'error' | 'permission_denied';

export const useAudioProcessor = () => {
  const { settings } = useSettings();
  const [status, setStatus] = useState<AudioStatus>('stopped');
  const [error, setError] = useState<string | null>(null);
  const [isLeftEarEnabled, setIsLeftEarEnabled] = useState(true);
  const [isRightEarEnabled, setIsRightEarEnabled] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const leftGainNodesRef = useRef<Record<number, GainNode>>({});
  const rightGainNodesRef = useRef<Record<number, GainNode>>({});
  const leftMasterGainRef = useRef<GainNode | null>(null);
  const rightMasterGainRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const leftFilterNodesRef = useRef<Record<number, BiquadFilterNode>>({});
  const rightFilterNodesRef = useRef<Record<number, BiquadFilterNode>>({});

  const toggleLeftEar = () => setIsLeftEarEnabled(prev => !prev);
  const toggleRightEar = () => setIsRightEarEnabled(prev => !prev);

  const stopProcessing = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    audioContextRef.current = null;
    sourceNodeRef.current = null;
    analyserNodeRef.current = null;
    leftGainNodesRef.current = {};
    rightGainNodesRef.current = {};
    leftFilterNodesRef.current = {};
    rightFilterNodesRef.current = {};
    leftMasterGainRef.current = null;
    rightMasterGainRef.current = null;
    setStatus('stopped');
  }, []);

  const createFilterGainChain = (context: AudioContext, gainNodesRef: React.MutableRefObject<Record<number, GainNode>>, filterNodesRef: React.MutableRefObject<Record<number, BiquadFilterNode>>) => {
      let lastNode: AudioNode | null = null;

      AUDIO_FREQUENCIES.forEach(freq => {
          const biquadFilter = context.createBiquadFilter();
          biquadFilter.type = 'peaking';
          biquadFilter.frequency.value = freq;
          biquadFilter.Q.value = 1.414; // Controls the width of the band.
          filterNodesRef.current[freq] = biquadFilter;

          const gainNode = context.createGain();
          gainNodesRef.current[freq] = gainNode;
          
          if(lastNode) {
            lastNode.connect(biquadFilter);
          }
          biquadFilter.connect(gainNode);
          lastNode = gainNode;
      });
      return lastNode; // Return the last node in the chain
  };

  const startProcessing = useCallback(async () => {
    if (status === 'starting' || status === 'running') return;
    
    setStatus('starting');
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }, 
        video: false 
      });
      streamRef.current = stream;
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;

      const source = context.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      analyserNodeRef.current = analyser;
      
      const merger = context.createChannelMerger(2);
      merger.connect(context.destination);

      leftMasterGainRef.current = context.createGain();
      rightMasterGainRef.current = context.createGain();

      leftMasterGainRef.current.connect(merger, 0, 0);
      rightMasterGainRef.current.connect(merger, 0, 1);
      
      const leftChainEnd = createFilterGainChain(context, leftGainNodesRef, leftFilterNodesRef);
      const rightChainEnd = createFilterGainChain(context, rightGainNodesRef, rightFilterNodesRef);
      
      if(leftChainEnd) leftChainEnd.connect(leftMasterGainRef.current);
      if(rightChainEnd) rightChainEnd.connect(rightMasterGainRef.current);
      
      const monoSourceGain = context.createGain();
      // If the source is stereo, this will downmix it to mono by connecting both channels to one gain node.
      source.connect(monoSourceGain);
      
      const leftChainStart = leftFilterNodesRef.current[AUDIO_FREQUENCIES[0]];
      const rightChainStart = rightFilterNodesRef.current[AUDIO_FREQUENCIES[0]];

      monoSourceGain.connect(analyser);
      monoSourceGain.connect(leftChainStart);
      monoSourceGain.connect(rightChainStart);

      setStatus('running');

    } catch (err) {
      console.error('Error starting audio processing:', err);
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
          setStatus('permission_denied');
          setError("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
      stopProcessing();
    }
  }, [stopProcessing]);


  useEffect(() => {
    if (status === 'running' && audioContextRef.current) {
      // Update individual frequency gains
      AUDIO_FREQUENCIES.forEach(freq => {
        const tuningMultiplier = (settings.tuning[freq] || 50) / 100.0;
        
        if (leftGainNodesRef.current[freq]) {
          const gainInDb = (settings.leftEar[freq] || 0) * tuningMultiplier;
          const gainValue = Math.pow(10, gainInDb / 20);
          leftGainNodesRef.current[freq].gain.setTargetAtTime(gainValue, audioContextRef.current!.currentTime, 0.01);
        }
        
        if (rightGainNodesRef.current[freq]) {
            const gainInDb = (settings.rightEar[freq] || 0) * tuningMultiplier;
            const gainValue = Math.pow(10, gainInDb / 20);
            rightGainNodesRef.current[freq].gain.setTargetAtTime(gainValue, audioContextRef.current!.currentTime, 0.01);
          }
      });

      // Update master gain for left/right channels
      if (leftMasterGainRef.current) {
        leftMasterGainRef.current.gain.setTargetAtTime(isLeftEarEnabled ? 1 : 0, audioContextRef.current.currentTime, 0.01);
      }
      if (rightMasterGainRef.current) {
        rightMasterGainRef.current.gain.setTargetAtTime(isRightEarEnabled ? 1 : 0, audioContextRef.current.currentTime, 0.01);
      }
    }
  }, [settings, status, isLeftEarEnabled, isRightEarEnabled]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProcessing();
    };
  }, [stopProcessing]);

  return { 
    status, 
    error, 
    startProcessing, 
    stopProcessing, 
    analyserNode: analyserNodeRef.current,
    isLeftEarEnabled,
    toggleLeftEar,
    isRightEarEnabled,
    toggleRightEar
  };
};
