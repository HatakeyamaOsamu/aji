import React from 'react';
import { LfoWaveformType } from '../../constants/synth';
import './SynthControls.css';

interface LfoControlProps {
  rate: number;
  filterDepth: number;
  ampDepth: number;
  waveform: LfoWaveformType;
  sync: boolean;
  onRateChange: (rate: number) => void;
  onFilterDepthChange: (depth: number) => void;
  onAmpDepthChange: (depth: number) => void;
  onWaveformChange: (waveform: LfoWaveformType) => void;
  onSyncChange: (sync: boolean) => void;
}

export const LfoControl: React.FC<LfoControlProps> = ({
  rate,
  filterDepth,
  ampDepth,
  waveform,
  sync,
  onRateChange,
  onFilterDepthChange,
  onAmpDepthChange,
  onWaveformChange,
  onSyncChange,
}) => {
  return (
    <div className="control-section">
      <h3>LFO</h3>
      
      <div className="lfo-content">
        {/* LFO Rate and Waveform */}
        <div className="lfo-main-controls">
          <div className="lfo-control">
            <label>Rate</label>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="control-slider"
            />
            <span className="control-value">{rate.toFixed(1)} Hz</span>
          </div>
          
          <div className="lfo-control">
            <label>Waveform</label>
            <select
              value={waveform}
              onChange={(e) => onWaveformChange(e.target.value as LfoWaveformType)}
              className="control-select"
            >
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="random">Random</option>
            </select>
          </div>
        </div>

        {/* Modulation Targets */}
        <div className="lfo-targets">
          <div className="lfo-target-section">
            <h4 className="lfo-target-title">Modulation Targets</h4>
            
            <div className="lfo-target-controls">
              <div className="lfo-control">
                <label>Filter</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={filterDepth}
                  onChange={(e) => onFilterDepthChange(parseFloat(e.target.value))}
                  className="control-slider"
                />
                <span className="control-value">
                  {filterDepth === 0 ? 'Off' : `${(filterDepth * 100).toFixed(0)}%`}
                </span>
              </div>
              
              <div className="lfo-control">
                <label>Amplitude</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={ampDepth}
                  onChange={(e) => onAmpDepthChange(parseFloat(e.target.value))}
                  className="control-slider"
                />
                <span className="control-value">
                  {ampDepth === 0 ? 'Off' : `${(ampDepth * 100).toFixed(0)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Option */}
        <div className="lfo-sync">
          <label className="lfo-sync-label">
            <input
              type="checkbox"
              checked={sync}
              onChange={(e) => onSyncChange(e.target.checked)}
              className="lfo-sync-checkbox"
            />
            <span className="lfo-sync-text">Tempo Sync</span>
          </label>
        </div>
      </div>
    </div>
  );
};