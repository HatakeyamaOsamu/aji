import type { SynthEngine } from '../synth/SynthEngine';
import type { EffectController } from '../effects/EffectController';
import type { OscillatorType } from '../types';

export class Controls {
  private synthEngine: SynthEngine;
  private effectController: EffectController;

  constructor(synthEngine: SynthEngine, effectController: EffectController) {
    this.synthEngine = synthEngine;
    this.effectController = effectController;
    this.initializeControls();
  }

  private initializeControls(): void {
    this.initializeWaveformButtons();
    this.initializeFilterButtons();
    this.initializeEnvelopeControls();
    this.initializeMasterControls();
    this.initializeFilterControls();
    this.initializeChorusControls();
    this.initializeDelayControls();
    this.initializeReverbControls();
  }

  private initializeWaveformButtons(): void {
    document.querySelectorAll('.waveform-button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.waveform-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const waveform = (button as HTMLElement).dataset.waveform as OscillatorType;
        this.synthEngine.setSynthOptions({ oscillator: { type: waveform } });
      });
    });
  }

  private initializeFilterButtons(): void {
    document.querySelectorAll('.filter-type-button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.filter-type-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const filterType = (button as HTMLElement).dataset.filter as BiquadFilterType;
        this.effectController.setFilterType(filterType);
      });
    });
  }

  private initializeEnvelopeControls(): void {
    this.setupSlider('attack', (value) => {
      this.synthEngine.setSynthOptions({ envelope: { attack: value } });
      return `${value}s`;
    });

    this.setupSlider('decay', (value) => {
      this.synthEngine.setSynthOptions({ envelope: { decay: value } });
      return `${value}s`;
    });

    this.setupSlider('sustain', (value) => {
      this.synthEngine.setSynthOptions({ envelope: { sustain: value } });
      return `${Math.round(value * 100)}%`;
    });

    this.setupSlider('release', (value) => {
      this.synthEngine.setSynthOptions({ envelope: { release: value } });
      return `${value}s`;
    });
  }

  private initializeMasterControls(): void {
    this.setupSlider('volume', (value) => {
      this.effectController.setMasterVolume(value);
      return `${value}%`;
    });
  }

  private initializeFilterControls(): void {
    this.setupSlider('filter-cutoff', (value) => {
      this.effectController.setFilterFrequency(value);
      return `${Math.round(value)}Hz`;
    });

    this.setupSlider('filter-resonance', (value) => {
      this.effectController.setFilterResonance(value);
      return value.toString();
    });
  }

  private initializeChorusControls(): void {
    this.setupSlider('chorus-frequency', (value) => {
      this.effectController.setChorusFrequency(value);
      return `${value}Hz`;
    });

    this.setupSlider('chorus-depth', (value) => {
      this.effectController.setChorusDepth(value);
      return `${Math.round(value * 100)}%`;
    });

    this.setupSlider('chorus-mix', (value) => {
      this.effectController.setChorusMix(value);
      return `${Math.round(value * 100)}%`;
    });
  }

  private initializeDelayControls(): void {
    this.setupSlider('delay-time', (value) => {
      this.effectController.setDelayTime(value);
      return `${value}s`;
    });

    this.setupSlider('delay-feedback', (value) => {
      this.effectController.setDelayFeedback(value);
      return `${Math.round(value * 100)}%`;
    });

    this.setupSlider('delay-mix', (value) => {
      this.effectController.setDelayMix(value);
      return `${Math.round(value * 100)}%`;
    });
  }

  private initializeReverbControls(): void {
    this.setupSlider('reverb-size', (value) => {
      this.effectController.setReverbSize(value);
      return `${Math.round(value * 100)}%`;
    });

    this.setupSlider('reverb-dampening', (value) => {
      this.effectController.setReverbDampening(value);
      return `${Math.round(value)}Hz`;
    });

    this.setupSlider('reverb-mix', (value) => {
      this.effectController.setReverbMix(value);
      return `${Math.round(value * 100)}%`;
    });
  }

  private setupSlider(
    id: string,
    onChange: (value: number) => string
  ): void {
    const slider = document.getElementById(id) as HTMLInputElement;
    const valueDisplay = document.getElementById(`${id}-value`);
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        valueDisplay.textContent = onChange(value);
      });
    }
  }
}