import React, { useState } from 'react';
import { Piano } from './Piano';
import { OctaveControl } from './SynthControls/OctaveControl';
import { VolumeControl } from './SynthControls/VolumeControl';
import { WaveformSelector } from './SynthControls/WaveformSelector';
import { EnvelopeControl } from './SynthControls/EnvelopeControl';
import { FilterControl } from './SynthControls/FilterControl';
import { EffectsControl } from './SynthControls/EffectsControl';
import { useSynth } from '../hooks/useSynth';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { usePianoKeys } from '../hooks/usePianoKeys';
import { getKeyboardMap } from '../utils/noteMapping';
import { DEFAULT_BASE_OCTAVE } from '../constants/keyboard';
import { SYNTH_DEFAULTS, EFFECT_DEFAULTS, WaveformType } from '../constants/synth';
import '../styles/synth.css';

export const SimpleSynth: React.FC = () => {
  // Octave control
  const [baseOctave, setBaseOctave] = useState(DEFAULT_BASE_OCTAVE);
  const keyboardMap = getKeyboardMap(baseOctave);
  
  // Piano display settings
  const startOctave = 2;
  const numOctaves = 5;
  const pianoKeys = usePianoKeys({ startOctave, numOctaves });
  
  // Synth parameters state
  const [volume, setVolume] = useState(SYNTH_DEFAULTS.volume);
  const [attack, setAttack] = useState(SYNTH_DEFAULTS.attack);
  const [decay, setDecay] = useState(SYNTH_DEFAULTS.decay);
  const [sustain, setSustain] = useState(SYNTH_DEFAULTS.sustain);
  const [release, setRelease] = useState(SYNTH_DEFAULTS.release);
  const [waveform, setWaveform] = useState<WaveformType>(SYNTH_DEFAULTS.waveform);
  
  // Effect parameters state
  const [reverbWet, setReverbWet] = useState(EFFECT_DEFAULTS.reverbWet);
  const [delayWet, setDelayWet] = useState(EFFECT_DEFAULTS.delayWet);
  const [chorusWet, setChorusWet] = useState(EFFECT_DEFAULTS.chorusWet);
  const [filterFreq, setFilterFreq] = useState(EFFECT_DEFAULTS.filterFreq);
  
  // Active keys state
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  // Initialize synth with audio status
  const { 
    startNote: synthStartNote, 
    stopNote: synthStopNote,
    isAudioReady,
    audioError
  } = useSynth(
    { volume, attack, decay, sustain, release, waveform },
    { reverbWet, delayWet, chorusWet, filterFreq }
  );
  
  // Note handling with error handling and active keys update
  const startNote = async (note: string) => {
    try {
      await synthStartNote(note);
      setActiveKeys(prev => new Set([...prev, note]));
    } catch (error) {
      console.error('ノート開始エラー:', error);
    }
  };
  
  const stopNote = (note: string) => {
    try {
      synthStopNote(note);
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    } catch (error) {
      console.error('ノート停止エラー:', error);
    }
  };
  
  // Keyboard input handling
  useKeyboardInput({
    baseOctave,
    onOctaveChange: setBaseOctave,
    onNoteStart: startNote,
    onNoteStop: stopNote
  });
  
  return (
    <div className="synth-container">
      <header className="synth-header">
        <h1>Musako - Simple Browser Synthesizer</h1>
        
        {/* Audio status display */}
        <div className="audio-status">
          {audioError ? (
            <div className="audio-error">
              ❌ 音声エラー: {audioError}
              <br />
              <small>ページを再読み込みして、鍵盤をクリックしてください</small>
            </div>
          ) : isAudioReady ? (
            <div className="audio-ready">🎵 音声準備完了</div>
          ) : (
            <div className="audio-waiting">
              🔊 音を鳴らすには、鍵盤をクリックしてください
            </div>
          )}
        </div>
      </header>
      
      <div className="controls-grid">
        <OctaveControl 
          baseOctave={baseOctave} 
          onChange={setBaseOctave} 
        />
        
        <VolumeControl 
          volume={volume} 
          onChange={setVolume} 
        />
        
        <WaveformSelector 
          waveform={waveform} 
          onChange={setWaveform} 
        />
        
        <EnvelopeControl
          attack={attack}
          decay={decay}
          sustain={sustain}
          release={release}
          onAttackChange={setAttack}
          onDecayChange={setDecay}
          onSustainChange={setSustain}
          onReleaseChange={setRelease}
        />
        
        <FilterControl 
          frequency={filterFreq} 
          onChange={setFilterFreq} 
        />
        
        <EffectsControl
          reverbWet={reverbWet}
          delayWet={delayWet}
          chorusWet={chorusWet}
          onReverbChange={setReverbWet}
          onDelayChange={setDelayWet}
          onChorusChange={setChorusWet}
        />
      </div>
      
      <Piano
        pianoKeys={pianoKeys}
        activeKeys={activeKeys}
        keyboardMap={keyboardMap}
        startOctave={startOctave}
        numOctaves={numOctaves}
        onNoteStart={startNote}
        onNoteStop={stopNote}
      />
    </div>
  );
};