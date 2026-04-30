import { useEffect, useLayoutEffect, useState } from "react";

interface Step {
  selector?: string;          // data-tutorial value to spotlight (omit for centred final step)
  title: string;
  body: string;
  position?: "below" | "above" | "right";
}

const buildSteps = (firstName: string, days: number): Step[] => [
  {
    selector: "countdown-bar",
    title: "Your exam countdown",
    body: "This always shows your nearest exam and how many days you have left. It updates in real time. When it turns red — no more rest days.",
    position: "below",
  },
  {
    selector: "first-session",
    title: "Your daily plan",
    body: "We've built your entire revision schedule. Every session tells you what to study, why, and for how long. You never have to decide — just click Begin.",
    position: "right",
  },
  {
    selector: "begin-button",
    title: "One click starts everything",
    body: "Click Begin and we handle the rest. Notes load automatically. Questions follow. Timer starts. You just focus.",
    position: "below",
  },
  {
    selector: "nav-roadmap",
    title: "Your full revision path",
    body: "The Roadmap shows every topic from today to your exam — in the order you should study them, with science-backed timing. Topics unlock as you complete them.",
    position: "right",
  },
  {
    selector: "pomodoro",
    title: "The Pomodoro Timer",
    body: "25 minutes of focus, 5 minutes rest. Scientifically proven to improve concentration. Starts automatically when you begin a session. Stays visible everywhere on the site.",
    position: "above",
  },
  {
    selector: "nav-notes",
    title: "AI notes for every topic",
    body: "Click any topic in Notes to generate detailed revision notes instantly. Definitions, worked examples, examiner tips — scoped exactly to your board's syllabus.",
    position: "right",
  },
  {
    title: `You're ready, ${firstName}.`,
    body: `Your revision path is built. Your plan is waiting. ${days} days to your exam. Let's get to work.`,
  },
];

interface Rect { top: number; left: number; width: number; height: number; }

const PADDING = 8;

export const TutorialOverlay = ({
  firstName,
  daysToExam,
  onFinish,
}: {
  firstName: string;
  daysToExam: number;
  onFinish: () => void;
}) => {
  const steps = buildSteps(firstName, daysToExam);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const step = steps[index];
  const isFinal = !step.selector;

  useLayoutEffect(() => {
    if (isFinal) { setRect(null); return; }
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tutorial="${step.selector}"]`);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
      // Bring spotlit element into view if needed
      if (r.top < 60 || r.bottom > window.innerHeight - 60) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    measure();
    // re-measure shortly after in case of scroll/animation
    const t1 = setTimeout(measure, 50);
    const t2 = setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step.selector, isFinal]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const next = () => {
    if (index >= steps.length - 1) onFinish();
    else setIndex(i => i + 1);
  };
  const skip = () => onFinish();

  // Compute tooltip position
  const tooltipStyle = (() => {
    const W = 280;
    const M = 12;
    if (isFinal || !rect) {
      return {
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
      } as React.CSSProperties;
    }
    if (step.position === "right") {
      return {
        top: Math.max(60, Math.min(window.innerHeight - 200, rect.top)),
        left: Math.min(window.innerWidth - W - 12, rect.left + rect.width + M),
      };
    }
    if (step.position === "above") {
      return {
        top: Math.max(60, rect.top - 180),
        left: Math.max(12, Math.min(window.innerWidth - W - 12, rect.left + rect.width / 2 - W / 2)),
      };
    }
    // below (default)
    return {
      top: Math.min(window.innerHeight - 200, rect.top + rect.height + M),
      left: Math.max(12, Math.min(window.innerWidth - W - 12, rect.left + rect.width / 2 - W / 2)),
    };
  })();

  return (
    <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      {/* Spotlight overlay using SVG mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={skip}>
        <defs>
          <mask id="tutorial-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx={10}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#tutorial-mask)"
          style={{ transition: "all 250ms ease-out" }}
        />
      </svg>

      {/* Spotlight ring */}
      {rect && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: rect.top, left: rect.left, width: rect.width, height: rect.height,
            borderRadius: 10,
            boxShadow: "0 0 0 2px hsl(var(--primary)), 0 0 0 6px hsl(var(--primary) / 0.25)",
            transition: "all 250ms ease-out",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute pointer-events-auto rounded-[10px] p-5 animate-fade-in"
        style={{
          ...tooltipStyle,
          maxWidth: 280,
          width: "calc(100vw - 24px)",
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--primary))",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        }}
      >
        <div className="text-[11px] font-mono uppercase tracking-widest text-primary mb-2">
          Step {index + 1} of {steps.length}
        </div>
        <h3 className="text-base font-semibold text-foreground leading-snug mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>

        <div className="flex items-center justify-between gap-2 mt-5">
          {!isFinal ? (
            <>
              <button
                onClick={skip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
              >
                Skip tutorial
              </button>
              <button
                onClick={next}
                className="text-sm font-semibold bg-primary text-primary-foreground rounded-md px-4 py-2 hover:opacity-90 transition"
              >
                Next →
              </button>
            </>
          ) : (
            <button
              onClick={onFinish}
              className="w-full text-sm font-semibold bg-primary text-primary-foreground rounded-md px-4 py-2.5 hover:opacity-90 transition"
            >
              Start revising →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
