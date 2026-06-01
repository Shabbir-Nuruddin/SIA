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

export const sfx = {
  click: () => tone(380 + Math.random() * 120, 0.07, "triangle", 0.10),
  buy:   () => { tone(523, 0.08, "sine", 0.16); setTimeout(() => tone(784, 0.10, "sine", 0.16), 65); },
  bounce:() => tone(620 + Math.random() * 120, 0.05, "square", 0.08),
  crit:  () => { tone(880, 0.09, "sawtooth", 0.15); setTimeout(() => tone(1320, 0.11, "sawtooth", 0.12), 55); },
  golden:() => { tone(660, 0.09, "sine", 0.16); setTimeout(() => tone(990, 0.1, "sine", 0.16), 70); setTimeout(() => tone(1320, 0.12, "sine", 0.14), 150); },
};

export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem("mmr_game_muted", m ? "1" : "0"); } catch { /* ignore */ }
}
export function isMuted() { return muted; }
