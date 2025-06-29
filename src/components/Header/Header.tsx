import React from 'react';
import { Visualizer } from './Visualizer';
import { VoiceCounter } from './VoiceCounter';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="title">Tone Synth</h1>
      <div className="header-controls">
        <Visualizer />
        <VoiceCounter />
      </div>
    </header>
  );
};