import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const HERO_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/BEN_6032.jpg";

const RED = "#C8102E";
const RED_DARK = "#7A0A1C";

const FEATURES = [
  { icon: "📚", title: "AI-Powered Notes", desc: "Comprehensive topic notes aligned to your SIA syllabus, generated in seconds and saved for revision." },
  { icon: "🗺️", title: "Personalised Roadmap", desc: "Know exactly where you are and what to revise next — a clear path to every exam." },
  { icon: "📝", title: "Instant Mock Papers", desc: "Practice papers created and marked instantly with detailed, exam-board-accurate feedback." },
  { icon: "📊", title: "Progress Tracking", desc: "Watch your improvement over time and see your weak topics turn into strengths." },
];

const ROLES = [
  { icon: "🎓", title: "Students", desc: "Your revision roadmap, AI notes, mock papers and progress — all in one place.", cta: "Student Login", role: "student" },
  { icon: "👩‍🏫", title: "Teachers", desc: "Track class performance, spot weak topics, and support students who need it most.", cta: "Teacher Login", role: "teacher" },
  { icon: "👨‍👩‍👧", title: "Parents", desc: "Follow your child's study activity, mock scores and progress at a glance.", cta: "Parent Login", role: "parent" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ fontFamily: "'Source Sans 3','Inter',sans-serif", background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>
      <SEO
        title="SIA Smart Revision — Scholars International Academy"
        description="The official AI-powered revision platform for Scholars International Academy, Sharjah."
        path="/"
      />

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: "rgba(255,255,255,0.92)", borderColor: "#eee" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-11 w-11 rounded-full object-contain bg-white shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-bold text-base leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
                Scholars International Academy
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>
                Smart Revision Platform
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/auth?role=student")} className="hidden sm:inline font-semibold text-sm hover:opacity-70 transition-opacity" style={{ color: RED_DARK }}>
              Student Login
            </button>
            <button onClick={() => navigate("/auth?role=teacher")} className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: RED }}>
              Staff Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[86vh] flex items-center overflow-hidden">
        <img src={HERO_IMAGE} alt="SIA students" className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(115deg, ${RED_DARK}f2 0%, ${RED_DARK}d9 45%, ${RED}99 100%)` }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Exclusively for SIA · Sharjah
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              SIA Smart<br /><span style={{ color: "#FFD7DD" }}>Revision</span>
            </h1>

            <p className="text-xl text-white/85 mb-3 max-w-xl leading-relaxed">
              Powered by AI. Built exclusively for <span className="text-white font-semibold">Scholars International Academy</span>.
            </p>
            <p className="text-sm text-white/60 mb-10 italic">A High Quality British Education · 50 Years of Progressive Leadership</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate("/auth?role=student")} className="px-8 py-4 rounded-full text-base font-bold transition-all hover:opacity-90 shadow-xl" style={{ background: "#fff", color: RED_DARK }}>
                Student Login
              </button>
              <button onClick={() => navigate("/auth?role=teacher")} className="px-8 py-4 rounded-full text-base font-bold text-white transition-all border-2 hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.6)" }}>
                Staff Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 lg:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
              Everything you need to excel
            </h2>
            <p className="text-lg" style={{ color: "#777" }}>All your revision tools in one place — no distractions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-7 rounded-2xl border transition-all hover:shadow-lg" style={{ borderColor: "#f0e0e2", background: "#fff", borderTop: `4px solid ${RED}` }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: RED_DARK }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#777" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-20" style={{ background: RED_DARK }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>One platform, three roles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((r) => (
              <div key={r.title} className="p-8 rounded-2xl flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <div className="text-4xl">{r.icon}</div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>{r.title}</h3>
                <p className="text-sm text-white/70 flex-1 leading-relaxed">{r.desc}</p>
                <button onClick={() => navigate(`/auth?role=${r.role}`)} className="mt-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-90" style={{ background: "#fff", color: RED_DARK }}>
                  {r.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a1a" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-9 w-9 rounded-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-bold text-white text-sm" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>Scholars International Academy</div>
              <div className="text-xs text-white/40">Internal Revision Platform</div>
            </div>
          </div>
          <p className="text-xs text-white/40 text-center">© Scholars International Academy · Powered by AI · For SIA Students, Teachers &amp; Parents Only</p>
          <div className="flex flex-col items-end text-xs text-white/40 gap-1">
            <a href="mailto:admissions@sia.ae" className="hover:text-white/70 transition-colors">admissions@sia.ae</a>
            <span>+971-(06)-519-7000</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
