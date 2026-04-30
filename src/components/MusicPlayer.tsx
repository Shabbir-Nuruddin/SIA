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

// Royalty-free MP3s with permissive CORS — verified streamable.
const TRACKS: Track[] = [
  {
    id: "lofi-study",
    title: "Lofi Study Beats",
    vibe: "Chill · Focus",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: "ambient",
    title: "Deep Ambient",
    vibe: "Calm · Long sessions",
    url: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3",
  },
  {
    id: "brown-noise",
    title: "Brown Noise",
    vibe: "No melody · Pure focus",
    url: "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d564.mp3",
  },
  {
    id: "classical",
    title: "Classical for Focus",
    vibe: "Baroque · Study",
    url: "https://cdn.pixabay.com/audio/2024/02/22/audio_f213ddb6b7.mp3",
  },
];

const LS_KEY = "apex-music-state";

interface SavedState {
  open: boolean;
  trackId: string;
  volume: number;
  playing: boolean;
  spotifyUrl: string;
  source: "tracks" | "spotify";
}

const DEFAULT_STATE: SavedState = {
  open: false,
  trackId: TRACKS[0].id,
  volume: 0.5,
  playing: false,
  spotifyUrl: "",
  source: "tracks",
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATE;
}

function saveState(s: SavedState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

// ---- Module-level audio singleton (survives React unmounts) ----
let audioEl: HTMLAudioElement | null = null;
function getAudio(): HTMLAudioElement {
  if (audioEl) return audioEl;
  const a = new Audio();
  a.loop = true;
  a.preload = "auto";
  a.crossOrigin = "anonymous";
  audioEl = a;
  return a;
}

// Subscribers so multiple mounts (or none) stay in sync with audio events.
type Listener = () => void;
const listeners = new Set<Listener>();
function notify() { listeners.forEach(l => l()); }

function toSpotifyEmbed(url: string): string | null {
  const m = url.match(/open\.spotify\.com\/(playlist|album|track|episode|show)\/([a-zA-Z0-9]+)/);
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=apex`;
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

  // Subscribe to module-level audio events so loading/playing reflect reality.
  useEffect(() => {
    const audio = getAudio();
    const onPlay = () => { setLoading(false); };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onError = () => { setLoading(false); update({ playing: false }); };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive the singleton audio from React state.
  useEffect(() => {
    const audio = getAudio();
    audio.volume = muted ? 0 : state.volume;

    if (state.source !== "tracks") {
      audio.pause();
      return;
    }

    const track = TRACKS.find(t => t.id === state.trackId) ?? TRACKS[0];
    if (lastSrcRef.current !== track.url) {
      audio.src = track.url;
      lastSrcRef.current = track.url;
    }

    if (state.playing) {
      setLoading(true);
      audio.play()
        .then(() => setLoading(false))
        .catch(() => { setLoading(false); update({ playing: false }); });
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playing, state.trackId, state.volume, state.source, muted]);

  const hide =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/diagnostic") ||
    pathname.startsWith("/mock-papers/exam");
  if (hide) return null;

  const currentTrack = TRACKS.find(t => t.id === state.trackId) ?? TRACKS[0];
  const spotifyEmbed = state.source === "spotify" ? toSpotifyEmbed(state.spotifyUrl) : null;

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
        <div className="fixed bottom-5 right-20 z-40 w-[320px] max-w-[calc(100vw-2rem)] surface flex flex-col shadow-2xl animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              <div className="text-sm font-bold">Focus Music</div>
            </div>
            <button onClick={() => update({ open: false })} className="text-muted-foreground hover:text-foreground p-1" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex border-b border-border text-xs">
            <button
              onClick={() => update({ source: "tracks" })}
              className={`flex-1 py-2 font-medium transition-colors ${state.source === "tracks" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Built-in
            </button>
            <button
              onClick={() => update({ source: "spotify" })}
              className={`flex-1 py-2 font-medium transition-colors ${state.source === "spotify" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Spotify
            </button>
          </div>

          {state.source === "tracks" && (
            <div className="p-3">
              <div className="space-y-1 mb-3 max-h-[180px] overflow-y-auto">
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
          )}

          {state.source === "spotify" && (
            <div className="p-3 space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Paste Spotify playlist URL</label>
                <input
                  type="url"
                  value={state.spotifyUrl}
                  onChange={e => update({ spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/playlist/…"
                  className="w-full mt-1 h-9 rounded-md bg-background border border-input px-2 text-xs"
                />
              </div>
              {spotifyEmbed ? (
                <iframe
                  title="Spotify player"
                  src={spotifyEmbed}
                  width="100%"
                  height="232"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-md"
                />
              ) : (
                <div className="text-[11px] text-muted-foreground p-3 text-center bg-secondary rounded-md">
                  Paste a Spotify playlist, album or track link to embed it here.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
