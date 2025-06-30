export interface PianoKey {
  note: string;
  isBlack: boolean;
  position: number;
}

export interface NotePattern {
  note: string;
  isBlack: boolean;
  relativePos: number;
}

export const NOTE_PATTERN: NotePattern[] = [
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

export const OCTAVE_WIDTH = 280;

/**
 * Generate piano keys for multiple octaves
 * @param startOctave - The starting octave number
 * @param numOctaves - Number of octaves to generate
 * @returns Array of piano keys with position information
 */
export const generatePianoKeys = (startOctave: number, numOctaves: number): PianoKey[] => {
  const keys: PianoKey[] = [];
  
  for (let octave = 0; octave < numOctaves; octave++) {
    const octaveOffset = octave * OCTAVE_WIDTH;
    NOTE_PATTERN.forEach(({ note, isBlack, relativePos }) => {
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
    position: numOctaves * OCTAVE_WIDTH
  });
  
  return keys;
};