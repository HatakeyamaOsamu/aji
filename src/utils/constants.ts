import type { VirtualKeyNote } from '../types';

// 同時押しに対応するためボイス数を増加
export const MAX_VOICES = 16;

export const DEFAULT_SYNTH_OPTIONS = {
  oscillator: {
    type: 'sawtooth' as const
  },
  envelope: {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.8
  }
};

export const DEFAULT_FILTER_SETTINGS = {
  type: 'lowpass' as BiquadFilterType,
  frequency: 2000,
  Q: 1
};

export const KEY_TO_NOTE: Record<string, string> = {
  // Lower octave
  'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
  'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3',
  'j': 'A#3', 'm': 'B3',
  // Upper octave
  'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4',
  'r': 'F4', '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4',
  '7': 'A#4', 'u': 'B4', 'i': 'C5'
};

export const VIRTUAL_KEYBOARD_NOTES: VirtualKeyNote[] = [
  {note: 'C3', isBlack: false, key: 'z'},
  {note: 'C#3', isBlack: true, key: 's'},
  {note: 'D3', isBlack: false, key: 'x'},
  {note: 'D#3', isBlack: true, key: 'd'},
  {note: 'E3', isBlack: false, key: 'c'},
  {note: 'F3', isBlack: false, key: 'v'},
  {note: 'F#3', isBlack: true, key: 'g'},
  {note: 'G3', isBlack: false, key: 'b'},
  {note: 'G#3', isBlack: true, key: 'h'},
  {note: 'A3', isBlack: false, key: 'n'},
  {note: 'A#3', isBlack: true, key: 'j'},
  {note: 'B3', isBlack: false, key: 'm'},
  {note: 'C4', isBlack: false, key: 'q'},
  {note: 'C#4', isBlack: true, key: '2'},
  {note: 'D4', isBlack: false, key: 'w'},
  {note: 'D#4', isBlack: true, key: '3'},
  {note: 'E4', isBlack: false, key: 'e'},
  {note: 'F4', isBlack: false, key: 'r'},
  {note: 'F#4', isBlack: true, key: '5'},
  {note: 'G4', isBlack: false, key: 't'},
  {note: 'G#4', isBlack: true, key: '6'},
  {note: 'A4', isBlack: false, key: 'y'},
  {note: 'A#4', isBlack: true, key: '7'},
  {note: 'B4', isBlack: false, key: 'u'},
  {note: 'C5', isBlack: false, key: 'i'}
];