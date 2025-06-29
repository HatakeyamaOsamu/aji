import { SynthEngine } from './synth';
import { EffectController } from './effects';
import { Controls, VirtualKeyboard, Visualizer } from './ui';

class ToneSynthApp {
  private synthEngine: SynthEngine;
  private effectController: EffectController;
  private visualizer: Visualizer;

  constructor() {
    this.synthEngine = new SynthEngine();
    this.effectController = new EffectController(this.synthEngine);
    
    // Initialize UI components - they handle their own event listeners
    new Controls(this.synthEngine, this.effectController);
    new VirtualKeyboard(this.synthEngine);
    
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