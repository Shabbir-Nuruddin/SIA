import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Music, Play, Pause, SkipForward, X, Volume2, VolumeX } from "lucide-react";

/**
 * Floating focus-music player.
 *  - Built-in lofi/ambient/brown-noise tracks (royalty-free, streamable URLs)
 *  - Optional Spotify playlist embed (paste any Spotify playlist URL)
 *  - Persists open/volume/track state across navigation via localStorage
 *  - Hidden during exams
 */

interface Track {
  id: string;
  title: string;
  vibe: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: "lofi-study",
    title: "Lofi Study Beats",
    vibe: "Chill · Focus",
    url: "https://stream.zeno.fm/0r0xa792kwzuv",
  },
  {
    id: "ambient",
    title: "Deep Ambient",
    vibe: "Calm · Long sessions",
    url: "https://stream.zeno.fm/f3wvbbqmdg8uv",
  },
  {
    id: "brown-noise",
    title: "Brown Noise",
    vibe: "No melody · Pure focus",
    url: "https://stream.zeno.fm/n53wq0t2u98uv",
  },
  {
    id: "classical",
    title: "Classical for Focus",
    vibe: "Baroque · Study",
    url: "https://stream.zeno.fm/zr3sfvhntthvv",
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

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { open: false, playing: false, ...JSON.parse(raw) };
  } catch {}
  return { open: false, trackId: TRACKS[0].id, volume: 0.5, playing: false, spotifyUrl: "", source: "tracks" };
}

function saveState(s: SavedState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

function toSpotifyEmbed(url: string): string | null {
  // Convert any spotify URL to embed form
  // playlist: https://open.spotify.com/playlist/{id}?...
  const m = url.match(/open\.spotify\.com\/(playlist|album|track|episode|show)\/([a-zA-Z0-9]+)/);
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=apex`;
}

export const MusicPlayer = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState<SavedState>(() => loadState());
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const update = (patch: Partial<SavedState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      saveState(next);
      return next;
    });
  };

  // Apply playback state to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : state.volume;
    if (state.source === "tracks" && state.playing) {
      audio.play().catch(() => update({ playing: false }));
    } else {
      audio.pause();
    }
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
    update({ trackId: next.id });
  };

  return (
    <>
      {/* Hidden audio element (only for built-in tracks) */}
      <audio ref={audioRef} src={currentTrack.url} loop preload="none" />

      {/* Trigger pill (when collapsed) */}
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

      {/* Expanded panel */}
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

          {/* Source tabs */}
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
              {/* Track list */}
              <div className="space-y-1 mb-3 max-h-[180px] overflow-y-auto">
                {TRACKS.map(t => {
                  const active = t.id === state.trackId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => update({ trackId: t.id, playing: true })}
                      className={`w-full text-left p-2 rounded-md text-xs transition-colors ${active ? "bg-primary/15 text-primary" : "hover:bg-secondary text-foreground"}`}
                    >
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">{t.vibe}</div>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => update({ playing: !state.playing })}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                  aria-label={state.playing ? "Pause" : "Play"}
                >
                  {state.playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
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
