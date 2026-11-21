// audio.js — tiny WebAudio bleeps, synthesised in code (no audio files,
// no network). Everything is guarded: if the browser has no AudioContext
// the game simply plays silently.

let sharedContext = null;

function audioContext() {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!sharedContext) {
    try {
      sharedContext = new window.AudioContext();
    } catch {
      return null;
    }
  }
  if (sharedContext.state === 'suspended') sharedContext.resume().catch(() => {});
  return sharedContext;
}

function tone(freq, start, duration, type, volume) {
  const ctx = audioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playFoundChime() {
  tone(880, 0, 0.14, 'sine', 0.16);
  tone(1318, 0.09, 0.2, 'sine', 0.14);
}

export function playMissBuzz() {
  tone(160, 0, 0.16, 'square', 0.07);
}

export function playLevelFanfare() {
  tone(523, 0, 0.16, 'triangle', 0.16);
  tone(659, 0.13, 0.16, 'triangle', 0.16);
  tone(784, 0.26, 0.16, 'triangle', 0.16);
  tone(1046, 0.39, 0.3, 'triangle', 0.18);
}

export function playHintPing() {
  tone(1174, 0, 0.12, 'sine', 0.1);
  tone(1174, 0.18, 0.12, 'sine', 0.08);
}
