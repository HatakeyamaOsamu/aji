import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';
import '../styles/synth.css';

// Note mapping for keyboard (with octave shift)
const KEYBOARD_BASE_MAP: Record<string, string> = {
  // Lower row (Z-M)
  'z': 'C', 's': 'C#', 'x': 'D', 'd': 'D#', 'c': 'E',
  'v': 'F', 'g': 'F#', 'b': 'G', 'h': 'G#', 'n': 'A',
  'j': 'A#', 'm': 'B',
  // Upper row (Q-I) - one octave higher
  'q': 'C', '2': 'C#', 'w': 'D', '3': 'D#', 'e': 'E',
  'r': 'F', '5': 'F#', 't': 'G', '6': 'G#', 'y': 'A',
  '7': 'A#', 'u': 'B', 'i': 'C'
};

// Get keyboard map with octave offsets
const getKeyboardMap = (baseOctave: number): Record<string, string> => {
  const map: Record<string, string> = {};
  
  // Lower row
  ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'].forEach(key => {
    const note = KEYBOARD_BASE_MAP[key];
    map[key] = `${note}${baseOctave}`;
  });
  
  // Upper row (one octave higher)
  ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u'].forEach(key => {
    const note = KEYBOARD_BASE_MAP[key];
    map[key] = `${note}${baseOctave + 1}`;
  });
  
  // Special case for 'i' - goes to the next octave
  map['i'] = `C${baseOctave + 2}`;
  
  return map;
};

// Generate piano keys for multiple octaves
const generatePianoKeys = (startOctave: number, numOctaves: number) => {
  const keys = [];
  const notePattern = [
    { note: 'C', isBlack: false, relativePos: 0 },
    { note: 'C#', isBlack: true, relativePos: 28 },
    { note: 'D', isBlack: false, relativePos: 40 },
    { note: 'D#', isBlack: true, relativePos: 68 },
    { note: 'E', isBlack: false, relativePos: 80 },
    { note: 'F', isBlack: false, relativePos: 120 },
    { note: 'F#', isBlack: true, relativePos: 148 },
    { note: 'G', isBlack: false, relativePos: 160 },
    { note: 'G#', isBlack: true, relativePos: 188 },
    { note: 'A', isBlack: false, relativePos: 200 },
    { note: 'A#', isBlack: true, relativePos: 228 },
    { note: 'B', isBlack: false, relativePos: 240 },
  ];
  
  for (let octave = 0; octave < numOctaves; octave++) {
    const octaveOffset = octave * 280; // Width of one octave
    notePattern.forEach(({ note, isBlack, relativePos }) => {
      keys.push({
        note: `${note}${startOctave + octave}`,
        isBlack,
        position: relativePos + octaveOffset
      });
    });
  }
  
  // Add final C
  keys.push({
    note: `C${startOctave + numOctaves}`,
    isBlack: false,
    position: numOctaves * 280
  });
  
  return keys;
};

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
  
  // Octave control
  const [baseOctave, setBaseOctave] = useState(3);
  const [keyboardMap, setKeyboardMap] = useState(getKeyboardMap(3));
  
  // Piano display settings
  const startOctave = 2;
  const numOctaves = 5; // Show 5 octaves (C2 to C7)
  const pianoKeys = generatePianoKeys(startOctave, numOctaves);
  
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
  
  // Update keyboard map when base octave changes
  useEffect(() => {
    setKeyboardMap(getKeyboardMap(baseOctave));
  }, [baseOctave]);
  
  // Initialize synth and effects
  useEffect(() => {
    const initAudio = async () => {
      await Tone.start();
      
      // Create synth with more voices for extended range
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: waveform },
        envelope: { attack, decay, sustain, release }
      });
      synth.maxPolyphony = 32; // Increase polyphony for more simultaneous notes
      
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
  
  // Keyboard event handlers with octave shift
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle octave shifting
      if (e.key === 'ArrowLeft' && !e.repeat) {
        setBaseOctave(prev => Math.max(1, prev - 1));
        return;
      }
      if (e.key === 'ArrowRight' && !e.repeat) {
        setBaseOctave(prev => Math.min(6, prev + 1));
        return;
      }
      
      if (e.repeat) return;
      const note = keyboardMap[e.key.toLowerCase()];
      if (note) startNote(note);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyboardMap[e.key.toLowerCase()];
      if (note) stopNote(note);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyboardMap, startNote, stopNote]);
  
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
        {!isBlack && <span className="note-label">{note}</span>}
      </div>
    );
  };
  
  return (
    <div className="synth-container">
      <header className="synth-header">
        <h1>Musako - Simple Browser Synthesizer</h1>
      </header>
      
      <div className="controls-grid">
        <div className="control-section octave-control">
          <h3>Octave Control</h3>
          <div className="octave-display">
            <button onClick={() => setBaseOctave(prev => Math.max(1, prev - 1))} disabled={baseOctave <= 1}>
              ←
            </button>
            <span>Base Octave: {baseOctave}</span>
            <button onClick={() => setBaseOctave(prev => Math.min(6, prev + 1))} disabled={baseOctave >= 6}>
              →
            </button>
          </div>
          <p className="hint">Use ← → arrow keys to shift octaves</p>
        </div>
        
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
      
      <div className="keyboard-wrapper">
        <div className="virtual-keyboard extended">
          {/* Render white keys first */}
          {pianoKeys.filter(key => !key.isBlack).map(key => {
            const keyboardKey = Object.entries(keyboardMap).find(([_, n]) => n === key.note)?.[0];
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
          {pianoKeys.filter(key => key.isBlack).map(key => {
            const keyboardKey = Object.entries(keyboardMap).find(([_, n]) => n === key.note)?.[0];
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
          
          {/* Octave indicators */}
          {Array.from({ length: numOctaves }, (_, i) => (
            <div
              key={i}
              className="octave-indicator"
              style={{ left: `${i * 280}px` }}
            >
              C{startOctave + i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};