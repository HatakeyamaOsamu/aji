import { SynthEngine } from './synth';
import { EffectController } from './effects';
import { Controls, VirtualKeyboard, Visualizer } from './ui';

class ToneSynthApp {
  private synthEngine: SynthEngine;
  private effectController: EffectController;
  // These are initialized but not directly referenced, prefix with _ to indicate intentional
  private _controls: Controls;
  private _virtualKeyboard: VirtualKeyboard;
  private visualizer: Visualizer;

  constructor() {
    this.synthEngine = new SynthEngine();
    this.effectController = new EffectController(this.synthEngine);
    this._controls = new Controls(this.synthEngine, this.effectController);
    this._virtualKeyboard = new VirtualKeyboard(this.synthEngine);
    this.visualizer = new Visualizer(this.synthEngine);
  }

  dispose(): void {
    this.visualizer.dispose();
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ToneSynthApp();
  });
} else {
  new ToneSynthApp();
}