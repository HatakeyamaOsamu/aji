import type { SynthEngine } from '../synth/SynthEngine';
import { VIRTUAL_KEYBOARD_NOTES } from '../utils/constants';
import * as Tone from 'tone';

export class VirtualKeyboard {
  private synthEngine: SynthEngine;
  private keyboard: HTMLElement;
  private keyElements: Map<string, HTMLElement> = new Map();

  constructor(synthEngine: SynthEngine) {
    this.synthEngine = synthEngine;
    this.keyboard = document.getElementById('virtual-keyboard')!;
    this.createKeyboard();
    this.setupKeyboardEvents();
  }

  private createKeyboard(): void {
    let whiteKeyIndex = 0;
    const whiteKeyMap = new Map<string, number>();
    
    // Map white keys
    VIRTUAL_KEYBOARD_NOTES.forEach((noteData) => {
      if (!noteData.isBlack) {
        whiteKeyMap.set(noteData.note, whiteKeyIndex);
        whiteKeyIndex++;
      }
    });
    
    // Create keys
    VIRTUAL_KEYBOARD_NOTES.forEach((noteData, index) => {
      const key = document.createElement('div');
      key.className = noteData.isBlack ? 'piano-key black-key' : 'piano-key white-key';
      key.dataset.note = noteData.note;
      key.dataset.key = noteData.key;
      
      // Position keys
      if (noteData.isBlack) {
        let prevWhiteIndex = -1;
        for (let i = index - 1; i >= 0; i--) {
          if (!VIRTUAL_KEYBOARD_NOTES[i].isBlack) {
            prevWhiteIndex = whiteKeyMap.get(VIRTUAL_KEYBOARD_NOTES[i].note)!;
            break;
          }
        }
        key.style.left = `${(prevWhiteIndex + 0.65) * 40}px`;
      } else {
        const keyIndex = whiteKeyMap.get(noteData.note)!;
        key.style.left = `${keyIndex * 40}px`;
      }
      
      // Add key label
      const label = document.createElement('span');
      label.className = 'key-label';
      label.textContent = noteData.key.toUpperCase();
      key.appendChild(label);
      
      // Setup events
      this.setupKeyEvents(key, noteData.note);
      
      this.keyboard.appendChild(key);
      this.keyElements.set(noteData.note, key);
    });
  }

  private setupKeyEvents(key: HTMLElement, note: string): void {
    // Mouse events
    key.addEventListener('mousedown', () => this.startNoteFromVirtualKeyboard(note));
    key.addEventListener('mouseup', () => this.stopNote(note));
    key.addEventListener('mouseleave', () => this.stopNote(note));
    
    // Touch events
    key.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startNoteFromVirtualKeyboard(note);
    });
    key.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.stopNote(note);
    });
  }

  private async startNoteFromVirtualKeyboard(note: string): Promise<void> {
    await Tone.start();
    await this.synthEngine.startNote(note, note);
    this.highlightKey(note, true);
  }

  private stopNote(note: string): void {
    this.synthEngine.stopNote(note);
    this.highlightKey(note, false);
  }

  highlightKey(note: string, active: boolean): void {
    const keyElement = this.keyElements.get(note);
    if (keyElement) {
      if (active) {
        keyElement.classList.add('active');
      } else {
        keyElement.classList.remove('active');
      }
    }
  }

  private setupKeyboardEvents(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;
    
    const key = event.key.toLowerCase();
    const noteData = VIRTUAL_KEYBOARD_NOTES.find(n => n.key === key);
    
    if (noteData) {
      this.synthEngine.startNote(key, noteData.note);
      this.highlightKey(noteData.note, true);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    const noteData = VIRTUAL_KEYBOARD_NOTES.find(n => n.key === key);
    
    if (noteData) {
      this.synthEngine.stopNote(key);
      this.highlightKey(noteData.note, false);
    }
  }
}