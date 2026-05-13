import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { ArrowRight, Map as MapIcon, Zap, FileText, BookOpen, Star, StarHalf, ChevronDown } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2400&q=80";

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
      {/* ── Marquee — very top ────────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
        <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
        <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 35s linear infinite" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-semibold tracking-wide shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="Students studying" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg,rgba(10,10,20,0.93) 0%,rgba(10,10,20,0.80) 55%,rgba(10,10,20,0.40) 100%)",
          }}
        />
        <div className="container relative py-24">
          <div className="max-w-2xl">
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
                  background: "linear-gradient(90deg,#f59e0b,#f97316,#ec4899)",
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
                  style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none" }}
                >
                  Build my revision plan <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition" />
                </Button>
              </Link>
              <a href="#how">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-[15px] border-white/40 text-white bg-white/10 hover:bg-white/20"
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

      {/* ── How it works ─────────────────────────────────────────────────── */}
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

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">What you get</div>
            <h2 className="text-3xl md:text-4xl font-bold">Four tools. One target grade.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                emoji: "🗺️",
                title: "Your Personal Roadmap",
                desc: "A complete day-by-day plan from today to your exam. Built around your syllabus. Updated based on how you're doing. You never have to wonder what to study next.",
              },
              {
                emoji: "⚡",
                title: "Topical Questions",
                desc: "Practice questions for every topic, every board. Exam-style format. AI marking with real feedback and model answers — exactly like a real mark scheme.",
              },
              {
                emoji: "📝",
                title: "Full Mock Papers",
                desc: "Timed mock papers generated to your spec. AI marks your answers. Shows you your grade, what you got wrong, and what to fix.",
              },
              {
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

      {/* ── Founder story — Lovable gradient card style ───────────────────── */}
      <section id="story" className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-4xl">
          <div
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%)" }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
              style={{ background: "rgba(255,255,255,0.3)" }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/70 mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-white/40" /> From the founder
              </div>
              <blockquote
                className="text-xl md:text-2xl font-semibold leading-relaxed text-white mb-8"
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
                <div className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-extrabold bg-white/20 text-white border-2 border-white/40">
                  SJ
                </div>
                <div>
                  <div className="font-bold text-white text-lg" style={{ fontFamily: "'Georgia', serif" }}>
                    Shabbir Jethajiwala
                  </div>
                  <div className="text-xs text-white/70">Founder & Student, ApexRevise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
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
                n: "Fatima Al Mansoori",
                m: "Year 13 · Edexcel Biology & Chemistry",
              },
              {
                stars: 5,
                q: "The roadmap is the only reason I'm not panicking right now. It broke everything down. I just follow it.",
                n: "Khalid Al Rashidi",
                m: "Year 13 · Edexcel Maths & Physics",
              },
              {
                stars: 4.5,
                q: "The mock paper felt like a real exam. The AI feedback told me exactly why I lost marks. That's more useful than any mark scheme I've read.",
                n: "Mariam Hassan",
                m: "Year 12 · Cambridge Chemistry",
              },
              {
                stars: 5,
                q: "I used to spend my whole study session deciding what to study. Now I just open the app and there it is. Sounds simple. Changed everything.",
                n: "Omar Al Zaabi",
                m: "Year 13 · Cambridge Maths",
              },
              {
                stars: 4.5,
                q: "The questions actually feel like real exam questions. Not generic. The feedback is detailed and matches what my teacher says.",
                n: "Aisha Mahmoud",
                m: "Year 13 · Edexcel Biology & Physics",
              },
              {
                stars: 5,
                q: "Every other revision site gives you resources and leaves you alone. This one tells you what to do with them.",
                n: "Yousef Al Hamdan",
                m: "Year 13 · Edexcel Chemistry & Maths",
              },
            ].map((t, i) => (
              <div key={i} className="surface p-5">
                <Stars value={t.stars} />
                <p className="text-sm leading-relaxed mb-4">"{t.q}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border">
                  <Avatar name={t.n} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{t.n}</div>
                    <div className="text-[11px] text-muted-foreground">{t.m}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
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
                a: "Your roadmap, notes, mocks and questions are saved to your account so you can pick up on any device.",
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

      {/* ── Final CTA — matches site gradient, not random purple ─────────── */}
      <section
        className="py-24 border-t border-border/50 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a0533 0%,#2d0a4e 40%,#4a1078 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%,#7c3aed 0%,transparent 55%),radial-gradient(circle at 75% 50%,#ec4899 0%,transparent 55%)",
          }}
        />
        <div className="container max-w-3xl text-center relative">
          <div className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">Start today</div>
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-white"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Your exams are closer
            <br />
            than you think.
          </h2>
          <p className="text-white/60 mb-8 text-lg">Start building your study plan today — it takes 2 minutes.</p>
          <Link to="/auth?mode=signup">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold text-white rounded-full"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316,#ec4899)", border: "none" }}
            >
              Get started free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <ApexLogo size={24} />
          <p className="text-xs text-muted-foreground">© 2026 ApexRevise · Edexcel IAL & Cambridge A-Level</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap justify-center">
            <a href="#how" className="hover:text-foreground transition">
              How it works
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
