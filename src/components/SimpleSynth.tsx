import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';
import '../styles/synth.css';

// Note mapping for keyboard
const KEYBOARD_MAP: Record<string, string> = {
  // Lower octave (C3-B3)
  'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
  'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3',
  'j': 'A#3', 'm': 'B3',
  // Upper octave (C4-B4)
  'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4',
  'r': 'F4', '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4',
  '7': 'A#4', 'u': 'B4', 'i': 'C5'
};

// Piano key definitions
const PIANO_KEYS = [
  { note: 'C3', isBlack: false, position: 0 },
  { note: 'C#3', isBlack: true, position: 28 },
  { note: 'D3', isBlack: false, position: 40 },
  { note: 'D#3', isBlack: true, position: 68 },
  { note: 'E3', isBlack: false, position: 80 },
  { note: 'F3', isBlack: false, position: 120 },
  { note: 'F#3', isBlack: true, position: 148 },
  { note: 'G3', isBlack: false, position: 160 },
  { note: 'G#3', isBlack: true, position: 188 },
  { note: 'A3', isBlack: false, position: 200 },
  { note: 'A#3', isBlack: true, position: 228 },
  { note: 'B3', isBlack: false, position: 240 },
  { note: 'C4', isBlack: false, position: 280 },
  { note: 'C#4', isBlack: true, position: 308 },
  { note: 'D4', isBlack: false, position: 320 },
  { note: 'D#4', isBlack: true, position: 348 },
  { note: 'E4', isBlack: false, position: 360 },
  { note: 'F4', isBlack: false, position: 400 },
  { note: 'F#4', isBlack: true, position: 428 },
  { note: 'G4', isBlack: false, position: 440 },
  { note: 'G#4', isBlack: true, position: 468 },
  { note: 'A4', isBlack: false, position: 480 },
  { note: 'A#4', isBlack: true, position: 508 },
  { note: 'B4', isBlack: false, position: 520 },
  { note: 'C5', isBlack: false, position: 560 },
];

