// Initial synthesizer settings
let synthOptions = {
    oscillator: {
        type: "sawtooth"
    },
    envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
    }
};

// Audio chain
const synths = {};
let masterVolume = null;
let analyser = null;
let isAnyKeyActive = false;

// Initialize audio chain
async function initAudio() {
    masterVolume = new Tone.Volume(-6).toDestination();
    analyser = new Tone.Analyser("waveform", 256);
    masterVolume.connect(analyser);
}

// Get DOM elements
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Waveform selector
document.querySelectorAll('.waveform-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.waveform-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        synthOptions.oscillator.type = button.dataset.waveform;
    });
});

// ADSR controls
const attackSlider = document.getElementById('attack');
const decaySlider = document.getElementById('decay');
const sustainSlider = document.getElementById('sustain');
const releaseSlider = document.getElementById('release');
const volumeSlider = document.getElementById('volume');

attackSlider.addEventListener('input', (e) => {
    synthOptions.envelope.attack = parseFloat(e.target.value);
    document.getElementById('attack-value').textContent = `${e.target.value}s`;
});

decaySlider.addEventListener('input', (e) => {
    synthOptions.envelope.decay = parseFloat(e.target.value);
    document.getElementById('decay-value').textContent = `${e.target.value}s`;
});

sustainSlider.addEventListener('input', (e) => {
    synthOptions.envelope.sustain = parseFloat(e.target.value);
    document.getElementById('sustain-value').textContent = `${Math.round(e.target.value * 100)}%`;
});

releaseSlider.addEventListener('input', (e) => {
    synthOptions.envelope.release = parseFloat(e.target.value);
    document.getElementById('release-value').textContent = `${e.target.value}s`;
});

volumeSlider.addEventListener('input', (e) => {
    const volumePercent = parseInt(e.target.value);
    document.getElementById('volume-value').textContent = `${volumePercent}%`;
    if (masterVolume) {
        // Convert percentage to dB (0% = -60dB, 100% = 0dB)
        const volumeDb = (volumePercent / 100) * 60 - 60;
        masterVolume.volume.value = volumeDb;
    }
});

// Key mapping
const keyToNote = {
    // Lower octave
    'z': 'C3', 's': 'C#3', 'x': 'D3', 'd': 'D#3', 'c': 'E3',
    'v': 'F3', 'g': 'F#3', 'b': 'G3', 'h': 'G#3', 'n': 'A3',
    'j': 'A#3', 'm': 'B3',
    // Upper octave
    'q': 'C4', '2': 'C#4', 'w': 'D4', '3': 'D#4', 'e': 'E4',
    'r': 'F4', '5': 'F#4', 't': 'G4', '6': 'G#4', 'y': 'A4',
    '7': 'A#4', 'u': 'B4', 'i': 'C5'
};

// Start note
async function startNote(key, note) {
    if (synths[key]) return;
    
    if (!masterVolume) {
        await initAudio();
    }
    
    await Tone.start();
    
    const synth = new Tone.Synth(synthOptions);
    synth.connect(masterVolume);
    synth.triggerAttack(note);
    synths[key] = synth;
    
    if (!isAnyKeyActive) {
        isAnyKeyActive = true;
        drawWaveform();
    }
}

// Stop note
function stopNote(key) {
    if (!synths[key]) return;
    
    synths[key].triggerRelease();
    
    setTimeout(() => {
        if (synths[key]) {
            synths[key].dispose();
            delete synths[key];
        }
    }, synthOptions.envelope.release * 1000 + 100);
    
    setTimeout(() => {
        if (Object.keys(synths).length === 0) {
            isAnyKeyActive = false;
        }
    }, synthOptions.envelope.release * 1000 + 100);
}

// Draw waveform
function drawWaveform() {
    if (!isAnyKeyActive) {
        ctx.fillStyle = '#1d1d1f';
        ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        return;
    }
    
    requestAnimationFrame(drawWaveform);
    
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const values = analyser.getValue();
    
    ctx.fillStyle = '#1d1d1f';
    ctx.fillRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < values.length; i++) {
        const x = (i / values.length) * width;
        const y = ((values[i] + 1) / 2) * height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

// Initialize waveform display
ctx.fillStyle = '#1d1d1f';
ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

// Keyboard event handlers
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const note = keyToNote[key];
    
    if (note && !event.repeat) {
        startNote(key, note);
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keyToNote[key]) {
        stopNote(key);
    }
});