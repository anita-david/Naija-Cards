// Lightweight sound manager using WebAudio for small UI tones.
// No external asset files required.
let ctx = null;
const ensureCtx = () => {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ctx = null;
    }
  }
  return ctx;
};

const playTone = (
  freq = 440,
  duration = 0.12,
  type = "sine",
  gainVal = 0.12
) => {
  const c = ensureCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gainVal;
  o.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  o.start(now);
  g.gain.setValueAtTime(g.gain.value, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  o.stop(now + duration + 0.02);
};

export default {
  play: (name) => {
    try {
      switch (name) {
        case "confetti":
          // quick bright chord
          playTone(880, 0.08, "triangle", 0.06);
          setTimeout(() => playTone(1320, 0.08, "sine", 0.05), 60);
          break;
        case "streak":
          playTone(720, 0.12, "sawtooth", 0.12);
          setTimeout(() => playTone(840, 0.08, "sine", 0.08), 90);
          break;
        case "finish":
          playTone(660, 0.14, "sawtooth", 0.12);
          setTimeout(() => playTone(880, 0.12, "triangle", 0.09), 130);
          setTimeout(() => playTone(1100, 0.08, "sine", 0.06), 260);
          break;
        default:
          playTone(440, 0.08, "sine", 0.06);
      }
    } catch {
      // ignore sound errors
    }
  },
};
