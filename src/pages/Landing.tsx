import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView, animate, type Variants } from "framer-motion";
import {
  Users, UsersRound, GraduationCap, School, MapPin, Building2, Globe,
  Bot, Map, FileCheck2, Eye, BarChart3, Smartphone, LineChart, Target, Bell,
  UserPlus, SlidersHorizontal, Sparkles,
  Calculator, Atom, FlaskConical, Dna, TrendingUp, Code, BookOpen,
} from "lucide-react";
import { SEO } from "@/components/SEO";

const SIA_LOGO = "/sia-logo.png";
const CAMPUS_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/sia-building.jpg";
const HERO_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/BEN_6032.jpg"; // fallback if campus photo 404s
const INTRO_SESSION_KEY = "sia-intro-shown";

// ─── Design system ──────────────────────────────────────────────────────────
// Original SIA palette only — red for accents/CTAs, maroon + near-black for
// dark sections, white/cream for light sections. Sections alternate light/dark
// for rhythm rather than one flat background running the whole page.
const RED = "#C8102E";
const RED_DARK = "#7A0A1C";
const NEAR_BLACK = "#1a1a1a";
const CREAM = "#fdf8f8";
const DARK_GRADIENT = `linear-gradient(160deg, ${RED_DARK} 0%, ${NEAR_BLACK} 100%)`;

// Entrance variants — deliberately varied per section (fade / slide / pop /
// flip) rather than one repeated pattern, all tween ease-out, no spring bounce.
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const SCALE_POP: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const SLIDE_LEFT: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const SLIDE_RIGHT: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const FLIP_X: Variants = {
  hidden: { opacity: 0, rotateX: -85 },
  visible: { opacity: 1, rotateX: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const STAGGER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// Shared CTA — every button on the page gets the same hover/tap physics so the
// page feels like one system rather than per-section one-offs.
const CTAButton = ({
  onClick, children, style, className = "",
}: { onClick: () => void; children: ReactNode; style: CSSProperties; className?: string }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.035 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={`px-8 py-4 rounded-full text-base font-bold ${className}`}
    style={style}
  >
    {children}
  </motion.button>
);

// Counts up from 0 once scrolled into view, rather than appearing pre-filled.
const CountUpStat = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span ref={ref} className="text-3xl font-bold text-white whitespace-nowrap" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
        {display.toLocaleString()}{suffix}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-white/55">{label}</span>
    </div>
  );
};

// Simple sequence: logo fades in, the wordmark fades in just below it a beat
// later, both hold together, then the whole overlay (background included)
// fades out as one, revealing the real Hero underneath. No page-turn, no 3D
// transforms — just staggered fade-ins and one shared fade-out.
const LOGO_FADE_IN = 1.3;
const WORDMARK_DELAY = 0.6;
const WORDMARK_FADE_IN = 1.0;
const HOLD_UNTIL = 3.0; // both fully visible and holding until this point
const TOTAL_SECONDS = 4.0;

// One-time full-screen intro. ~4s total, fitting the "4-5 seconds" target.
// sessionStorage in the parent decides whether this mounts at all, so a
// revisit within the same tab session skips it entirely.
const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(onComplete, TOTAL_SECONDS * 1000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: DARK_GRADIENT }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: TOTAL_SECONDS, times: [0, HOLD_UNTIL / TOTAL_SECONDS, 1], ease: "easeInOut" }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
    >
      <motion.img
        src={SIA_LOGO}
        alt=""
        className="h-20 w-20 rounded-full object-contain bg-white shadow-lg mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: LOGO_FADE_IN, ease: "easeInOut" }}
      />
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: WORDMARK_FADE_IN, delay: WORDMARK_DELAY, ease: "easeInOut" }}
      >
        Scholars International Academy
      </motion.p>
    </motion.div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 50, suffix: "+", label: "Years of Excellence" },
  { value: 3500, suffix: "+", label: "Students Enrolled" },
  { value: 10, suffix: "+", label: "AI Revision Tools" },
  { value: 24, suffix: " / 7", label: "Available Anywhere" },
];

