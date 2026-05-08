import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Maximize2, X } from "lucide-react";

interface Img {
  title: string;
  url: string;
  thumb: string;
  source: string;
  source_page: string;
  attribution: string;
  license: string;
  is_svg?: boolean;
}

interface Props {
  board: "edexcel-ial" | "cie" | string;
  subject: string;
  unit_number: number;
  topic: string;
}

export const TopicImages = ({ board, subject, unit_number, topic }: Props) => {
  const [images, setImages] = useState<Img[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState<Img | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImages(null);
    supabase.functions
      .invoke("topic-images", { body: { board, subject, unit_number, topic } })
      .then(({ data }) => {
        if (cancelled) return;
        setImages(Array.isArray(data?.images) ? data.images : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [board, subject, unit_number, topic]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
        <Loader2 className="h-3 w-3 animate-spin" /> Finding educational diagrams…
      </div>
    );
  }
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2">
        Educational diagrams
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <figure key={i} className="rounded-lg border border-border bg-secondary/20 overflow-hidden group">
            <button
              type="button"
              onClick={() => setZoom(img)}
              className="relative block w-full aspect-video bg-background/60"
            >
              <img
                src={img.thumb}
                alt={img.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
              <span className="absolute top-2 right-2 bg-background/80 backdrop-blur p-1 rounded opacity-0 group-hover:opacity-100 transition">
                <Maximize2 className="h-3 w-3" />
              </span>
            </button>
            <figcaption className="p-2 text-[11px] text-muted-foreground leading-snug">
              <div className="line-clamp-2 text-foreground/80">{img.title}</div>
              <a
                href={img.source_page}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-muted-foreground/70 hover:text-primary"
              >
                {img.attribution} · {img.license}
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6"
          onClick={() => setZoom(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary"
            onClick={() => setZoom(null)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <img
            src={zoom.url}
            alt={zoom.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default TopicImages;
