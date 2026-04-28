import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ApexLogo } from "@/components/ApexLogo";
import { ArrowRight, Brain, Calendar, Flame, Target, Zap, BarChart3 } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <ApexLogo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/auth?mode=signup"><Button size="sm" className="bg-primary hover:bg-primary/90">Start free</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden grid-bg" style={{ background: "var(--gradient-hero)" }}>
        <div className="container relative py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Built for Edexcel A-Level · Summer 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-8 animate-in-up">
              Your exam is <br />
              <span className="text-urgent-gradient">coming.</span><br />
              Be ready.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 animate-in-up" style={{ animationDelay: "0.1s" }}>
              Apex is the AI revision war room for Edexcel A-Level Maths, Biology, Chemistry, and Physics. Real exam-style questions. A roadmap to your target grade. Zero filler.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary text-base h-14 px-8 group">
                  Start your revision plan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base">I already have an account</Button>
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl animate-in-up" style={{ animationDelay: "0.3s" }}>
              {[
                { v: "1.5", l: "avg grade improvement" },
                { v: "45m", l: "daily focus blocks" },
                { v: "4", l: "core subjects" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-extrabold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative countdown ring */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-60">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ring-grad)" strokeWidth="2" strokeDasharray="565" strokeDashoffset="180" strokeLinecap="round" transform="rotate(-90 100 100)" />
              <defs>
                <linearGradient id="ring-grad">
                  <stop stopColor="hsl(244 100% 70%)" />
                  <stop offset="1" stopColor="hsl(36 92% 55%)" />
                </linearGradient>
              </defs>
              <text x="100" y="95" textAnchor="middle" className="font-mono fill-foreground" fontSize="24" fontWeight="800">47</text>
              <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground" fontSize="8">DAYS TO EXAM</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <div className="text-sm text-primary font-mono uppercase tracking-widest mb-4">// The system</div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Four weapons. <br/>One target grade.</h2>
            <p className="text-lg text-muted-foreground">Everything you need to walk into your exam confident. Nothing you don't.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Brain, title: "AI Question Generator", desc: "Original questions in the exact style of real Edexcel papers. Mark allocation, command words, examiner-grade marking — all generated on demand.", accent: "primary" },
              { icon: Calendar, title: "Personalised Roadmap", desc: "A week-by-week plan ranked by urgency. Less time + bigger grade gap = higher priority. Spaced repetition built in.", accent: "accent" },
              { icon: Target, title: "Live Exam Countdowns", desc: "Per-subject countdown rings on your dashboard. Days, hours, minutes — because abstract dates don't motivate.", accent: "urgent" },
              { icon: Flame, title: "Streak + XP Engine", desc: "Daily streaks, weekly XP leaderboards, level progression from Beginner to Exam Ready. Built like Duolingo.", accent: "primary" },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 group hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 transition-transform group-hover:scale-110 ${f.accent === "primary" ? "bg-primary/15 text-primary" : f.accent === "accent" ? "bg-accent/15 text-accent" : "bg-urgent/15 text-urgent"}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-24 border-t border-border/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm text-accent font-mono uppercase tracking-widest mb-4">// 3 steps</div>
            <h2 className="text-4xl md:text-5xl font-extrabold">From sign-up to first session in under 2 minutes.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Tell Apex your exams", d: "Subjects, dates, target grade, current grade. Takes 60 seconds." },
              { n: "02", t: "Get your roadmap", d: "AI builds a week-by-week study plan ordered by your urgency score." },
              { n: "03", t: "Train daily", d: "25-min Pomodoros + AI questions in real exam style. Stack streaks. Rise levels." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-extrabold text-gradient opacity-20 absolute -top-4 -left-2">{s.n}</div>
                <div className="relative pt-12">
                  <h3 className="text-2xl font-bold mb-3">{s.t}</h3>
                  <p className="text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-border/50">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Free to start. <span className="text-gradient">Pro when you mean it.</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-8">
              <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Free</div>
              <div className="text-5xl font-extrabold mb-2">£0</div>
              <div className="text-sm text-muted-foreground mb-8">Forever</div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/>10 AI questions / day</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/>1 subject roadmap</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/>Pomodoro + streak tracking</li>
              </ul>
              <Link to="/auth?mode=signup"><Button variant="outline" className="w-full">Start free</Button></Link>
            </div>
            <div className="glass-card rounded-2xl p-8 border-primary/40 glow-primary relative">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">RECOMMENDED</div>
              <div className="text-sm uppercase tracking-wider text-accent mb-2">Pro</div>
              <div className="text-5xl font-extrabold mb-2">£9<span className="text-xl text-muted-foreground">/mo</span></div>
              <div className="text-sm text-muted-foreground mb-8">Cancel anytime</div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent"/>Unlimited AI questions</li>
                <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent"/>All 4 subjects</li>
                <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent"/>AI Notes generator</li>
                <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-accent"/>Past paper grade boundaries</li>
              </ul>
              <Link to="/auth?mode=signup"><Button className="w-full bg-primary hover:bg-primary/90">Go Pro</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <ApexLogo size={24} />
          <p className="text-sm text-muted-foreground">© 2026 Apex. Built for students who refuse to lose marks.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
