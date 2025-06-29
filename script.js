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

// Polyphonic voice management
const MAX_VOICES = 8;
let activeVoices = new Map(); // Map<noteKey, voice>
let voiceCount = 0;

// Audio chain components
let masterVolume = null;
let filter = null;
let chorus = null;
let delay = null;
let reverb = null;
let analyser = null;

// Filter settings
let filterSettings = {
    type: "lowpass",
    frequency: 2000,
    Q: 1
};

// Initialize audio chain
async function initAudio() {
    // Create effects chain
    masterVolume = new Tone.Volume(-6).toDestination();
    analyser = new Tone.Analyser("waveform", 256);
    
    // Create effects
    reverb = new Tone.Reverb({
        decay: 2.5,
        preDelay: 0.01,
        wet: 0
    });
    
    delay = new Tone.FeedbackDelay({
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0
    });
    
    chorus = new Tone.Chorus({
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        type: "sine",
        spread: 180,
        wet: 0
    });
    
    filter = new Tone.Filter({
        type: filterSettings.type,
        frequency: filterSettings.frequency,
        Q: filterSettings.Q
    });
    
    // Connect audio chain: synth -> filter -> chorus -> delay -> reverb -> volume -> analyser -> destination
    filter.connect(chorus);
    chorus.connect(delay);
    delay.connect(reverb);
    reverb.connect(masterVolume);
    masterVolume.connect(analyser);
}

// Create a single voice
function createVoice() {
    const synth = new Tone.Synth(synthOptions);
    synth.connect(filter);
    return synth;
}

// Update voice count display
function updateVoiceCount() {
    document.getElementById('voice-count').textContent = voiceCount;
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

// Filter type selector
document.querySelectorAll('.filter-type-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-type-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        filterSettings.type = button.dataset.filter;
        if (filter) {
            filter.type = filterSettings.type;
        }
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
        const volumeDb = (volumePercent / 100) * 60 - 60;
        masterVolume.volume.value = volumeDb;
    }
});

// Filter controls
const filterCutoffSlider = document.getElementById('filter-cutoff');
const filterResonanceSlider = document.getElementById('filter-resonance');

filterCutoffSlider.addEventListener('input', (e) => {
    filterSettings.frequency = parseFloat(e.target.value);
    document.getElementById('filter-cutoff-value').textContent = `${Math.round(e.target.value)}Hz`;
    if (filter) {
        filter.frequency.value = filterSettings.frequency;
    }
});

filterResonanceSlider.addEventListener('input', (e) => {
    filterSettings.Q = parseFloat(e.target.value);
    document.getElementById('filter-resonance-value').textContent = e.target.value;
    if (filter) {
        filter.Q.value = filterSettings.Q;
    }
});

// Chorus controls
const chorusFrequencySlider = document.getElementById('chorus-frequency');
const chorusDepthSlider = document.getElementById('chorus-depth');
const chorusMixSlider = document.getElementById('chorus-mix');

chorusFrequencySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('chorus-frequency-value').textContent = `${value}Hz`;
    if (chorus) {
        chorus.frequency.value = value;
    }
});

chorusDepthSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('chorus-depth-value').textContent = `${Math.round(value * 100)}%`;
    if (chorus) {
        chorus.depth = value;
    }
});

chorusMixSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('chorus-mix-value').textContent = `${Math.round(value * 100)}%`;
    if (chorus) {
        chorus.wet.value = value;
    }
});

// Delay controls
const delayTimeSlider = document.getElementById('delay-time');
const delayFeedbackSlider = document.getElementById('delay-feedback');
const delayMixSlider = document.getElementById('delay-mix');

delayTimeSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('delay-time-value').textContent = `${value}s`;
    if (delay) {
        delay.delayTime.value = value;
    }
});

delayFeedbackSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('delay-feedback-value').textContent = `${Math.round(value * 100)}%`;
    if (delay) {
        delay.feedback.value = value;
    }
});

delayMixSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('delay-mix-value').textContent = `${Math.round(value * 100)}%`;
    if (delay) {
        delay.wet.value = value;
    }
});

// Reverb controls
const reverbSizeSlider = document.getElementById('reverb-size');
const reverbDampeningSlider = document.getElementById('reverb-dampening');
const reverbMixSlider = document.getElementById('reverb-mix');

reverbSizeSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('reverb-size-value').textContent = `${Math.round(value * 100)}%`;
    if (reverb) {
        reverb.decay = 0.5 + value * 9.5; // 0.5s to 10s
    }
});

reverbDampeningSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('reverb-dampening-value').textContent = `${Math.round(value)}Hz`;
    if (reverb) {
        reverb.dampening = value;
    }
});

reverbMixSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    document.getElementById('reverb-mix-value').textContent = `${Math.round(value * 100)}%`;
    if (reverb) {
        reverb.wet.value = value;
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

// Virtual keyboard mapping
const virtualKeyboardNotes = [
    {note: 'C3', isBlack: false, key: 'z'},
    {note: 'C#3', isBlack: true, key: 's'},
    {note: 'D3', isBlack: false, key: 'x'},
    {note: 'D#3', isBlack: true, key: 'd'},
    {note: 'E3', isBlack: false, key: 'c'},
    {note: 'F3', isBlack: false, key: 'v'},
    {note: 'F#3', isBlack: true, key: 'g'},
    {note: 'G3', isBlack: false, key: 'b'},
    {note: 'G#3', isBlack: true, key: 'h'},
    {note: 'A3', isBlack: false, key: 'n'},
    {note: 'A#3', isBlack: true, key: 'j'},
    {note: 'B3', isBlack: false, key: 'm'},
    {note: 'C4', isBlack: false, key: 'q'},
    {note: 'C#4', isBlack: true, key: '2'},
    {note: 'D4', isBlack: false, key: 'w'},
    {note: 'D#4', isBlack: true, key: '3'},
    {note: 'E4', isBlack: false, key: 'e'},
    {note: 'F4', isBlack: false, key: 'r'},
    {note: 'F#4', isBlack: true, key: '5'},
    {note: 'G4', isBlack: false, key: 't'},
    {note: 'G#4', isBlack: true, key: '6'},
    {note: 'A4', isBlack: false, key: 'y'},
    {note: 'A#4', isBlack: true, key: '7'},
    {note: 'B4', isBlack: false, key: 'u'},
    {note: 'C5', isBlack: false, key: 'i'}
];

// Create virtual keyboard
function createVirtualKeyboard() {
    const keyboard = document.getElementById('virtual-keyboard');
    let whiteKeyIndex = 0;
    let currentOctave = null;
    
    // Create a map to track the white key index for each note
    const whiteKeyMap = new Map();
    virtualKeyboardNotes.forEach((noteData) => {
        if (!noteData.isBlack) {
            whiteKeyMap.set(noteData.note, whiteKeyIndex);
            whiteKeyIndex++;
        }
    });
    
    virtualKeyboardNotes.forEach((noteData, index) => {
        const key = document.createElement('div');
        key.className = noteData.isBlack ? 'piano-key black-key' : 'piano-key white-key';
        key.dataset.note = noteData.note;
        key.dataset.key = noteData.key;
        
        // Position keys
        if (noteData.isBlack) {
            // Find the previous white key to position the black key correctly
            let prevWhiteIndex = -1;
            for (let i = index - 1; i >= 0; i--) {
                if (!virtualKeyboardNotes[i].isBlack) {
                    prevWhiteIndex = whiteKeyMap.get(virtualKeyboardNotes[i].note);
                    break;
                }
            }
            
            // Position black key between white keys
            key.style.left = `${(prevWhiteIndex + 0.65) * 40}px`;
        } else {
            const keyIndex = whiteKeyMap.get(noteData.note);
            key.style.left = `${keyIndex * 40}px`;
        }
        
        // Add key label
        const label = document.createElement('span');
        label.className = 'key-label';
        label.textContent = noteData.key.toUpperCase();
        key.appendChild(label);
        
        // Mouse events
        key.addEventListener('mousedown', () => startNoteFromVirtualKeyboard(noteData.note));
        key.addEventListener('mouseup', () => stopNote(noteData.note));
        key.addEventListener('mouseleave', () => stopNote(noteData.note));
        
        // Touch events
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startNoteFromVirtualKeyboard(noteData.note);
        });
        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopNote(noteData.note);
        });
        
        keyboard.appendChild(key);
    });
}

// Start note from virtual keyboard
async function startNoteFromVirtualKeyboard(note) {
    if (!masterVolume) {
        await initAudio();
    }
    await Tone.start();
    startNote(note, note);
    
    // Highlight key
    const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }
}

// Start note (polyphonic)
async function startNote(key, note) {
    if (activeVoices.has(key)) return;
    if (voiceCount >= MAX_VOICES) return;
    
    if (!masterVolume) {
        await initAudio();
    }
    
    await Tone.start();
    
    const voice = createVoice();
    voice.triggerAttack(note);
    activeVoices.set(key, voice);
    voiceCount++;
    updateVoiceCount();
    
    if (voiceCount === 1) {
        drawWaveform();
    }
}

// Stop note
function stopNote(key) {
    const voice = activeVoices.get(key);
    if (!voice) return;
    
    voice.triggerRelease();
    
    // Remove key highlight
    const keyElement = document.querySelector(`.piano-key[data-note="${key}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
    
    setTimeout(() => {
        if (activeVoices.has(key)) {
            const v = activeVoices.get(key);
            v.dispose();
            activeVoices.delete(key);
            voiceCount--;
            updateVoiceCount();
        }
    }, synthOptions.envelope.release * 1000 + 100);
}

// Draw waveform
function drawWaveform() {
    if (voiceCount === 0) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        return;
    }
    
    requestAnimationFrame(drawWaveform);
    
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const values = analyser.getValue();
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.strokeStyle = '#00ff88';
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

// Initialize
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
createVirtualKeyboard();

// Keyboard event handlers
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const note = keyToNote[key];
    
    if (note && !event.repeat) {
        startNote(key, note);
        
        // Highlight virtual keyboard key
        const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
        }
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const note = keyToNote[key];
    
    if (note) {
        stopNote(key);
        
        // Remove highlight from virtual keyboard
        const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
});