import { useMemo } from 'react';
import { generatePianoKeys, PianoKey } from '../utils/pianoKeyGenerator';

export interface UsePianoKeysProps {
  startOctave: number;
  numOctaves: number;
}

export const usePianoKeys = ({ startOctave, numOctaves }: UsePianoKeysProps): PianoKey[] => {
  return useMemo(
    () => generatePianoKeys(startOctave, numOctaves),
    [startOctave, numOctaves]
  );
};