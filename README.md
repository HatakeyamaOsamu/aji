# Musako - Simple Browser Synthesizer

A polyphonic web synthesizer built with React, TypeScript, and Tone.js, featuring real-time audio processing and an intuitive interface.

## 🎹 Features

- **Polyphonic synthesis** with intelligent voice management
- **Multiple oscillator waveforms**: Sine, Square, Sawtooth, Triangle
- **Advanced ADSR envelope** control
- **Multi-mode filter**: Lowpass, Highpass, Bandpass, Notch
- **Professional effects chain**: Chorus, Delay, Reverb
- **Virtual piano keyboard** with touch support
- **Computer keyboard mapping** for live performance
- **Octave shifting** for extended range
- **Audio status monitoring** with user-friendly feedback

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
2. **Click on any piano key** to initialize audio
3. Look for the audio status indicator:
   - 🔊 "音を鳴らすには、鍵盤をクリックしてください" - Click a key to start
   - 🎵 "音声準備完了" - Audio is ready
   - ❌ "音声エラー" - See troubleshooting below

## 🔧 Troubleshooting

### No Sound Issue

If you experience no sound when pressing keys, try these solutions:

#### 1. **Browser Autoplay Policy**
Modern browsers require user interaction before playing audio:
- **Solution**: Click any piano key or press any keyboard key
- The status indicator will show when audio is ready

#### 2. **HTTPS Requirement**
Web Audio API requires a secure connection:
- **Development**: `npm run dev` should serve on `https://localhost:5173`
- **Production**: Ensure your site is served over HTTPS

#### 3. **Browser Compatibility**
- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: May require additional user interaction ⚠️
- **Mobile**: Touch a key to initialize audio 📱

#### 4. **System Audio**
- Check system volume and audio output device
- Ensure browser has permission to play audio
- Try refreshing the page and clicking a key again

#### 5. **Console Debugging**
Open browser developer tools and check for errors:
```javascript
// Check audio context state
console.log('AudioContext state:', Tone.getContext().state);

// Manual audio test
Tone.start().then(() => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C4", "8n");
});
```

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

Base Octave Controls:
- Left Arrow (←): Lower octave
- Right Arrow (→): Higher octave
- Current range displays in the UI
```

### Synthesis Parameters

#### Oscillator
- **Waveforms**: Sine, Square, Sawtooth, Triangle
- **Polyphony**: Up to 32 simultaneous voices

#### Envelope (ADSR)
- **Attack**: 0.005s - 2s
- **Decay**: 0.1s - 2s  
- **Sustain**: 0% - 100%
- **Release**: 0.3s - 5s

#### Filter
- **Frequency**: 20Hz - 20kHz
- **Type**: Lowpass (configurable)

#### Effects
- **Chorus**: Depth and mix control
- **Delay**: Time, feedback, and mix
- **Reverb**: Room size and mix

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

## 🔍 Key Features Explained

### Audio Initialization
The synthesizer uses a **user-interaction-first** approach to comply with browser autoplay policies:

1. Audio context remains suspended until user interaction
2. First key press initializes the audio system
3. Status indicator provides clear feedback
4. Graceful error handling with user-friendly messages

### Voice Management
- Pre-allocated voice pool for optimal performance
- Smart voice stealing when limit is reached
- Real-time parameter updates across all voices

### Browser Compatibility
Tested and optimized for:
- Chrome 90+ ✅
- Firefox 88+ ✅  
- Safari 14+ ⚠️ (may need extra interaction)
- Mobile browsers 📱 (touch-optimized)

## 🐛 Known Issues

1. **Safari Audio Delay**: Safari may require multiple interactions to start audio
2. **Mobile Performance**: Complex effects may cause latency on older devices
3. **Firefox Volume**: Some users report lower volume on Firefox

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Recent Updates

- **Fixed**: Browser autoplay policy compliance
- **Added**: Audio status monitoring and user feedback
- **Improved**: Error handling and user experience
- **Enhanced**: Mobile touch support

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Tone.js](https://tonejs.github.io/) for the powerful Web Audio framework
- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for the fast build tooling

---

**Need Help?** Check the troubleshooting section above or open an issue on GitHub.

Made with ♪ by [HatakeyamaOsamu](https://github.com/HatakeyamaOsamu)