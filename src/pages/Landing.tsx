import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { detectDefaultCurrency, formatCurrency } from "@/lib/currency";
import {
  ArrowRight,
  Map as MapIcon,
  Zap,
  FileText,
  BookOpen,
  CheckCircle2,
  Star,
  StarHalf,
  ChevronDown,
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2400&q=80";

// ── Marquee items — at the very top of the page ──────────────────────────────
const MARQUEE_ITEMS = [
  "📚 Edexcel IAL",
  "🎓 Cambridge A-Level",
  "📗 Cambridge IGCSE",
  "📘 Edexcel IGCSE",
  "✨ Built for the 2026 spec",
  "🧪 Chemistry",
  "🧬 Biology",
  "⚡ Physics",
  "📐 Mathematics",
  "🎯 AI Mark Schemes",
  "📝 Mock Papers",
  "🗺️ Smart Roadmap",
];

const Stars = ({ value = 5 }: { value?: number }) => {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  return (
    <div className="flex gap-0.5 text-amber-400 mb-3">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
      ))}
      {half && <StarHalf className="h-3.5 w-3.5" fill="currentColor" />}
    </div>
  );
};

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = ["#2563EB", "#16A34A", "#9333EA", "#F97316", "#D97706", "#DC2626"];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
      style={{ background: color }}
    >
      {initials}
    </div>
  );
};

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const currency = useMemo(() => detectDefaultCurrency(), []);
  const priceFree = formatCurrency(0, currency);
  const pricePro = formatCurrency(39.99, currency);
  const priceProAnnual = formatCurrency(299, currency);
  const priceAdvanced = formatCurrency(129.99, currency);
  const pricePromo = formatCurrency(19.99, currency);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    getPostAuthRoute(user.id).then((route) => {
      if (!cancelled) navigate(route, { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Marquee — very top of page ──────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
        <div
          className="flex gap-10 whitespace-nowrap animate-marquee"
          style={{
            animation: "marquee 35s linear infinite",
          }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-semibold tracking-wide shrink-0">
              {item}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Launch promo bar ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-center text-xs md:text-sm font-semibold py-2 px-4">
        🔥 Launch offer — use code{" "}
        <span className="font-mono font-extrabold tracking-wider mx-1 bg-white/20 px-2 py-0.5 rounded">REVISE50</span>{" "}
        for 50% off your first month. First 100 users only.
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <ApexLogo showTagline />
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition">
              How it works
            </a>
            <a href="#features" className="hover:text-foreground transition">
              What's inside
            </a>
            <a href="#story" className="hover:text-foreground transition">
              The story
            </a>
            <a href="#pricing" className="hover:text-foreground transition">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="btn-primary">
                Start free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — real photo, dark overlay, strong text ─────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="Students studying together" className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark gradient overlay — left side darker for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,10,20,0.93) 0%, rgba(10,10,20,0.80) 55%, rgba(10,10,20,0.45) 100%)",
          }}
        />

        <div className="container relative py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white mb-7 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Built by a 17-year-old student. For students.
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-white">
              Study less.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #f97316, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Score higher.
              </span>
            </h1>

            <p className="text-base md:text-xl text-white/80 max-w-[540px] mb-3 leading-relaxed font-medium">
              Stop guessing what to revise.
            </p>
            <p className="text-sm md:text-base text-white/60 max-w-[540px] mb-9 leading-relaxed">
              ApexRevise builds a day-by-day plan from your exam date backwards, sequenced by science, prioritised by
              your weak spots. You just open it and follow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/auth?mode=signup">
                <Button
                  size="lg"
                  className="h-12 px-7 text-[15px] font-semibold group text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    border: "none",
                  }}
                >
                  Build my revision plan <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition" />
                </Button>
              </Link>
              <a href="#how">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-[15px] border-white/30 text-white hover:bg-white/10"
                >
                  See how it works
                </Button>
              </a>
            </div>

            <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
              Edexcel IAL · Cambridge A-Level · IGCSE · 2026 Spec
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section id="how" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-bold">From signup to your first session in two minutes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                t: "Tell us your exams",
                d: "Enter your subjects, exam board, and exam dates. Takes 2 minutes.",
              },
              {
                n: "02",
                t: "We build your roadmap",
                d: "AI analyses your syllabus, your time, and past paper patterns to create a day-by-day plan.",
              },
              {
                n: "03",
                t: "Follow the plan. Improve your grade.",
                d: "Each day: what to study, how long, with questions and notes built in. No decisions needed.",
              },
            ].map((s) => (
              <div key={s.n} className="surface p-6">
                <div className="text-4xl font-extrabold text-primary/40 font-mono mb-3">{s.n}</div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">What you get</div>
            <h2 className="text-3xl md:text-4xl font-bold">Four tools. One target grade.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: MapIcon,
                emoji: "🗺️",
                title: "Your Personal Roadmap",
                desc: "A complete day-by-day plan from today to your exam. Built around your syllabus. Updated based on how you're doing. You never have to wonder what to study next.",
              },
              {
                icon: Zap,
                emoji: "⚡",
                title: "Topical Questions",
                desc: "Practice questions for every topic, every board. Exam-style format. AI marking with real feedback and model answers — exactly like a real mark scheme.",
              },
              {
                icon: FileText,
                emoji: "📝",
                title: "Full Mock Papers",
                desc: "Timed mock papers generated to your spec. AI marks your answers. Shows you your grade, what you got wrong, and what to fix.",
              },
              {
                icon: BookOpen,
                emoji: "📖",
                title: "Smart Notes",
                desc: "AI-generated revision notes scoped exactly to your syllabus. Definitions, worked examples, examiner tips. Nothing irrelevant.",
              },
            ].map((f, i) => (
              <div key={i} className="surface surface-hover p-7">
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Built by a student" story section ──────────────────────────────── */}
      <section id="story" className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-4xl">
          <div
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fcd34d 100%)",
            }}
          >
            {/* Decorative quote marks */}
            <div
              className="absolute top-6 left-8 text-8xl font-serif leading-none pointer-events-none select-none"
              style={{ color: "rgba(180,120,0,0.15)" }}
            >
              "
            </div>
            <div
              className="absolute bottom-6 right-8 text-8xl font-serif leading-none pointer-events-none select-none rotate-180"
              style={{ color: "rgba(180,120,0,0.15)" }}
            >
              "
            </div>

            <div className="relative">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-6">From the founder</div>
              <blockquote
                className="text-xl md:text-2xl font-semibold leading-relaxed text-amber-950 mb-8"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                "I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and
                have no idea where to start. I know the stress, the late nights, the feeling that everyone else has it
                figured out.
                <br />
                <br />I built ApexRevise because I needed it — and because no one was making it for students like us.
                This is for every student who has ever felt overwhelmed. You've got this."
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                >
                  SJ
                </div>
                <div>
                  <div
                    className="text-lg font-bold text-amber-900"
                    style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
                  >
                    Shabbir Jethajiwala
                  </div>
                  <div className="text-xs text-amber-700">Founder & Student, ApexRevise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">What our early students are saying</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              From our beta cohort — early access students
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                stars: 5,
                q: "I never knew where to start with revision. This told me exactly what to do every single day. My mock went from a C to a B in three weeks.",
                n: "Aisha M.",
                m: "Year 13 · Edexcel Biology & Chemistry",
              },
              {
                stars: 5,
                q: "The roadmap is the only reason I'm not panicking right now. It broke everything down. I just follow it.",
                n: "James T.",
                m: "Year 13 · Edexcel Maths & Physics",
              },
              {
                stars: 4.5,
                q: "The mock paper felt like a real exam. The AI feedback told me exactly why I lost marks. That's more useful than any mark scheme I've read on my own.",
                n: "Priya S.",
                m: "Year 12 · Cambridge Chemistry",
              },
              {
                stars: 5,
                q: "I used to spend my whole study session deciding what to study. Now I just open the app and there it is. Sounds simple. Changed everything.",
                n: "Omar H.",
                m: "Year 13 · Cambridge Maths",
              },
              {
                stars: 4.5,
                q: "The questions actually feel like real exam questions. Not generic. The feedback is detailed and matches what my teacher says.",
                n: "Zara L.",
                m: "Year 13 · Edexcel Biology & Physics",
              },
              {
                stars: 5,
                q: "Every other revision site gives you resources and leaves you alone. This one tells you what to do with them.",
                n: "Daniel W.",
                m: "Year 13 · Edexcel Chemistry & Maths",
              },
            ].map((t, i) => (
              <div key={i} className="surface p-5">
                <Stars value={t.stars} />
                <p className="text-sm leading-relaxed mb-4">"{t.q}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border">
                  <Avatar name={t.n} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold">{t.n}</div>
                    <div className="text-[11px] text-muted-foreground">{t.m}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Three plans. One target grade.</h2>
            <p className="text-muted-foreground text-sm">Start free. Upgrade when exam season hits. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {/* Starter */}
            <div className="surface p-7 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-1">Starter</div>
              <div className="text-4xl font-extrabold mb-1">{priceFree}</div>
              <div className="text-xs text-muted-foreground mb-6">Forever free</div>
              <ul className="space-y-2.5 text-sm mb-6 flex-1">
                {[
                  "Roadmap for 1 subject",
                  "10 AI-marked questions / day",
                  "Notes for 3 topics / week",
                  "AI tutor — 5 messages (try it)",
                  "Focus music + Pomodoro",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup">
                <Button variant="outline" className="w-full">
                  Start free
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div
              className="surface p-7 flex flex-col border-primary/60 ring-2 ring-primary/40 relative shadow-2xl md:-translate-y-2"
              style={{ background: "linear-gradient(180deg, hsl(var(--card)), hsl(var(--card-hover)))" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                Most popular
              </div>
              <div className="text-xs uppercase tracking-wider text-primary font-mono mb-1">Pro</div>
              <div className="text-4xl font-extrabold mb-1">
                {pricePro}
                <span className="text-base text-muted-foreground font-medium">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                or {priceProAnnual}/year <span className="text-green-500 font-semibold">· save 38%</span>
              </div>
              <div className="text-xs text-muted-foreground mb-6">Cancel anytime</div>
              <ul className="space-y-2.5 text-sm mb-6 flex-1">
                {[
                  "Everything in Starter",
                  "Photo upload: AI marks handwriting",
                  "Unlimited subjects + roadmap rebuilds",
                  "Unlimited AI-marked questions",
                  "Unlimited mock papers + feedback",
                  "Unlimited notes — every topic",
                  "Multiple exams + urgency timers",
                  "AI tutor — 200 messages / day",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup">
                <Button className="btn-primary w-full">Go Pro</Button>
              </Link>
            </div>

            {/* Advanced */}
            <div className="surface p-7 flex flex-col">
              <div className="text-xs uppercase tracking-wider text-amber-500 font-mono mb-1">Advanced</div>
              <div className="text-4xl font-extrabold mb-1">
                {priceAdvanced}
                <span className="text-base text-muted-foreground font-medium">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground mb-6">For top-grade hunters</div>
              <ul className="space-y-2.5 text-sm mb-6 flex-1">
                {[
                  "Everything in Pro",
                  "Unlimited AI tutor — no caps",
                  "Deep-dive notes with more examples",
                  "Adaptive mocks tuned to weak spots",
                  "Predicted-paper generator",
                  "Full AI exam strategy report",
                  "Early access to new features",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup">
                <Button variant="outline" className="w-full">
                  Go Advanced
                </Button>
              </Link>
            </div>
          </div>

          {/* REVISE50 promo */}
          <div className="mt-8 max-w-2xl mx-auto rounded-2xl border-2 border-dashed border-primary/60 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 p-6 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <div className="text-[11px] uppercase tracking-widest font-mono text-primary font-bold mb-2">
              🔥 Launch offer — first 100 users only
            </div>
            <div className="text-2xl md:text-3xl font-extrabold mb-1">50% off your first month</div>
            <div className="text-sm text-muted-foreground mb-1">
              Use code{" "}
              <span className="font-mono font-extrabold text-primary text-base bg-background/40 px-2 py-0.5 rounded border border-primary/40">
                REVISE50
              </span>{" "}
              at checkout
            </div>
            <div className="text-[11px] text-muted-foreground">First month from {pricePromo} · cancel anytime</div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-t border-border/50">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl md:text-4xl font-bold">Quick answers.</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Which exam boards do you support?",
                a: "Edexcel IAL, Cambridge A-Level, Cambridge IGCSE and Edexcel IGCSE — for Maths, Biology, Chemistry and Physics.",
              },
              {
                q: "How does the free plan work?",
                a: "Start on Starter for free — no card required. You get a roadmap, daily questions, and 3 topic notes per week. Upgrade when you need more.",
              },
              {
                q: "Is the AI marking actually accurate?",
                a: "Yes — it follows the official mark-scheme phrasing for your board, awards mark-by-mark, and tells you exactly where you lost marks.",
              },
              { q: "Can I cancel anytime?", a: "Yes. One click in Settings. No retention questions, no friction." },
              {
                q: "Do you store my work?",
                a: "Your roadmap, notes, mocks and questions are saved to your account so you can pick up where you left off on any device.",
              },
              {
                q: "What's the REVISE50 code?",
                a: "50% off your first month — first 100 users only. Apply it at checkout when upgrading to Pro or Advanced.",
              },
              {
                q: "Which subjects are covered?",
                a: "Maths, Biology, Chemistry and Physics across all supported boards. More subjects coming soon.",
              },
            ].map((f, i) => (
              <div key={i} className="surface rounded-xl overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between gap-3 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section
        className="py-24 border-t border-border/50 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e0a3c 0%, #2d1b69 50%, #1a0a2e 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ec4899 0%, transparent 50%)",
          }}
        />
        <div className="container max-w-3xl text-center relative">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-white"
            style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
          >
            Your exams are closer than you think.
          </h2>
          <p className="text-white/60 mb-8 text-lg">Start building your study plan today — it takes 2 minutes.</p>
          <Link to="/auth?mode=signup">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold text-white rounded-full"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316, #ec4899)",
                border: "none",
              }}
            >
              Get started free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <ApexLogo size={24} />
          <p className="text-xs text-muted-foreground">© 2026 ApexRevise · Supports Edexcel IAL & Cambridge A-Level</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap justify-center">
            <a href="#how" className="hover:text-foreground transition">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition">
              Pricing
            </a>
            <Link to="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
            <Link to="/refund" className="hover:text-foreground transition">
              Refunds
            </Link>
            <Link to="/auth?mode=signup" className="hover:text-foreground transition">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
