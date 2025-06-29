import React from 'react';
import { SynthProvider } from '../contexts/SynthContext';
import { Header } from './Header/Header';
import { ControlsGrid } from './Controls/ControlsGrid';
import { Keyboard } from './Keyboard/Keyboard';

export const App: React.FC = () => {
  return (
    <SynthProvider>
      <div className="container">
        <Header />
        <ControlsGrid />
        <Keyboard />
      </div>
    </SynthProvider>
  );
};