const ABOUT_BADGES = [
  { Icon: MapPin, text: "Sharjah, UAE" },
  { Icon: Building2, text: "British Curriculum" },
  { Icon: GraduationCap, text: "GCSE & A-Levels" },
  { Icon: Globe, text: "80+ Nationalities" },
];

const PARENT_STATS = [
  { subject: "Mathematics", score: 78, sessions: 4 },
  { subject: "Chemistry", score: 65, sessions: 3 },
  { subject: "Physics", score: 82, sessions: 2 },
];

// Features grouped by audience, rather than one flat list — the point of the
// page is that all three groups get real value, not just students.
const FEATURE_GROUPS = [
  {
    audience: "For Students",
    Icon: GraduationCap,
    blurb: "Everything you need to revise smarter, not harder.",
    items: [
      { Icon: Bot, title: "AI-Generated Notes", desc: "Comprehensive revision notes for any A-Level topic, aligned to Edexcel, AQA & Cambridge." },
      { Icon: Map, title: "Personalised Roadmap", desc: "A dynamic revision plan that adapts to your exam dates and weak topics." },
      { Icon: FileCheck2, title: "Instant Mock Papers", desc: "Full mock papers marked instantly, to exam-board-accurate standard." },
    ],
  },
  {
    audience: "For Parents",
    Icon: UsersRound,
    blurb: "Stay close to your child's progress, without hovering.",
    items: [
      { Icon: Eye, title: "Live Study Activity", desc: "See sessions, streaks and scores as they happen, in real time." },
      { Icon: BarChart3, title: "Mock Paper Scores", desc: "Subject-by-subject breakdowns of every practice exam, as it's marked." },
      { Icon: Smartphone, title: "No App Required", desc: "Everything works from any browser — nothing to download or install." },
    ],
  },
  {
    audience: "For Teachers & Staff",
    Icon: School,
    blurb: "Spot who needs support before it shows up in results.",
    items: [
      { Icon: LineChart, title: "Class Performance Overview", desc: "Track performance and engagement across your whole class, live." },
      { Icon: Target, title: "Weak-Topic Detection", desc: "See exactly which topics are holding a class or student back." },
      { Icon: Bell, title: "Early Intervention Alerts", desc: "Identify students falling behind before it costs them marks." },
    ],
  },
];

const HOW_IT_WORKS = [
  { step: "01", Icon: UserPlus, title: "Create your account", desc: "Register in under a minute using your school email. Choose your role — Student, Teacher, or Parent." },
  { step: "02", Icon: SlidersHorizontal, title: "Set up your subjects", desc: "Pick your A-Level subjects and exam board. The platform personalises everything to your specific syllabus." },
  { step: "03", Icon: Sparkles, title: "Start revising with AI", desc: "Generate notes, build your roadmap, attempt mock papers, and track your progress all in one place." },
  { step: "04", Icon: UsersRound, title: "Parents & teachers stay informed", desc: "Parents and teachers get a live view of study activity, scores, and progress — no chasing needed." },
];

const SUBJECTS = [
  { Icon: Calculator, name: "Mathematics" },
  { Icon: Atom, name: "Physics" },
  { Icon: FlaskConical, name: "Chemistry" },
  { Icon: Dna, name: "Biology" },
  { Icon: TrendingUp, name: "Economics" },
  { Icon: Code, name: "Computer Science" },
  { Icon: BookOpen, name: "English Literature" },
  { Icon: Globe, name: "Geography" },
];

