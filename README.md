# Web Synth

A clean and intuitive polyphonic web synthesizer built with React, TypeScript, and Tone.js.

## 🎹 Features

- **Polyphonic synthesis** with intelligent voice management  
- **Multiple oscillator waveforms** with visual display: Sine, Square, Sawtooth, Triangle
- **Advanced ADSR envelope** control
- **Multi-mode filter** with frequency control
- **Professional effects chain**: Chorus, Delay, Reverb
- **3-octave virtual piano** (C2-C5) with balanced layout
- **Computer keyboard mapping** for live performance
- **Octave shifting** with unobtrusive controls
- **Clean, minimalist interface**

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with Web Audio API support
- **HTTPS connection** (required for Web Audio API)

### Installation

```bash
# Clone the repository
git clone https://github.com/HatakeyamaOsamu/musako.git
cd musako

# Install dependencies
npm install

# Start development server
npm run dev
```

### First Time Usage

1. Open the application in your browser
2. **Click any piano key** to initialize audio
3. Start playing with keyboard or mouse/touch

## 🎮 Interface Overview

### Layout
- **Top-left**: "Web Synth" title
- **Center**: Control panels (Volume, Waveform, Envelope, Filter, Effects)
- **Bottom**: 3-octave piano keyboard (C2-C5)
- **Bottom-right**: Octave controls (unobtrusive floating panel)

### Waveform Display
Each waveform selection shows a visual representation:
- **Sine**: Smooth wave curve
- **Square**: Digital on/off pattern  
- **Sawtooth**: Ramp wave pattern
- **Triangle**: Symmetric triangle wave

## 🔧 Troubleshooting

### No Sound Issue

If you experience no sound when pressing keys:

#### 1. **Browser Autoplay Policy**
Modern browsers require user interaction before playing audio:
- **Solution**: Click any piano key to initialize audio

#### 2. **HTTPS Requirement**
Web Audio API requires a secure connection:
- **Development**: Ensure `npm run dev` serves on HTTPS
- **Production**: Ensure your site is served over HTTPS

#### 3. **Browser Compatibility**
- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: May require additional interaction ⚠️
- **Mobile**: Touch-optimized 📱

#### 4. **System Audio**
- Check system volume and audio output device
- Ensure browser has permission to play audio
- Try refreshing the page and clicking a key again

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── SimpleSynth.tsx  # Main synthesizer component
│   ├── Piano/           # Virtual keyboard components
│   └── SynthControls/   # Control panel components
├── hooks/               # Custom React hooks
│   ├── useSynth.ts     # Audio synthesis logic
│   ├── useKeyboardInput.ts
│   └── usePianoKeys.ts
├── constants/           # Configuration constants
│   ├── keyboard.ts     # Keyboard mappings
│   └── synth.ts        # Synth default values
├── utils/              # Utility functions
│   └── noteMapping.ts  # Note to frequency mapping
├── styles/             # CSS styles
│   ├── index.css      # Global styles
│   └── synth.css      # Component styles
└── main.tsx           # Application entry point
```

## 🎮 Usage Guide

### Keyboard Mapping

```
Piano Layout:
  Black Keys:  S D   G H J   2 3   5 6 7
White Keys: Z X C V B N M Q W E R T Y U I

Octave Controls (bottom-right panel):
- [-] button: Lower octave
- [+] button: Higher octave  
- Display shows current base octave
```

### Synthesis Parameters

#### Oscillator
- **Waveforms**: Sine, Square, Sawtooth, Triangle with visual display
- **Polyphony**: Up to 32 simultaneous voices

#### Envelope (ADSR)
- **Attack**: 0.005s - 2s
- **Decay**: 0.1s - 2s  
- **Sustain**: 0% - 100%
- **Release**: 0.3s - 5s

#### Filter
- **Frequency**: 20Hz - 20kHz
- **Type**: Lowpass filter

#### Effects
- **Chorus**: Frequency modulation with mix control
- **Delay**: Echo effect with time, feedback, and mix
- **Reverb**: Spatial reverb with mix control

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run type-check   # TypeScript type checking

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

### Tech Stack

- **React 18** - UI framework with hooks
- **TypeScript 5** - Type-safe development  
- **Tone.js 14** - Web Audio synthesis
- **Vite 5** - Fast build tool and dev server

## 🎨 Design Philosophy

### Minimalist Interface
- Clean, uncluttered layout
- Essential controls only
- Visual feedback where helpful (waveform display)
- Unobtrusive secondary controls (octave)

### Keyboard Layout
- **3-octave range** (C2-C5): Balanced coverage without overwhelming
- **Equal margins**: Visual balance with padding on both sides
- **Clear key mapping**: Logical computer keyboard to piano mapping

### Audio-First Approach
- User interaction required for audio initialization (browser compliance)
- Immediate audio feedback
- No unnecessary status messages or notifications

## 🐛 Known Issues

1. **Safari Audio Delay**: Safari may require multiple interactions to start audio
2. **Mobile Performance**: Complex effects may cause latency on older devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Recent Updates

- **Simplified UI**: Reduced to essential "Web Synth" title
- **Optimized keyboard**: 3-octave layout with balanced margins
- **Visual waveforms**: Real-time waveform display in controls
- **Floating octave controls**: Unobtrusive bottom-right placement
- **Audio initialization**: Browser-compliant user interaction requirement

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Tone.js](https://tonejs.github.io/) for the powerful Web Audio framework
- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for the fast build tooling

---

Made with ♪ by [HatakeyamaOsamu](https://github.com/HatakeyamaOsamu)