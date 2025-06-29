import React from 'react';
import { OscillatorControl } from './OscillatorControl';
import { EnvelopeControl } from './EnvelopeControl';
import { FilterControl } from './FilterControl';
import { MasterControl } from './MasterControl';

export const ControlsGrid: React.FC = () => {
  return (
    <div className="controls-grid">
      <OscillatorControl />
      <EnvelopeControl />
      <FilterControl />
      <MasterControl />
      
      {/* Effects - Coming soon */}
      <div className="control-section chorus-section">
        <h2 className="section-title">Chorus</h2>
        <p>Coming soon...</p>
      </div>
      <div className="control-section delay-section">
        <h2 className="section-title">Delay</h2>
        <p>Coming soon...</p>
      </div>
      <div className="control-section reverb-section">
        <h2 className="section-title">Reverb</h2>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};