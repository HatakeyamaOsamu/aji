import type { SynthEngine } from '../synth/SynthEngine';
import type { EffectController } from '../effects/EffectController';
import { throttle } from '../utils/performance';

export class Controls {
  private synthEngine: SynthEngine;
  private effectController: EffectController;

  constructor(synthEngine: SynthEngine, effectController: EffectController) {
    this.synthEngine = synthEngine;
    this.effectController = effectController;
    this.initializeControls();
  }

  private initializeControls(): void {
    this.initWaveformButtons();
    this.initEnvelopeControls();
    this.initFilterControls();
    this.initEffectControls();
    this.initMasterControls();
  }

  private initWaveformButtons(): void {
    const buttons = document.querySelectorAll('.waveform-button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const waveform = target.dataset.waveform as any;
        
        buttons.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        
        this.synthEngine.setSynthOptions({
          oscillator: { type: waveform }
        });
      });
    });
  }

  private initEnvelopeControls(): void {
    const controls = [
      { id: 'attack', property: 'attack', min: 0, max: 2, display: (v: number) => `${v}s` },
      { id: 'decay', property: 'decay', min: 0, max: 2, display: (v: number) => `${v}s` },
      { id: 'sustain', property: 'sustain', min: 0, max: 1, display: (v: number) => `${Math.round(v * 100)}%` },
      { id: 'release', property: 'release', min: 0, max: 5, display: (v: number) => `${v}s` }
    ];

    controls.forEach(({ id, property, display }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(`${id}-value`) as HTMLElement;
      
      // Throttle slider updates for better performance
      const updateValue = throttle((value: number) => {
        valueDisplay.textContent = display(value);
        this.synthEngine.setSynthOptions({
          envelope: { [property]: value }
        });
      }, 16); // ~60fps
      
      slider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        updateValue(value);
      });
    });
  }

  private initFilterControls(): void {
    // Filter type buttons
    const filterButtons = document.querySelectorAll('.filter-type-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const filterType = target.dataset.filter as any;
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        
        this.synthEngine.setFilterSettings({ type: filterType });
      });
    });

    // Filter sliders with throttling
    const cutoffSlider = document.getElementById('filter-cutoff') as HTMLInputElement;
    const cutoffDisplay = document.getElementById('filter-cutoff-value') as HTMLElement;
    
    const updateCutoff = throttle((value: number) => {
      cutoffDisplay.textContent = `${value}Hz`;
      this.synthEngine.setFilterSettings({ frequency: value });
    }, 16);
    
    cutoffSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      updateCutoff(value);
    });

    const resonanceSlider = document.getElementById('filter-resonance') as HTMLInputElement;
    const resonanceDisplay = document.getElementById('filter-resonance-value') as HTMLElement;
    
    const updateResonance = throttle((value: number) => {
      resonanceDisplay.textContent = value.toFixed(1);
      this.synthEngine.setFilterSettings({ Q: value });
    }, 16);
    
    resonanceSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      updateResonance(value);
    });
  }

  private initEffectControls(): void {
    const effectControls = [
      // Chorus
      { id: 'chorus-frequency', setter: 'setChorusFrequency', display: (v: number) => `${v.toFixed(1)}Hz` },
      { id: 'chorus-depth', setter: 'setChorusDepth', display: (v: number) => `${Math.round(v * 100)}%` },
      { id: 'chorus-mix', setter: 'setChorusMix', display: (v: number) => `${Math.round(v * 100)}%` },
      // Delay
      { id: 'delay-time', setter: 'setDelayTime', display: (v: number) => `${v.toFixed(2)}s` },
      { id: 'delay-feedback', setter: 'setDelayFeedback', display: (v: number) => `${Math.round(v * 100)}%` },
      { id: 'delay-mix', setter: 'setDelayMix', display: (v: number) => `${Math.round(v * 100)}%` },
      // Reverb
      { id: 'reverb-size', setter: 'setReverbSize', display: (v: number) => `${Math.round(v * 100)}%` },
      { id: 'reverb-dampening', setter: 'setReverbDampening', display: (v: number) => `${v}Hz` },
      { id: 'reverb-mix', setter: 'setReverbMix', display: (v: number) => `${Math.round(v * 100)}%` }
    ];

    effectControls.forEach(({ id, setter, display }) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueDisplay = document.getElementById(`${id}-value`) as HTMLElement;
      
      const updateValue = throttle((value: number) => {
        valueDisplay.textContent = display(value);
        (this.effectController as any)[setter](value);
      }, 16);
      
      slider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        updateValue(value);
      });
    });
  }

  private initMasterControls(): void {
    const volumeSlider = document.getElementById('volume') as HTMLInputElement;
    const volumeDisplay = document.getElementById('volume-value') as HTMLElement;
    
    const updateVolume = throttle((value: number) => {
      volumeDisplay.textContent = `${value}%`;
      this.effectController.setMasterVolume(value);
    }, 16);
    
    volumeSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      updateVolume(value);
    });
  }
}