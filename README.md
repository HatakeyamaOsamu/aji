# Musako - Tone Synth

A powerful web-based synthesizer built with TypeScript and Tone.js.

## Features

- Polyphonic synthesizer (up to 8 voices)
- Multiple waveform types (sine, square, sawtooth, triangle)
- ADSR envelope control
- Multi-mode filter (lowpass, highpass, bandpass, notch)
- Effects chain: Chorus, Delay, and Reverb
- Virtual piano keyboard
- Real-time waveform visualization
- Keyboard support for playing notes

## Tech Stack

- **TypeScript** - Type-safe development
- **Tone.js** - Web Audio framework
- **Vite** - Fast build tool and dev server
- **ES Modules** - Modern module system

## Project Structure

```
src/
├── types/          # TypeScript type definitions
├── synth/          # Synthesizer core (Voice, SynthEngine)
├── effects/        # Audio effects management
├── ui/             # User interface components
├── utils/          # Constants and helper functions
└── main.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HatakeyamaOsamu/musako.git
cd musako
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

Create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## Usage

### Playing Notes

- **Virtual Keyboard**: Click on the piano keys
- **Computer Keyboard**:
  - Lower octave: Z-M keys
  - Upper octave: Q-I keys

### Controls

- **Oscillator**: Select waveform type
- **Envelope**: Adjust Attack, Decay, Sustain, Release
- **Filter**: Choose filter type and adjust cutoff/resonance
- **Effects**: Control Chorus, Delay, and Reverb parameters
- **Master**: Adjust overall volume

## Contributing

1. Create a feature branch
2. Make your changes
3. Create a pull request

## License

MIT