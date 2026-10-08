// sound.js: Meteor Defense audio, generated live with the Web Audio API (no audio files to download).
// Browsers only allow sound after a click, so nothing plays until the player presses Play/Start.
//
// How it is wired (think of it like a mixing desk):
//   effects ──► sfxBus ──┐
//                        ├──► master (mute switch) ──► speakers
//   music   ──► musicBus ┘

let ctx = null;        // the audio engine, created on the first click
let master, sfxBus, musicBus, noiseBuffer, echo;
let musicTimer = null; // schedules the music notes
let pad = [];          // the long background chord voices
let enabled = true;
try { enabled = localStorage.getItem('meteorSound') !== 'off'; } catch { /* storage blocked */ }

function setup() {
  if (ctx) return true;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return false;
  ctx = new AudioEngine();
  master = ctx.createGain(); master.gain.value = enabled ? 1 : 0; master.connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master);
  musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
  // Echo for a spacey feel on the music.
  echo = ctx.createDelay(1); echo.delayTime.value = 0.375;
  const feedback = ctx.createGain(); feedback.gain.value = 0.35;
  echo.connect(feedback); feedback.connect(echo); echo.connect(musicBus);
  // One second of white noise, reused by every explosion.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return true;
}

// A single note: oscillator shape, start/end pitch, length, loudness, where to send it.
function tone(type, freqStart, freqEnd, length, volume, out = sfxBus, when = ctx.currentTime) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, when);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), when + length);
  gain.gain.setValueAtTime(volume, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
  osc.connect(gain); gain.connect(out);
  osc.start(when); osc.stop(when + length + 0.05);
}

function noiseHit(length, volume, cutoffStart, cutoffEnd) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  filter.frequency.setValueAtTime(cutoffStart, now);
  filter.frequency.exponentialRampToValueAtTime(cutoffEnd, now + length);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
  src.connect(filter); filter.connect(gain); gain.connect(sfxBus);
  src.start(now); src.stop(now + length);
}

// ---- music: slow chords + a soft echoing arpeggio ----
const CHORDS = [ // root (Hz) for the pad, then three notes for the arpeggio
  { root: 110.0, arp: [440.0, 523.25, 659.25] },   // A minor
  { root: 87.31, arp: [349.23, 440.0, 523.25] },   // F major
  { root: 130.81, arp: [523.25, 659.25, 783.99] }, // C major
  { root: 98.0, arp: [392.0, 493.88, 587.33] }     // G major
];
const PATTERN = [0, 1, 2, 1, 0, 2, 1, 2];
const STEP = 0.25;            // seconds per arpeggio note
const STEPS_PER_CHORD = 16;   // 4 seconds per chord

function startPad() {
  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 650; filter.Q.value = 4;
  const lfo = ctx.createOscillator(); const lfoDepth = ctx.createGain();
  lfo.frequency.value = 0.08; lfoDepth.gain.value = 280; lfo.connect(lfoDepth); lfoDepth.connect(filter.frequency); lfo.start();
  const padGain = ctx.createGain(); padGain.gain.value = 0.16;
  filter.connect(padGain); padGain.connect(musicBus);
  pad = [1, 1.5, 2].map((ratio, k) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth'; osc.detune.value = k === 1 ? 7 : -5;
    osc.frequency.value = CHORDS[0].root * ratio;
    osc.connect(filter); osc.start();
    return { osc, ratio };
  });
  pad.push({ osc: lfo, ratio: 0 });
}

function startMusic() {
  if (musicTimer) return;
  startPad();
  let step = 0;
  let nextTime = ctx.currentTime + 0.1;
  musicTimer = setInterval(() => {
    while (nextTime < ctx.currentTime + 0.3) { // schedule a little ahead so timing stays smooth
      const chord = CHORDS[Math.floor(step / STEPS_PER_CHORD) % CHORDS.length];
      if (step % STEPS_PER_CHORD === 0) {
        pad.forEach(({ osc, ratio }) => { if (ratio) osc.frequency.setTargetAtTime(chord.root * ratio, nextTime, 0.4); });
      }
      tone('triangle', chord.arp[PATTERN[step % PATTERN.length]], chord.arp[PATTERN[step % PATTERN.length]] * 0.995, 0.32, 0.05, echo, nextTime);
      step += 1;
      nextTime += STEP;
    }
  }, 100);
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(0.5, ctx.currentTime, 0.6);
}

function stopMusic() {
  if (!ctx || !musicTimer) return;
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  clearInterval(musicTimer); musicTimer = null;
  const old = pad; pad = [];
  setTimeout(() => old.forEach(({ osc }) => { try { osc.stop(); } catch { /* already stopped */ } }), 1200);
}

export const sound = {
  get enabled() { return enabled; },
  unlock() { if (setup() && ctx.state === 'suspended') ctx.resume(); },
  setEnabled(on) {
    enabled = on;
    try { localStorage.setItem('meteorSound', on ? 'on' : 'off'); } catch { /* ignore */ }
    if (ctx) master.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.05);
  },
  zap() { if (setup()) tone('square', 880, 180, 0.12, 0.12); },
  boom(size = 0.6) {
    if (!setup()) return;
    noiseHit(0.5 + size * 0.4, 0.5 + size * 0.5, 2200, 90);
    tone('sine', 110, 38, 0.35, 0.6 * size + 0.2);
  },
  shieldHit() {
    if (!setup()) return;
    tone('sawtooth', 170, 55, 0.4, 0.28);
    noiseHit(0.25, 0.25, 900, 120);
  },
  roundStart() {
    if (!setup()) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone('triangle', f, f, 0.14, 0.12, sfxBus, ctx.currentTime + i * 0.08));
  },
  gameOver() {
    if (!setup()) return;
    [392.0, 329.63, 261.63, 196.0].forEach((f, i) => tone('triangle', f, f * 0.98, 0.3, 0.14, sfxBus, ctx.currentTime + i * 0.2));
  },
  music(on) { if (!setup()) return; if (on) startMusic(); else stopMusic(); }
};
