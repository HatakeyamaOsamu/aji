import React from 'react';
import { OscillatorControl } from './OscillatorControl';
import { EnvelopeControl } from './EnvelopeControl';
import { FilterControl } from './FilterControl';
import { MasterControl } from './MasterControl';
import { ChorusControl } from './ChorusControl';
import { DelayControl } from './DelayControl';
import { ReverbControl } from './ReverbControl';

export const ControlsGrid: React.FC = () => {
  return (
    <div className="controls-grid">
      <OscillatorControl />
      <EnvelopeControl />
      <FilterControl />
      <MasterControl />
      <ChorusControl />
      <DelayControl />
      <ReverbControl />
    </div>
  );
};