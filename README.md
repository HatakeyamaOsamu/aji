# Web Synth

A clean polyphonic web synthesizer built with React, TypeScript, and Tone.js.

## Features

- **Polyphonic synthesis** with real-time waveform display
- **4-octave virtual piano** (C2-C6) with keyboard mapping  
- **Oscillator waveforms**: Sine, Square, Sawtooth, Triangle
- **ADSR envelope** control
- **Filter** with frequency adjustment
- **Effects**: Chorus, Delay, Reverb
- **Minimal interface** with floating octave controls

## Quick Start

```bash
git clone https://github.com/HatakeyamaOsamu/musako.git
cd musako
npm install
npm run dev
```

**First use**: Click any piano key to initialize audio.

## Keyboard Mapping

```
Black Keys:  S D   G H J   2 3   5 6 7
White Keys: Z X C V B N M Q W E R T Y U I
```

Octave controls: Small `[-] [+]` panel in bottom-right corner.

## Browser Requirements

- Modern browser with Web Audio API
- HTTPS connection (required for audio)
- Tested on Chrome, Firefox, Safari

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Audio synthesis hooks  
├── constants/          # Configuration
├── utils/             # Utilities
└── styles/            # CSS styles
```

## Development

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript checking
```

## License

MIT License

---

Made with ♪ by [HatakeyamaOsamu](https://github.com/HatakeyamaOsamu)