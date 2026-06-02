import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const HERO_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/BEN_6032.jpg";
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";
const SCHOOL_SHORT = import.meta.env.VITE_SCHOOL_SHORT ?? "SIA";

const FEATURES = [
  {
    icon: "📚",
    title: "AI-Powered Notes",
    desc: "Generate comprehensive topic notes aligned to your SIA syllabus — in seconds.",
  },
  {
    icon: "🗺️",
    title: "Personalised Roadmap",
    desc: "Know exactly where you are and what to revise next, every single day.",
  },
  {
    icon: "📝",
    title: "Instant Mock Papers",
    desc: "Practice papers created and marked instantly with detailed AI feedback.",
  },
  {
    icon: "📊",
    title: "Progress Dashboard",
    desc: "Track your revision journey and watch your improvement over time.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main
      style={{
        fontFamily: "'Source Sans 3', 'Inter', sans-serif",
        background: "#F7F7F5",
        color: "#2D2D2D",
        minHeight: "100vh",
      }}
    >
      <SEO
        title={`${SCHOOL_SHORT} Smart Revision — ${SCHOOL_NAME}`}
        description={`The official AI-powered revision platform for ${SCHOOL_NAME} students.`}
        path="/"
      />

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{ background: "rgba(247,247,245,0.92)", borderColor: "#E5E7EB" }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={SIA_LOGO}
              alt="SIA Logo"
              className="h-10 w-10 rounded-full object-contain bg-white shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <div
                className="font-bold text-base leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1B2A4A" }}
              >
                {SCHOOL_NAME}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>
                Smart Revision Platform
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth?role=student")}
              className="hidden sm:inline font-semibold text-sm transition-opacity hover:opacity-70"
              style={{ color: "#1B2A4A" }}
            >
              Student Login
            </button>
            <button
              onClick={() => navigate("/auth?role=teacher")}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "#1B2A4A", color: "#fff" }}
            >
              Staff Login
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="SIA students in class"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(27,42,74,0.90) 0%, rgba(27,42,74,0.70) 60%, rgba(27,42,74,0.50) 100%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 w-full py-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              Exclusively for SIA Students &amp; Staff
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              SIA Smart<br />
              <span style={{ color: "#C9A84C" }}>Revision</span>
            </h1>

            <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
              Powered by AI. Built exclusively for{" "}
              <span className="text-white font-semibold">{SCHOOL_NAME}</span>.
              Your personalised path from study to success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/auth?role=student&mode=signup")}
                className="px-8 py-4 rounded-full text-base font-bold transition-all hover:opacity-90 shadow-xl"
                style={{ background: "#C9A84C", color: "#1B2A4A" }}
              >
                Student Login / Register
              </button>
              <button
                onClick={() => navigate("/auth?role=teacher")}
                className="px-8 py-4 rounded-full text-base font-bold transition-all border-2 hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}
              >
                Staff Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <h2
              className="text-4xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1B2A4A" }}
            >
              Everything you need to excel
            </h2>
            <p className="text-lg" style={{ color: "#6B7280" }}>
              All your revision tools in one place — no site-hopping, no distractions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl border transition-shadow hover:shadow-lg"
                style={{
                  borderColor: "#E5E7EB",
                  background: "#F7F7F5",
                  boxShadow: "0 2px 16px rgba(27,42,74,0.06)",
                }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#1B2A4A" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ───────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#1B2A4A" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <h2
              className="text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              One platform, three roles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎓",
                role: "Students",
                desc: "Access your personalised revision roadmap, generate notes, take mock papers, and track your progress.",
                cta: "Student Login",
                path: "/auth?role=student",
              },
              {
                icon: "👩‍🏫",
                role: "Teachers",
                desc: "Monitor class performance, identify weak topics across your cohort, and spot students who need support.",
                cta: "Teacher Login",
                path: "/auth?role=teacher",
              },
              {
                icon: "👨‍👩‍👧",
                role: "Parents",
                desc: "Stay connected with your child's study activity, mock scores, and progress — all in one dashboard.",
                cta: "Parent Login",
                path: "/auth?role=parent",
              },
            ].map((item) => (
              <div
                key={item.role}
                className="p-8 rounded-2xl flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="text-4xl">{item.icon}</div>
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {item.role}
                </h3>
                <p className="text-sm text-white/70 flex-1 leading-relaxed">{item.desc}</p>
                <button
                  onClick={() => navigate(item.path)}
                  className="mt-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: "#C9A84C", color: "#1B2A4A" }}
                >
                  {item.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ background: "#111827", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img
              src={SIA_LOGO}
              alt="SIA"
              className="h-8 w-8 rounded-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <div className="font-bold text-white text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {SCHOOL_NAME}
              </div>
              <div className="text-xs text-white/40">Internal Revision Platform</div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/40">
              © {SCHOOL_NAME} · Powered by AI · For SIA Students, Teachers &amp; Parents Only
            </p>
          </div>
          <div className="flex flex-col items-end text-xs text-white/40 gap-1">
            <a href="mailto:admissions@sia.ae" className="hover:text-white/70 transition-colors">
              admissions@sia.ae
            </a>
            <span>+971-(06)-519-7000</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
