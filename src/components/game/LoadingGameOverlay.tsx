import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Gamepad2 } from "lucide-react";
import StudyTycoon from "./StudyTycoon";

/**
 * A top overlay that shows the break game while something is generating
 * (notes, roadmap, onboarding). It pops up over the page after a short delay,
 * has a close (X) button, and AUTO-CLOSES the moment `open` goes false (i.e.
 * generation finished). The game is the persistent Study Tycoon so progress and
 * scores carry over to the break game and leaderboard.
 *
 * Rendered through a PORTAL to <body> — exactly like GameModal — so it never
 * inherits an ancestor's blur/opacity/transform (which previously washed the
 * cards and leaderboard out to grey when opened from inside the page layout).
 */
export default function LoadingGameOverlay({
  open,
  delayMs = 1500,
  note = "This is loading in the background — keep tapping. It'll close itself the moment it's ready.",
}: {
  open: boolean;
  delayMs?: number;
  note?: string;
}) {
  const [show, setShow] = useState(false); // delayed appearance so quick loads don't flash
  const [dismissed, setDismissed] = useState(false); // manual close for this load

  useEffect(() => {
    if (!open) {
      // Loading finished (or never started) → reset so the next load can show again.
      setShow(false);
      setDismissed(false);
      return;
    }
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [open, delayMs]);

  if (!open || !show || dismissed) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm animate-fade-in sm:p-6">
      <div className="relative mt-4 w-full max-w-5xl rounded-2xl border border-border bg-white text-foreground shadow-2xl sm:mt-8">
        <div className="flex items-center justify-between gap-2 rounded-t-2xl border-b border-border bg-white px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Gamepad2 className="h-4 w-4 text-primary" /> SIA Break Arcade
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[82vh] overflow-y-auto rounded-b-2xl bg-white p-4 sm:p-5">
          <div className="mb-4 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 text-center">
            <div className="text-sm font-extrabold text-foreground">⏳ Hang tight — this is loading in the background.</div>
            <div className="mt-1 text-xs text-muted-foreground">
              While you wait, play <b className="text-primary">Study Tycoon</b>: tap the brain to earn marks, buy study tools, and climb the SIA leaderboard.
              This closes itself the moment it's ready. 🎉
            </div>
          </div>
          <StudyTycoon showLeaderboard />
          <p className="mt-3 text-center text-[11px] text-muted-foreground">{note}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