const ROLES = [
  {
    Icon: GraduationCap,
    title: "Students",
    points: [
      "AI notes for every topic in your syllabus",
      "Personalised revision roadmap & exam countdown",
      "Practice papers generated & marked instantly",
      "Streak tracking & progress milestones",
    ],
    cta: "Student Login",
    role: "student",
  },
  {
    Icon: School,
    title: "Teachers",
    points: [
      "Live class performance overview",
      "Identify weak topics across the group",
      "Monitor individual student engagement",
      "Support struggling students proactively",
    ],
    cta: "Teacher Portal",
    role: "teacher",
  },
  {
    Icon: UsersRound,
    title: "Parents",
    points: [
      "Real-time study activity feed",
      "View mock paper scores & feedback",
      "Track revision streaks & consistency",
      "No app install required — web-based",
    ],
    cta: "Parent Access",
    role: "parent",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

const LandingPage = () => {
  const navigate = useNavigate();

  // Lazy init reads synchronously before first paint, so there's no flash of
  // the overlay on a repeat visit within the same tab session.
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(INTRO_SESSION_KEY) !== "1";
  });

  const dismissIntro = () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    setShowIntro(false);
  };

  return (
    <main style={{ fontFamily: "'Source Sans 3','Inter',sans-serif", background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>
      {/* Rest of the page is always mounted underneath — the overlay just
          covers it, so nothing flashes or jumps once the intro clears. */}
      <AnimatePresence>
        {showIntro && <IntroOverlay key="intro" onComplete={dismissIntro} />}
      </AnimatePresence>

      <SEO
        title="SIA Smart Revision — Scholars International Academy"
        description="The official AI-powered revision platform for Scholars International Academy, Sharjah. Built for students, teachers and parents."
        path="/"
      />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: "rgba(255,255,255,0.95)", borderColor: "#e8d4d7" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-11 w-11 rounded-full object-contain bg-white shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
                Scholars International Academy
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#999" }}>
                Smart Revision Platform
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a href="#features" className="hidden md:inline text-sm font-medium hover:opacity-70 transition-opacity px-3 py-2" style={{ color: "#555" }}>Features</a>
            <a href="#how-it-works" className="hidden md:inline text-sm font-medium hover:opacity-70 transition-opacity px-3 py-2" style={{ color: "#555" }}>How it works</a>
            <a href="#roles" className="hidden md:inline text-sm font-medium hover:opacity-70 transition-opacity px-3 py-2" style={{ color: "#555" }}>Roles</a>
            <button onClick={() => navigate("/auth?role=student")} className="hidden sm:inline font-semibold text-sm px-4 py-2 hover:opacity-70 transition-opacity" style={{ color: RED_DARK }}>
              Sign in
            </button>
            <CTAButton onClick={() => navigate("/auth?mode=signup")} style={{ background: RED, color: "#fff" }} className="!px-5 !py-2 text-sm shadow-sm">
              Get started
            </CTAButton>
          </nav>
        </div>
      </header>

      {/* ── HERO — dark, above the fold: animate on mount, not on scroll ── */}
      <section className="relative overflow-hidden" style={{ background: DARK_GRADIENT }}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full"
          style={{ background: `radial-gradient(closest-side, ${RED}22, transparent 70%)` }} />

        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl mx-auto px-5 md:px-10 pt-28 pb-20 flex flex-col items-center text-center"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Users className="h-3.5 w-3.5" />
            For Students, Parents &amp; Teachers
          </motion.div>

          <motion.h1 variants={FADE_UP} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-7"
            style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
            SIA Smart <em style={{ color: RED, fontStyle: "italic", fontWeight: 500 }}>Revision</em>
          </motion.h1>

          <motion.p variants={FADE_UP} className="text-lg sm:text-xl mb-10 max-w-xl leading-snug font-light text-white/80">
            The official AI-powered revision platform, built for SIA's students, parents, and teachers alike.
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4 mb-16">
            <CTAButton onClick={() => navigate("/auth?mode=signup&role=student")} style={{ background: "#fff", color: RED_DARK }} className="shadow-xl">
              Create student account →
            </CTAButton>
            <CTAButton onClick={() => navigate("/auth?role=teacher")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)" }}>
              Staff / Parent access
            </CTAButton>
          </motion.div>

          {/* Stat strip — stacked with horizontal rules on narrow screens, single
              row with vertical rules from lg up (divide-* only reads correctly
              along one axis, so we switch axis at the breakpoint rather than
              letting it wrap). */}
          <motion.div variants={FADE_UP}
            className="flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x pt-8 border-t w-full justify-center"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            {STATS.map((s) => (
              <div key={s.label} className="py-3 lg:py-0 lg:px-8" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <CountUpStat {...s} />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── ABOUT THE SCHOOL — light, asymmetric slide-in split ── */}
      <section className="py-20 lg:py-28" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div variants={SLIDE_LEFT}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
                style={{ background: "#fce8eb", color: RED_DARK }}>
                About SIA
              </div>
              <h2 className="text-4xl font-bold mb-5" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
                50 years of progressive<br />British education in the UAE
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#555" }}>
                Scholars International Academy has been delivering a high-quality British curriculum in Sharjah
                since its founding. With over 3,500 students from Reception to Year 13, SIA is one of the
                UAE's leading international schools.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#555" }}>
                SIA Smart Revision is built exclusively for SIA students, teachers, and parents — combining
                the school's academic standards with the latest AI to give every family the best possible
                chance in their A-Level examinations.
              </p>
              {/* Inline hairline-divided fact strip, not a bordered icon grid */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t" style={{ borderColor: "#f0d9dc" }}>
                {ABOUT_BADGES.map((b, i) => (
                  <div key={b.text} className={`flex items-center gap-2 text-sm ${i > 0 ? "pl-6 border-l" : ""}`}
                    style={{ color: "#555", borderColor: "#f0d9dc" }}>
                    <b.Icon className="h-4 w-4" style={{ color: RED }} strokeWidth={1.75} />
                    <span className="font-medium">{b.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Offset hairline frame for depth instead of a drop shadow; the
                "50+" stat is overlapping typography on the photo, not a
                separate filled badge card. */}
            <motion.div variants={SLIDE_RIGHT} className="relative">
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl border hidden md:block" style={{ borderColor: RED }} />
              <div className="relative rounded-2xl overflow-hidden" style={{ height: "420px" }}>
                <img
                  src={CAMPUS_IMAGE}
                  alt="SIA campus"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = HERO_IMAGE;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.6))" }} />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-5xl font-bold leading-none" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>50+</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/80 mt-1">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES — dark, grouped by audience rather than one flat list ── */}
      <section id="features" className="py-20 lg:py-28" style={{ background: DARK_GRADIENT }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
              What's Included
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              Everything students, parents &amp; teachers need
            </h2>
            <p className="text-lg max-w-xl mx-auto text-white/60">
              One platform, three experiences. No subscriptions, no paywalls — every feature is unlocked for all SIA members.
            </p>
          </motion.div>

          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {FEATURE_GROUPS.map((group) => (
              <motion.div key={group.audience} variants={FADE_UP}
                whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center gap-3 mb-3" style={{ perspective: 600 }}>
                  <motion.span variants={FLIP_X} className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <group.Icon className="h-5 w-5" style={{ color: RED }} strokeWidth={1.75} />
                  </motion.span>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>{group.audience}</h3>
                </div>
                <p className="text-sm text-white/50 mb-6">{group.blurb}</p>
                <div className="space-y-5">
                  {group.items.map((item, i) => (
                    <div key={item.title} className={`flex items-start gap-3 ${i > 0 ? "pt-5 border-t" : ""}`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <item.Icon className="h-4 w-4 mt-1 shrink-0" style={{ color: RED }} strokeWidth={1.75} />
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                        <p className="text-xs leading-relaxed text-white/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PARENT MONITORING HIGHLIGHT — light, editorial stat block replaces
          the old fake-dashboard mockup card entirely ── */}
      <section className="py-20 lg:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
            <motion.div variants={SLIDE_LEFT}>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
                style={{ background: "#fce8eb", color: RED_DARK }}>
                For Parents
              </div>
              <h2 className="text-4xl font-bold mb-5" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
                Stay close to your<br />child's progress
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#555" }}>
                As a parent you get a dedicated view showing exactly how much your child is revising,
                which subjects they're practising, their mock paper scores, and whether they're keeping
                up their revision streak — all updated in real time.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Live study activity — see sessions as they happen",
                  "Mock paper scores with subject breakdowns",
                  "Streak & consistency tracking day by day",
                  "No app needed — works in any browser",
                  "Completely free — included for all SIA families",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm" style={{ color: "#444" }}>
                    <span className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ background: RED }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <CTAButton onClick={() => navigate("/auth?role=parent")} style={{ background: RED_DARK, color: "#fff" }} className="shadow-lg">
                Parent access →
              </CTAButton>
            </motion.div>

            {/* Editorial "at a glance" stats — large flip-in numbers and a
                hairline progress rule, not a bordered dashboard screenshot. */}
            <motion.div variants={FADE_UP}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#999" }}>
                Ahmed Al-Rashidi · This week's revision
              </div>
              <div className="space-y-7">
                {PARENT_STATS.map((row, i) => (
                  <div key={row.subject} className={i > 0 ? "pt-7 border-t" : ""} style={{ borderColor: "#f0e0e2" }}>
                    <div className="flex items-end justify-between mb-3" style={{ perspective: 500 }}>
                      <span className="text-lg font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>{row.subject}</span>
                      <motion.span variants={FLIP_X} className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED }}>
                        {row.score}<span className="text-lg">%</span>
                      </motion.span>
                    </div>
                    <div className="h-px w-full relative" style={{ background: "#f0e0e2" }}>
                      <div className="h-px absolute left-0 top-0" style={{ width: `${row.score}%`, background: RED }} />
                    </div>
                    <div className="text-xs mt-2" style={{ color: "#999" }}>{row.sessions} sessions this week · avg mock score</div>
                  </div>
                ))}
              </div>
              <div className="mt-9 pt-7 border-t flex items-baseline gap-3" style={{ borderColor: "#f0e0e2" }}>
                <span className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>12</span>
                <span className="text-sm" style={{ color: "#777" }}>day revision streak · last active today at 4:32 PM</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS — dark, hairline-divided columns instead of boxed cards ── */}
      <section id="how-it-works" className="py-20 lg:py-28" style={{ background: DARK_GRADIENT }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
              How it works
            </div>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              Up and running in minutes
            </h2>
          </motion.div>
          {/* Single-axis divide (stacked below lg, single row from lg up) —
              divide-* only reads correctly along one axis, so we switch axis
              at the breakpoint rather than letting a 2-column grid wrap. */}
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
            {HOW_IT_WORKS.map((step) => (
              <motion.div key={step.step} variants={SCALE_POP}
                className="py-8 lg:py-0 lg:px-8 first:pt-0 lg:first:pl-0" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl font-black" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Playfair Display',Georgia,serif" }}>{step.step}</span>
                  <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.15)" }} />
                  <step.Icon className="h-5 w-5 shrink-0" style={{ color: RED }} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SUBJECTS — light, pop-in pills ── */}
      <section className="py-16 lg:py-20" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
              All major A-Level subjects covered
            </h2>
            <p className="text-sm" style={{ color: "#999" }}>Edexcel · AQA · Cambridge International — aligned to your SIA exam board</p>
          </motion.div>
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap justify-center gap-3">
            {SUBJECTS.map((s) => (
              <motion.div key={s.name} variants={SCALE_POP} whileHover={{ scale: 1.05, y: -2 }} transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-2 px-5 py-3 rounded-full border font-semibold text-sm"
                style={{ borderColor: "#f0e0e2", background: "#fff", color: RED_DARK }}>
                <s.Icon className="h-4 w-4" strokeWidth={1.75} />
                {s.name}
              </motion.div>
            ))}
            <div className="flex items-center gap-2 px-5 py-3 rounded-full border font-semibold text-sm"
              style={{ borderColor: "#f0e0e2", background: "#fff", color: "#999" }}>
              + more
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── THREE ROLES — dark, hairline-divided columns instead of boxed cards ── */}
      <section id="roles" className="py-20 lg:py-28" style={{ background: RED_DARK }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <motion.div variants={FADE_UP} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              One platform
            </div>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              Built for the whole school community
            </h2>
            <p className="text-white/60 mt-3 max-w-lg mx-auto">
              Students, teachers and parents each get a role-specific experience — one login, one platform.
            </p>
          </motion.div>
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            {ROLES.map((r) => (
              <motion.div key={r.title} variants={SLIDE_LEFT}
                className="py-10 lg:py-0 lg:px-10 first:pt-0 lg:first:pl-0 flex flex-col gap-5" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <r.Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>{r.title}</h3>
                <ul className="space-y-2 flex-1">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-white/75">
                      <span className="mt-2 shrink-0 h-1 w-1 rounded-full bg-white/50" />
                      {p}
                    </li>
                  ))}
                </ul>
                <CTAButton onClick={() => navigate(`/auth?role=${r.role}`)} style={{ background: "#fff", color: RED_DARK }} className="!py-3 text-sm self-start">
                  {r.cta} →
                </CTAButton>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER — light ── */}
      <section className="py-20 lg:py-28" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
          <motion.div variants={STAGGER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "#fce8eb", color: RED_DARK }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: RED }} />
              Free for every SIA family
            </motion.div>
            <motion.h2 variants={FADE_UP} className="text-5xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
              Ready to start revising smarter?
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-lg mb-10" style={{ color: "#777" }}>
              Join thousands of SIA students, parents and teachers already using AI to prepare for the A-Levels. Set up takes less than 2 minutes.
            </motion.p>
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton onClick={() => navigate("/auth?mode=signup&role=student")} style={{ background: RED, color: "#fff" }} className="shadow-xl">
                Create free student account →
              </CTAButton>
              <CTAButton onClick={() => navigate("/auth?role=parent")} style={{ background: "transparent", color: RED_DARK, border: `2px solid ${RED}` }}>
                Parent / Teacher access
              </CTAButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER — dark, links organised by audience ── */}
      <footer style={{ background: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={SIA_LOGO} alt="SIA" className="h-10 w-10 rounded-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
                    Scholars International Academy
                  </div>
                  <div className="text-xs text-white/40">Internal Revision Platform</div>
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                A High Quality British Education · 50 Years of Progressive Leadership · Sharjah, UAE
              </p>
            </div>

            {/* Students */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">For Students</div>
              <div className="space-y-2">
                <button onClick={() => navigate("/auth?role=student")} className="block text-sm text-white/55 hover:text-white/90 transition-colors text-left">
                  Student Login
                </button>
                <button onClick={() => navigate("/auth?mode=signup&role=student")} className="block text-sm text-white/55 hover:text-white/90 transition-colors text-left">
                  Create Account
                </button>
              </div>
            </div>

            {/* Parents & Staff */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">For Parents &amp; Staff</div>
              <div className="space-y-2">
                <button onClick={() => navigate("/auth?role=parent")} className="block text-sm text-white/55 hover:text-white/90 transition-colors text-left">
                  Parent Access
                </button>
                <button onClick={() => navigate("/auth?role=teacher")} className="block text-sm text-white/55 hover:text-white/90 transition-colors text-left">
                  Teacher Portal
                </button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Contact</div>
              <div className="space-y-2 text-sm text-white/55">
                <a href="mailto:admissions@sia.ae" className="block hover:text-white/90 transition-colors">admissions@sia.ae</a>
                <a href="tel:+97165197000" className="block hover:text-white/90 transition-colors">+971-(06)-519-7000</a>
                <a href="https://sia.ae" target="_blank" rel="noopener noreferrer" className="block hover:text-white/90 transition-colors">sia.ae ↗</a>
                <p className="text-white/30 text-xs pt-2">
                  Scholars International Academy<br />
                  Sharjah, United Arab Emirates
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderColor: "#333" }}>
            <p className="text-xs text-white/30">© {new Date().getFullYear()} Scholars International Academy. For SIA members only.</p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <button onClick={() => navigate("/privacy")} className="hover:text-white/80 transition-colors">Privacy Policy</button>
              <span className="text-white/20">·</span>
              <button onClick={() => navigate("/terms")} className="hover:text-white/80 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
