import { KEYBOARD_BASE_MAP, LOWER_ROW_KEYS, UPPER_ROW_KEYS } from '../constants/keyboard';

/**
 * Get keyboard map with octave offsets
 * @param baseOctave - The base octave for the lower row
 * @returns Keyboard key to note mapping
 */
export const getKeyboardMap = (baseOctave: number): Record<string, string> => {
  const map: Record<string, string> = {};
  
  // Lower row
  LOWER_ROW_KEYS.forEach(key => {
    const note = KEYBOARD_BASE_MAP[key];
    map[key] = `${note}${baseOctave}`;
  });
  
  // Upper row (one octave higher)
  UPPER_ROW_KEYS.forEach(key => {
    const note = KEYBOARD_BASE_MAP[key];
    map[key] = `${note}${baseOctave + 1}`;
  });
  
  // Special case for 'i' - goes to the next octave
  map['i'] = `C${baseOctave + 2}`;
  
  return map;
};