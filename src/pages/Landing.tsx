import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    getPostAuthRoute(user.id).then((route) => {
      if (!cancelled) navigate(route, { replace: true });
    });
    return () => { cancelled = true; };
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <ApexLogo showTagline />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#inside" className="hover:text-foreground transition">What's inside</a>
            <a href="#founder" className="hover:text-foreground transition">The story</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white border-0 hover:opacity-90">
                Start free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(265 75% 62%) 0%, hsl(325 80% 65%) 45%, hsl(28 95% 62%) 100%)" }}
        />
        {/* Notebook lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(transparent 31px, rgba(255,255,255,0.6) 31px, rgba(255,255,255,0.6) 32px)",
            backgroundSize: "100% 32px",
          }}
        />
        {/* Floating sticker emoji */}
        <div className="absolute top-[12%] left-[6%] text-[110px] opacity-20 rotate-[-12deg] select-none pointer-events-none">📚</div>
        <div className="absolute top-[20%] right-[8%] text-[140px] opacity-15 rotate-[15deg] select-none pointer-events-none">🧪</div>
        <div className="absolute bottom-[18%] left-[12%] text-[120px] opacity-15 rotate-[8deg] select-none pointer-events-none">📐</div>
        <div className="absolute bottom-[14%] right-[14%] text-[130px] opacity-20 rotate-[-18deg] select-none pointer-events-none">🧬</div>

        <div className="container relative py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white mb-8 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Built by a 17-year-old student. For students.
          </div>

          <h1
            className="text-white mb-6 leading-[0.95] drop-shadow-lg"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(3.5rem, 10vw, 8rem)", fontWeight: 700 }}
          >
            The revision app<br />built for your exams.
          </h1>

          <p className="text-lg md:text-2xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            AI notes, mock papers, and a smart study plan — tailored to Edexcel IAL and Cambridge A-Level.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="rounded-full h-14 px-8 text-base font-bold bg-white text-violet-700 hover:bg-white/90 hover:scale-105 transition-transform shadow-xl">
                Start for free <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <a href="#inside">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-2 border-white text-white bg-transparent hover:bg-white/10 hover:scale-105 transition-transform">
                See how it works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section id="inside" className="py-24 bg-gradient-to-b from-background to-amber-50/30 dark:to-violet-950/20">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <div
              className="text-foreground mb-3"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700 }}
            >
              What's inside
            </div>
            <p className="text-muted-foreground text-lg">Everything you need. Nothing you don't.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { e: "📖", t: "AI Notes", d: "Topic-by-topic notes generated for your exact exam board and unit", c: "from-violet-500 to-purple-500" },
              { e: "📝", t: "Mock Papers", d: "Original exam-style questions with full mark schemes", c: "from-pink-500 to-rose-500" },
              { e: "🗺️", t: "Roadmap", d: "A personalised study plan that knows your weak spots", c: "from-amber-500 to-orange-500" },
              { e: "🎯", t: "Exam FAQs", d: "The questions that actually come up, answered like a model student", c: "from-teal-500 to-emerald-500" },
            ].map((f) => (
              <div
                key={f.t}
                className={`relative rounded-2xl bg-card p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-l border-r border-b border-border/50`}
                style={{ borderTopColor: "transparent" }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${f.c}`} />
                <div className="text-5xl mb-4">{f.e}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Patrick Hand', cursive" }}>{f.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section id="founder" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(40 80% 92%) 0%, hsl(28 90% 88%) 100%)" }}>
        {/* Notebook lines */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(transparent 31px, rgba(180, 100, 50, 0.25) 31px, rgba(180, 100, 50, 0.25) 32px)",
            backgroundSize: "100% 32px",
          }}
        />
        {/* Washi tape strips */}
        <div className="absolute top-6 left-1/4 w-32 h-8 bg-pink-400/60 rotate-[-4deg] shadow-md" />
        <div className="absolute top-6 right-1/4 w-32 h-8 bg-violet-400/60 rotate-[3deg] shadow-md" />

        <div className="container max-w-3xl relative">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-10 md:p-14 shadow-2xl relative" style={{
            clipPath: "polygon(0 2%, 4% 0, 12% 1%, 25% 0, 40% 2%, 55% 0, 70% 1%, 85% 0, 100% 2%, 100% 98%, 92% 100%, 78% 99%, 60% 100%, 45% 99%, 28% 100%, 15% 99%, 0 98%)"
          }}>
            <div
              className="text-amber-600/40 leading-none mb-2 select-none"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "8rem" }}
            >
              "
            </div>
            <p
              className="text-foreground text-2xl md:text-3xl leading-relaxed mb-8 -mt-12"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and have no idea where to start. I built MakeMeRevise because I needed it — and because no one was making it for students like us.
            </p>
            <div className="flex items-end justify-end flex-col gap-1 pt-6 border-t border-amber-200">
              <div
                className="text-amber-700"
                style={{ fontFamily: "'Caveat', cursive", fontSize: "3rem", fontWeight: 700, transform: "rotate(-4deg)" }}
              >
                Shabbir
              </div>
              <div className="text-sm text-muted-foreground font-medium">— Shabbir, Founder & Student</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF MARQUEE */}
      <section className="py-8 bg-violet-950 text-white overflow-hidden border-y border-violet-900">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-base md:text-lg font-semibold shrink-0">
              <span>📚 Edexcel IAL</span>
              <span className="text-violet-400">·</span>
              <span>🎓 Cambridge A-Level</span>
              <span className="text-violet-400">·</span>
              <span>📘 IGCSE</span>
              <span className="text-violet-400">·</span>
              <span>✨ Built for the 2025 spec</span>
              <span className="text-violet-400">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(265 60% 18%) 0%, hsl(280 55% 22%) 50%, hsl(160 50% 18%) 100%)" }}>
        <div className="absolute top-10 right-10 text-[180px] opacity-10 rotate-12 select-none">⏰</div>
        <div className="absolute bottom-10 left-10 text-[160px] opacity-10 -rotate-12 select-none">📚</div>
        <div className="container max-w-3xl text-center relative">
          <h2
            className="text-white mb-5 leading-tight"
            style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 700 }}
          >
            Your exams are closer<br />than you think.
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10">
            Start building your study plan today — it takes 2 minutes.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="rounded-full h-16 px-10 text-lg font-bold bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500 text-white border-0 hover:scale-105 transition-transform shadow-2xl">
              Get started free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <ApexLogo size={24} />
          <p className="text-xs text-muted-foreground">© 2026 Make Me Revise · Edexcel IAL & Cambridge A-Level</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap justify-center">
            <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
            <Link to="/refund" className="hover:text-foreground transition">Refunds</Link>
            <Link to="/auth?mode=signup" className="hover:text-foreground transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
