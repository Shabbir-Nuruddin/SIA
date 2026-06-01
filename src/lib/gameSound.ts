// Tiny Web-Audio sound engine for the Break Arcade — generated tones, so there
// are no audio files to host. The AudioContext is created lazily on the first
// click (a user gesture, which browsers require) and reused.

let actx: AudioContext | null = null;
let muted = (() => { try { return localStorage.getItem("mmr_game_muted") === "1"; } catch { return false; } })();

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!actx) {
    try { actx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
  }
  if (actx.state === "suspended") actx.resume().catch(() => {});
  return actx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.14) {
  if (muted) return;
  const c = ctx(); if (!c) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.start(); o.stop(c.currentTime + dur);
  } catch { /* ignore */ }
}

// Loud and punchy — the game is meant to be an over-stimulating distraction.
// Mute button turns it all off.
export const sfx = {
  click: () => tone(380 + Math.random() * 120, 0.09, "triangle", 0.30),
  buy:   () => { tone(523, 0.10, "square", 0.40); setTimeout(() => tone(784, 0.12, "square", 0.40), 70); },
  bounce:() => tone(620 + Math.random() * 160, 0.07, "square", 0.32),
  crit:  () => { tone(880, 0.11, "sawtooth", 0.42); setTimeout(() => tone(1320, 0.13, "sawtooth", 0.36), 55); },
  golden:() => { tone(660, 0.11, "square", 0.42); setTimeout(() => tone(990, 0.12, "square", 0.42), 80); setTimeout(() => tone(1320, 0.14, "square", 0.38), 170); },
};

export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem("mmr_game_muted", m ? "1" : "0"); } catch { /* ignore */ }
}
export function isMuted() { return muted; }
