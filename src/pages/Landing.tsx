import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import {
  ArrowRight, Map as MapIcon, Zap, FileText, BookOpen,
  CheckCircle2, XCircle, Star, StarHalf
} from "lucide-react";

// Hosted on Unsplash — no upload needed.
const HERO_IMG = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2400&q=80";

const Stars = ({ value = 5 }: { value?: number }) => {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  return (
    <div className="flex gap-0.5 text-amber-400 mb-3">
      {Array.from({ length: full }).map((_, i) => <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />)}
      {half && <StarHalf className="h-3.5 w-3.5" fill="currentColor" />}
    </div>
  );
};

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#2563EB", "#16A34A", "#9333EA", "#F97316", "#D97706", "#DC2626"];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: color }}>
      {initials}
    </div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <ApexLogo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/auth?mode=signup"><Button size="sm" className="btn-primary">Build my plan</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero — full viewport, image with dark overlay */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="A student studying at their desk late at night, laptop open" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.75) 60%, rgba(13,17,23,0.55) 100%)" }} />
        <div className="container relative py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary mb-7 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Built for A-Level students
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.0] mb-6">
              Your exams are coming.<br />
              <span className="text-gradient">Stop guessing what to study.</span><br />
              <span className="text-3xl md:text-5xl text-foreground/90 font-bold">We build your revision plan. You just follow it.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-[560px] mb-9 leading-relaxed">
              Enter your exam dates. Tell us your subjects. Get a day-by-day study roadmap built around
              your syllabus, your weaknesses, and the time you have left. Powered by AI. Backed by science.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="btn-primary h-12 px-7 text-[15px] font-semibold group">
                  Build my revision plan <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition" />
                </Button>
              </Link>
              <a href="#how">
                <Button variant="outline" size="lg" className="h-12 px-7 text-[15px]">See how it works</Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Supports Edexcel · AQA · CIE · IB
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-bold">From signup to your first session in two minutes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Tell us your exams", d: "Enter your subjects, exam board, and exam dates. Takes 2 minutes." },
              { n: "02", t: "We build your roadmap", d: "AI analyses your syllabus, your time, and past paper patterns to create a day-by-day plan." },
              { n: "03", t: "Follow the plan. Improve your grade.", d: "Each day: what to study, how long, with questions and notes built in. No decisions needed." },
            ].map(s => (
              <div key={s.n} className="surface p-6">
                <div className="text-4xl font-extrabold text-gradient opacity-50 font-mono mb-3">{s.n}</div>
                <h3 className="text-lg font-bold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mb-14">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3">What you get</div>
            <h2 className="text-3xl md:text-4xl font-bold">Four tools. One target grade.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: MapIcon, title: "Your Personal Roadmap", desc: "A complete day-by-day plan from today to your exam. Built around your syllabus. Updated based on how you're doing. You never have to wonder what to study next." },
              { icon: Zap, title: "Topical Questions", desc: "Practice questions for every topic, every board. Exam-style format. AI marking with real feedback and model answers — exactly like a real mark scheme." },
              { icon: FileText, title: "Full Mock Papers", desc: "Timed mock papers generated to your spec. AI marks your answers. Shows you your grade, what you got wrong, and what to fix." },
              { icon: BookOpen, title: "Smart Notes", desc: "AI-generated revision notes scoped exactly to your syllabus. Definitions, worked examples, examiner tips. Nothing irrelevant." },
            ].map((f, i) => (
              <div key={i} className="surface surface-hover p-7">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-md mb-4 bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Free to start. Pro when you mean it.</h2>
            <p className="text-muted-foreground text-sm">Honest pricing. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="surface p-7">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-1">Free</div>
              <div className="text-4xl font-extrabold mb-1">£0</div>
              <div className="text-xs text-muted-foreground mb-6">Forever</div>
              <ul className="space-y-2.5 text-sm mb-6">
                {["First 3 days of your roadmap", "10 topical questions per day", "1 mock paper per week", "AI notes for any topic", "Exam countdown timer"].map(x => (
                  <li key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />{x}</li>
                ))}
                {["Full roadmap (all days until exam)", "Unlimited questions", "Unlimited mock papers", "Adaptive roadmap", "AI study assistant"].map(x => (
                  <li key={x} className="flex items-start gap-2 text-muted-foreground"><XCircle className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />{x}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button variant="outline" className="w-full">Start free</Button></Link>
            </div>

            <div className="surface p-7 border-primary/40 relative" style={{ background: "linear-gradient(180deg, hsl(var(--card)), hsl(215 17% 11%))" }}>
              <div className="absolute -top-3 left-7 px-2.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider">Most popular</div>
              <div className="text-xs uppercase tracking-wider text-primary font-mono mb-1">Pro</div>
              <div className="text-4xl font-extrabold mb-1">£8<span className="text-base text-muted-foreground font-medium">/mo</span></div>
              <div className="text-xs text-muted-foreground mb-6">Cancel anytime</div>
              <ul className="space-y-2.5 text-sm mb-6">
                {[
                  "Everything in Free",
                  "Full roadmap for all subjects and all days",
                  "Unlimited topical questions",
                  "Unlimited mock papers",
                  "Roadmap adapts to your performance",
                  "AI study assistant (ask anything)",
                  "Priority support",
                ].map(x => (
                  <li key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />{x}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button className="btn-primary w-full">Start free, upgrade anytime →</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">What our early students are saying</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">From our beta cohort — early access students</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { stars: 5, q: "I never knew where to start with revision. This told me exactly what to do every single day. My mock went from a C to a B in three weeks.", n: "Aisha M.", m: "Year 13 · Edexcel Biology & Chemistry" },
              { stars: 5, q: "The roadmap is the only reason I'm not panicking right now. It broke everything down. I just follow it.", n: "James T.", m: "Year 13 · Edexcel Maths & Physics" },
              { stars: 4.5, q: "The mock paper felt like a real exam. The AI feedback told me exactly why I lost marks. That's genuinely more useful than any mark scheme I've read on my own.", n: "Priya S.", m: "Year 12 · CIE Chemistry" },
              { stars: 5, q: "I used to spend my whole study session deciding what to study. Now I just open the app and there it is. Sounds simple. Changed everything.", n: "Omar H.", m: "Year 13 · AQA Maths" },
              { stars: 4.5, q: "The questions actually feel like real exam questions. Not generic. The feedback is detailed and matches what my teacher says.", n: "Zara L.", m: "Year 13 · Edexcel Biology & Physics" },
              { stars: 5, q: "Every other revision site gives you resources and leaves you alone. This one tells you what to do with them.", n: "Daniel W.", m: "Year 13 · Edexcel Chemistry & Maths" },
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

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop deciding what to study.</h2>
          <p className="text-muted-foreground mb-7">Get a plan in 2 minutes. Free to start.</p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="btn-primary h-12 px-8 text-[15px] font-semibold">
              Build my revision plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <ApexLogo size={24} />
          <p className="text-xs text-muted-foreground">© 2026 Apex · Supports Edexcel, AQA, CIE, IB</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
            <Link to="/auth?mode=signup" className="hover:text-foreground transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