export const SimpleSynth: React.FC = () => {
  // Synth and effects
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const chorusRef = useRef<Tone.Chorus | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  
  // State for active notes
  const activeNotesRef = useRef<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  // Synth parameters state
  const [volume, setVolume] = useState(-10);
  const [attack, setAttack] = useState(0.005);
  const [decay, setDecay] = useState(0.1);
  const [sustain, setSustain] = useState(0.3);
  const [release, setRelease] = useState(0.3);
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  
  // Effect parameters state
  const [reverbWet, setReverbWet] = useState(0);
  const [delayWet, setDelayWet] = useState(0);
  const [chorusWet, setChorusWet] = useState(0);
  const [filterFreq, setFilterFreq] = useState(2000);
  
  // Initialize synth and effects
  useEffect(() => {
    const initAudio = async () => {
      await Tone.start();
      
      // Create synth
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: waveform },
        envelope: { attack, decay, sustain, release }
      });
      
      // Create effects
      const reverb = new Tone.Reverb({ decay: 2.5, wet: reverbWet });
      const delay = new Tone.FeedbackDelay({ delayTime: 0.25, feedback: 0.3, wet: delayWet });
      const chorus = new Tone.Chorus({ frequency: 1.5, depth: 0.7, wet: chorusWet });
      const filter = new Tone.Filter({ frequency: filterFreq, type: 'lowpass' });
      const volumeNode = new Tone.Volume(volume);
      
      // Connect audio chain
      synth.connect(filter);
      filter.connect(chorus);
      chorus.connect(delay);
      delay.connect(reverb);
      reverb.connect(volumeNode);
      volumeNode.toDestination();
      
      // Store references
      synthRef.current = synth;
      reverbRef.current = reverb;
      delayRef.current = delay;
      chorusRef.current = chorus;
      filterRef.current = filter;
      volumeNodeRef.current = volumeNode;
      
      // Wait for reverb to be ready
      await reverb.ready;
    };
    
    initAudio();
    
    // Cleanup
    return () => {
      synthRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();
      chorusRef.current?.dispose();
      filterRef.current?.dispose();
      volumeNodeRef.current?.dispose();
    };
  }, []);
  
  // Update synth parameters
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.set({
        oscillator: { type: waveform },
        envelope: { attack, decay, sustain, release }
      });
    }
  }, [waveform, attack, decay, sustain, release]);
  
  // Update effects
  useEffect(() => {
    if (volumeNodeRef.current) volumeNodeRef.current.volume.value = volume;
  }, [volume]);
  
  useEffect(() => {
    if (reverbRef.current) reverbRef.current.wet.value = reverbWet;
  }, [reverbWet]);
  
  useEffect(() => {
    if (delayRef.current) delayRef.current.wet.value = delayWet;
  }, [delayWet]);
  
  useEffect(() => {
    if (chorusRef.current) chorusRef.current.wet.value = chorusWet;
  }, [chorusWet]);
  
  useEffect(() => {
    if (filterRef.current) filterRef.current.frequency.value = filterFreq;
  }, [filterFreq]);
  
  // Note handling
  const startNote = useCallback((note: string) => {
    if (!synthRef.current || activeNotesRef.current.has(note)) return;
    
    activeNotesRef.current.add(note);
    synthRef.current.triggerAttack(note);
    setActiveKeys(new Set(activeNotesRef.current));
  }, []);
  
  const stopNote = useCallback((note: string) => {
    if (!synthRef.current || !activeNotesRef.current.has(note)) return;
    
    activeNotesRef.current.delete(note);
    synthRef.current.triggerRelease(note);
    setActiveKeys(new Set(activeNotesRef.current));
  }, []);
  
  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) startNote(note);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) stopNote(note);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startNote, stopNote]);
  
  // Piano key component
  const PianoKey: React.FC<{
    note: string;
    isBlack: boolean;
    position: number;
    keyboardKey?: string;
  }> = ({ note, isBlack, position, keyboardKey }) => {
    const isPressed = useRef(false);
    
    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (isPressed.current) return;
      isPressed.current = true;
      startNote(note);
    };
    
    const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isPressed.current) return;
      isPressed.current = false;
      stopNote(note);
    };
    
    return (
      <div
        className={`piano-key ${isBlack ? 'black-key' : 'white-key'} ${activeKeys.has(note) ? 'active' : ''}`}
        style={{ left: `${position}px` }}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (isPressed.current) {
            isPressed.current = false;
            stopNote(note);
          }
        }}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        {keyboardKey && <span className="key-label">{keyboardKey.toUpperCase()}</span>}
      </div>
    );
  };
  
  return (
    <div className="synth-container">
      <header className="synth-header">
        <h1>Musako - Simple Browser Synthesizer</h1>
      </header>
      
      <div className="controls-grid">
        <div className="control-section">
          <h3>Volume</h3>
          <input
            type="range"
            min="-60"
            max="0"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span>{volume} dB</span>
        </div>
        
        <div className="control-section">
          <h3>Waveform</h3>
          <select value={waveform} onChange={(e) => setWaveform(e.target.value as any)}>
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        
        <div className="control-section">
          <h3>Envelope</h3>
          <label>Attack: {attack}s</label>
          <input
            type="range"
            min="0.001"
            max="2"
            step="0.001"
            value={attack}
            onChange={(e) => setAttack(Number(e.target.value))}
          />
          <label>Decay: {decay}s</label>
          <input
            type="range"
            min="0.001"
            max="2"
            step="0.001"
            value={decay}
            onChange={(e) => setDecay(Number(e.target.value))}
          />
          <label>Sustain: {sustain}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sustain}
            onChange={(e) => setSustain(Number(e.target.value))}
          />
          <label>Release: {release}s</label>
          <input
            type="range"
            min="0.001"
            max="5"
            step="0.001"
            value={release}
            onChange={(e) => setRelease(Number(e.target.value))}
          />
        </div>
        
        <div className="control-section">
          <h3>Filter</h3>
          <label>Frequency: {filterFreq}Hz</label>
          <input
            type="range"
            min="20"
            max="20000"
            value={filterFreq}
            onChange={(e) => setFilterFreq(Number(e.target.value))}
          />
        </div>
        
        <div className="control-section">
          <h3>Effects</h3>
          <label>Reverb: {(reverbWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={reverbWet}
            onChange={(e) => setReverbWet(Number(e.target.value))}
          />
          <label>Delay: {(delayWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={delayWet}
            onChange={(e) => setDelayWet(Number(e.target.value))}
          />
          <label>Chorus: {(chorusWet * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={chorusWet}
            onChange={(e) => setChorusWet(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="virtual-keyboard">
        {/* Render white keys first */}
        {PIANO_KEYS.filter(key => !key.isBlack).map(key => {
          const keyboardKey = Object.entries(KEYBOARD_MAP).find(([_, n]) => n === key.note)?.[0];
          return (
            <PianoKey
              key={key.note}
              note={key.note}
              isBlack={false}
              position={key.position}
              keyboardKey={keyboardKey}
            />
          );
        })}
        {/* Render black keys on top */}
        {PIANO_KEYS.filter(key => key.isBlack).map(key => {
          const keyboardKey = Object.entries(KEYBOARD_MAP).find(([_, n]) => n === key.note)?.[0];
          return (
            <PianoKey
              key={key.note}
              note={key.note}
              isBlack={true}
              position={key.position}
              keyboardKey={keyboardKey}
            />
          );
        })}
      </div>
    </div>
  );
};