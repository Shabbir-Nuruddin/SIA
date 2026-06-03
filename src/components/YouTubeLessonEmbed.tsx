import { useEffect, useState } from "react";
import { Youtube, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Shared revision-video embed used by both the Notes page and the Roadmap topic
// page, so the same trusted-channel video shows in both places. It asks the
// `youtube-search` edge function for a board-accurate video id, then embeds it.
export default function YouTubeLessonEmbed({
  query, subject, level, exam, videoTopic, topic, searchUrl,
}: {
  query: string; subject: string; level: string; exam: string;
  videoTopic: string; topic: string; searchUrl: string;
}) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setVideoId(null);
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("youtube-search", {
          body: { q: query, subject, level, exam, topic: videoTopic },
        });
        if (cancelled) return;
        if (error || !data?.videoId) { setStatus("error"); return; }
        setVideoId(data.videoId);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [query, subject, level, exam, videoTopic]);

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : null;

  return (
    <div className="glass-card rounded-3xl border border-border/80 bg-background-elevated p-5 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Youtube className="h-4 w-4 text-primary shrink-0" />
          <div className="text-sm font-semibold truncate">Video lesson · {topic}</div>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono uppercase tracking-wider text-primary hover:text-primary/80 shrink-0"
        >
          More on YouTube ↗
        </a>
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black" style={{ paddingTop: "56.25%" }}>
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Finding a video…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 text-sm gap-2 p-4 text-center">
            <AlertTriangle className="h-5 w-5" />
            Couldn't load a video. <a className="underline" href={searchUrl} target="_blank" rel="noopener noreferrer">Search on YouTube</a>
          </div>
        )}
        {status === "ready" && embedUrl && (
          <iframe
            src={embedUrl}
            title={`YouTube revision video for ${topic}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Picked from a trusted revision channel where available. Use as a supplement to the notes above.
      </p>
    </div>
  );
}
