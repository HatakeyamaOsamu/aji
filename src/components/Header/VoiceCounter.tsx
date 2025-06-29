import React from 'react';
import { useSynth } from '../../contexts/SynthContext';
import { MAX_VOICES } from '../../utils/constants';

export const VoiceCounter: React.FC = () => {
  const { voiceCount } = useSynth();

  return (
    <div className="voice-counter">
      <span>Voices:</span>
      <span>{voiceCount}</span>
      <span>/{MAX_VOICES}</span>
    </div>
  );
};