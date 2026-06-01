import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Music, Play, Pause, SkipForward, X, Volume2, VolumeX, Loader2 } from "lucide-react";

/**
 * Floating focus-music player.
 *
 * Persistence model
 * -----------------
 * The HTMLAudioElement lives in a *module-level singleton* (created outside React)
 * so playback continues uninterrupted across:
 *   - route changes (React Router navigation)
 *   - tab switches inside the app
 *   - re-mounts of <AppLayout/> (e.g. after auth state changes)
 * Volume / track / open state are mirrored to localStorage so the UI rehydrates
 * on hard reloads.
 */

interface Track {
  id: string;
  title: string;
  vibe: string;
  url: string;
}

// Calm, ambient / solo-piano study tracks only — no jazz, lounge or upbeat tunes
// (those pull focus). Royalty-free, Kevin MacLeod, CC BY (incompetech.com).
// Every URL below was verified to return HTTP 200.
const TRACKS: Track[] = [
  { id: "deliberate",      title: "Deliberate Thought",    vibe: "Calm piano · Long sessions",    url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate%20Thought.mp3" },
  { id: "meditation-01",   title: "Meditation Impromptu",  vibe: "Soft piano · Calm focus",       url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3" },
  { id: "meditation-03",   title: "Reflective Piano",      vibe: "Gentle piano · Reflective",     url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2003.mp3" },
  { id: "healing",         title: "Healing",               vibe: "Soft ambient · Study",          url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Healing.mp3" },
  { id: "anamalie",        title: "Anamalie",              vibe: "Ambient · Gentle",              url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Anamalie.mp3" },
  { id: "calmant",         title: "Calmant",               vibe: "Calm · Low-key",                url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Calmant.mp3" },
  { id: "heartwarming",    title: "Heartwarming",          vibe: "Warm · Background",             url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartwarming.mp3" },
  { id: "wholesome",       title: "Wholesome",             vibe: "Light · Easy focus",            url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wholesome.mp3" },
  { id: "floating-cities", title: "Floating Cities",       vibe: "Atmospheric · Deep work",       url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3" },
  { id: "lightless-dawn",  title: "Lightless Dawn",        vibe: "Ambient · Deep concentration",  url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Lightless%20Dawn.mp3" },
  { id: "ossuary-rest",    title: "Rest",                  vibe: "Slow ambient · Wind-down",      url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ossuary%205%20-%20Rest.mp3" },
  { id: "inspired",        title: "Inspired",              vibe: "Smooth · Deep focus",           url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Inspired.mp3" },
  { id: "pamgaea",         title: "Pamgaea",               vibe: "Ambient world · Steady",        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pamgaea.mp3" },
];

const LS_KEY = "apex-music-state";

interface SavedState {
  open: boolean;
  trackId: string;
  volume: number;
  playing: boolean;
}

const DEFAULT_STATE: SavedState = {
  open: false,
  trackId: TRACKS[0].id,
  volume: 0.5,
  playing: false,
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // ignore parse errors
  }
  return DEFAULT_STATE;
}

function saveState(s: SavedState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {
    // ignore quota / serialization errors
  }
}

// ---- Module-level audio singleton (survives React unmounts) ----
let audioEl: HTMLAudioElement | null = null;
function getAudio(): HTMLAudioElement {
  if (audioEl) return audioEl;
  const a = new Audio();
  a.loop = true;
  a.preload = "none";
  // Intentionally NOT setting crossOrigin: many royalty-free CDNs do not send
  // CORS headers, and we don't need pixel-level audio access — just playback.
  audioEl = a;
  return a;
}

// Safe play: just set src and play. No CORS dance.
async function safePlay(audio: HTMLAudioElement, url: string): Promise<void> {
  if (audio.src !== url) audio.src = url;
  await audio.play();
}

export const MusicPlayer = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState<SavedState>(() => loadState());
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastSrcRef = useRef<string>("");

  const update = (patch: Partial<SavedState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      saveState(next);
      return next;
    });
  };

  useEffect(() => {
    const audio = getAudio();
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onError = () => { setLoading(false); update({ playing: false }); };
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = getAudio();
    audio.volume = muted ? 0 : state.volume;

    const track = TRACKS.find(t => t.id === state.trackId) ?? TRACKS[0];

    if (state.playing) {
      setLoading(true);
      // Only reload src if track changed
      if (lastSrcRef.current !== track.url) {
        lastSrcRef.current = track.url;
      }
      safePlay(audio, track.url)
        .then(() => setLoading(false))
        .catch((err) => {
          console.warn("[MusicPlayer] play failed:", err?.message || err);
          setLoading(false);
          update({ playing: false });
        });
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playing, state.trackId, state.volume, muted]);

  const hide =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    
    pathname.startsWith("/mock-papers/exam");
  if (hide) return null;

  const currentTrack = TRACKS.find(t => t.id === state.trackId) ?? TRACKS[0];

  const skipTrack = () => {
    const idx = TRACKS.findIndex(t => t.id === state.trackId);
    const next = TRACKS[(idx + 1) % TRACKS.length];
    update({ trackId: next.id, playing: true });
  };

  return (
    <>
      {!state.open && (
        <button
          onClick={() => update({ open: true })}
          data-tutorial="music"
          className="fixed bottom-5 right-20 z-40 h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-secondary border border-border text-foreground hover:scale-105 transition-transform"
          aria-label="Open focus music"
          title="Focus music"
        >
          <Music className={`h-5 w-5 ${state.playing ? "text-primary" : ""}`} />
          {state.playing && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          )}
        </button>
      )}

      {state.open && (
        <div data-tutorial="music" className="fixed bottom-5 right-20 z-40 w-[320px] max-w-[calc(100vw-2rem)] surface flex flex-col shadow-2xl animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              <div className="text-sm font-bold">Focus Music</div>
            </div>
            <button onClick={() => update({ open: false })} className="text-muted-foreground hover:text-foreground p-1" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3">
            <div className="space-y-1 mb-3 max-h-[220px] overflow-y-auto">
              {TRACKS.map(t => {
                const active = t.id === state.trackId;
                return (
                  <button
                    key={t.id}
                    onClick={() => update({ trackId: t.id, playing: true })}
                    className={`w-full text-left p-2 rounded-md text-xs transition-colors ${active ? "bg-primary/15 text-primary" : "hover:bg-secondary text-foreground"}`}
                  >
                    <div className="font-semibold flex items-center gap-2">
                      {t.title}
                      {active && loading && <Loader2 className="h-3 w-3 animate-spin" />}
                      {active && state.playing && !loading && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">{t.vibe}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => update({ playing: !state.playing })}
                className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                aria-label={state.playing ? "Pause" : "Play"}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : state.playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
              </button>
              <button
                onClick={skipTrack}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5 flex-1">
                <button onClick={() => setMuted(m => !m)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle mute">
                  {muted || state.volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={state.volume}
                  onChange={e => update({ volume: parseFloat(e.target.value) })}
                  className="flex-1 accent-primary"
                />
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground mt-2 truncate">
              Now: <span className="text-foreground">{currentTrack.title}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
