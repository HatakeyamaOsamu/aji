// Keyboard key to note mapping
export const KEYBOARD_BASE_MAP: Record<string, string> = {
  // Lower row (Z-M)
  'z': 'C', 's': 'C#', 'x': 'D', 'd': 'D#', 'c': 'E',
  'v': 'F', 'g': 'F#', 'b': 'G', 'h': 'G#', 'n': 'A',
  'j': 'A#', 'm': 'B',
  // Upper row (Q-I) - one octave higher
  'q': 'C', '2': 'C#', 'w': 'D', '3': 'D#', 'e': 'E',
  'r': 'F', '5': 'F#', 't': 'G', '6': 'G#', 'y': 'A',
  '7': 'A#', 'u': 'B', 'i': 'C'
};

export const LOWER_ROW_KEYS = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'];
export const UPPER_ROW_KEYS = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u'];

export const MIN_OCTAVE = 1;
export const MAX_OCTAVE = 6;
export const DEFAULT_BASE_OCTAVE = 3;