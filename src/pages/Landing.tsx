import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-background text-primary selection:bg-secondary/30 selection:text-primary min-h-screen">
      {/* TOP MARQUEE BANNER */}
      <div className="w-full bg-primary py-2.5 overflow-hidden relative z-50 border-b border-black/10">
        <div className="marquee-content flex gap-12 items-center text-white/90 font-label-caps text-[11px] tracking-[0.2em] uppercase whitespace-nowrap">
          <MarqueeItems />
          <MarqueeItems /> {/* Duplicate for infinite scroll */}
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-3xl font-headline-xl font-bold text-primary leading-none">Make Me Revise</span>
              <span className="text-[9px] font-label-caps text-on-surface-variant tracking-[0.3em] uppercase mt-1">
                Revise Smart, Score Higher
              </span>
            </div>
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm" href="#">
              What's inside
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm" href="#">
              The story
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <button className="text-primary font-semibold text-sm hover:opacity-70 transition-opacity">Log in</button>
            <button className="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all">
              Start free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden paper-texture py-20">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute inset-0 notebook-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-3 bg-white border border-outline-variant/40 px-5 py-2 rounded-full shadow-sm mb-10 transform -rotate-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-primary/80">
                  Built by students, for the next A* cohort
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-headline-xl text-primary leading-[0.9] mb-8">
                The revision app <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-secondary">built for your exams.</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-secondary/20 -z-10"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 20"
                  >
                    <path d="M0,15 Q25,0 50,15 T100,15" fill="none" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-xl mb-12">
                Stop drowning in textbooks. Get AI notes, custom mock papers, and a roadmap tailored to{" "}
                <span className="text-primary font-bold">Edexcel IAL</span> and{" "}
                <span className="text-primary font-bold">Cambridge A-Level</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all group">
                  Start for free
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button className="bg-white border-2 border-primary/5 text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-surface transition-colors shadow-sm">
                  See how it works
                </button>
              </div>
            </div>

            {/* Asymmetrical Floating Elements */}
            <div className="relative hidden lg:block">
              <div className="relative z-20 bg-white p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-outline-variant/20 transform rotate-2 max-w-md mx-auto">
                <div className="w-full h-4 bg-primary/5 rounded-full mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                      <div className="h-2 w-1/3 bg-slate-50 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-headline-md text-primary text-2xl">Topic: Organic Chemistry</p>
                    <p className="font-note-text text-on-surface-variant text-lg mt-2">
                      "Remember to use the specific keywords from the 2026 mark scheme..."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full">
                    AI Analysis Complete
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-4 z-30 bg-secondary p-4 rounded-xl shadow-lg transform -rotate-12 w-48">
                <p className="font-note-text text-primary text-xl leading-none">
                  Don't forget the mock paper tonight! 📚
                </p>
              </div>
              <div className="absolute top-1/2 -left-20 z-10 bg-white p-6 rounded-2xl shadow-xl transform rotate-6 border border-slate-100 max-w-[200px]">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-secondary text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold italic">"Changed my life. I finally understand Physics."</p>
              </div>
              <div className="absolute top-0 left-1/4 washi-tape-amber h-6 w-24 z-30"></div>
              <div className="absolute bottom-1/4 right-0 washi-tape-navy h-6 w-20 z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-24 bg-[#f3f0f7] paper-texture relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-headline-lg text-[#332211]">What's inside</h2>
            <p className="text-on-surface-variant font-body-md mt-4 opacity-70">
              Everything you need. Nothing you don't.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FeatureCard
              icon="📖"
              color="#a855f7"
              title="AI Notes"
              desc="Topic-by-topic notes generated for your exact exam board and unit"
            />
            <FeatureCard
              icon="📝"
              color="#ef4444"
              title="Mock Papers"
              desc="Original exam-style questions with full mark schemes"
            />
            <FeatureCard
              icon="🗺️"
              color="#f97316"
              title="Roadmap"
              desc="A personalised study plan that knows your weak spots"
            />
            <FeatureCard
              icon="🎯"
              color="#10b981"
              title="Exam FAQs"
              desc="The questions that actually come up, answered like a model student"
            />
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="py-20 bg-[#fff9ea] relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-32 w-24 h-8 bg-pink-300/60 rotate-2 z-10 shadow-sm"></div>
        <div className="absolute top-12 left-1/2 translate-x-32 w-24 h-8 bg-purple-300/60 -rotate-3 z-10 shadow-sm"></div>
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="founder-note-clip bg-white p-12 md:p-16 shadow-2xl relative border-l-4 border-amber-400 paper-texture">
            <div className="text-amber-500 text-5xl font-serif mb-8 opacity-40">"</div>
            <div className="space-y-6 font-note-text text-2xl text-on-surface-variant leading-relaxed">
              <p>
                I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and
                have no idea where to start. I built MakeMeRevise because I needed it — and because no one was making it
                for students like us.
              </p>
              <div className="w-full h-px bg-amber-100 my-8"></div>
              <div className="flex flex-col items-end">
                <p className="text-4xl text-amber-600 italic font-bold">Shabbir</p>
                <p className="text-lg text-on-surface-variant mt-2 opacity-60">— Shabbir, Founder & Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-background paper-texture border-t border-outline-variant/20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-headline-lg text-primary">What students are saying</h2>
            <p className="text-on-surface-variant font-label-caps text-xs tracking-widest uppercase mt-4">
              Verified students from our beta cohort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              bg="#fff9c4"
              border="border-amber-400"
              starColor="text-amber-500"
              initial="FA"
              name="Fatima Al Mansoori"
              sub="Year 13 • Edexcel Biology"
              text="I went from a C to a B in three weeks. The roadmap literally saved my grade."
              rotate="-rotate-1"
            />
            <TestimonialCard
              bg="#e3f2fd"
              border="border-blue-400"
              starColor="text-blue-500"
              initial="KA"
              name="Khalid Al Rashidi"
              sub="Year 13 • Maths & Physics"
              text="The AI feedback is actually smart. It doesn't just say 'wrong', it tells you why."
              rotate="rotate-1"
            />
            <TestimonialCard
              bg="#fce4ec"
              border="border-pink-400"
              starColor="text-pink-500"
              initial="MH"
              name="Mariam Hassan"
              sub="Year 12 • Cambridge Chem"
              text="Best investment for my A-levels. It's so much better than generic revision sites."
              rotate="-rotate-2"
            />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#f8f9fb] paper-texture">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">FAQ</span>
            <h2 className="text-5xl font-headline-xl text-primary mt-2">Quick answers.</h2>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Which exam boards do you support?"
              answer="Currently, we provide full support for Edexcel IAL and Cambridge A-Level specifications. More boards are being added every month!"
              defaultOpen
            />
            <FAQItem
              question="Is the AI marking actually accurate?"
              answer="Our AI is trained exclusively on official mark schemes and examiner reports to ensure precision in keyword detection."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Absolutely. No long-term contracts. You can cancel with a single click in your settings."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-headline-xl text-white mb-8">Stop guessing, start knowing.</h2>
          <p className="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto">
            Join the students securing their university spots today. Built by a student who's been exactly where you
            are.
          </p>
          <button className="bg-secondary text-primary px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
            Start for free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary py-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-headline-md text-3xl text-white font-bold">Make Me Revise</span>
              <p className="text-white/40 text-xs mt-2">
                © 2026 Make Me Revise. Built with pride for the next generation.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest uppercase text-white/60">
              {["Privacy", "Terms", "Support", "Guides"].map((link) => (
                <a key={link} className="hover:text-secondary transition-colors" href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components for cleaner code ---

const MarqueeItems = () => (
  <>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">school</span> Cambridge IGCSE
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">book</span> Edexcel IGCSE
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px] text-secondary">auto_awesome</span> Built for the 2026 spec
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">science</span> Chemistry
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">psychology</span> Biology
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">bolt</span> Physics
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">architecture</span> Mathematics
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">smart_toy</span> AI Mark Schemes
    </span>
  </>
);

const FeatureCard = ({ icon, color, title, desc }: { icon: string; color: string; title: string; desc: string }) => (
  <div
    className="bg-white rounded-[2rem] p-10 border-t-[6px] shadow-sm hover:shadow-xl transition-all group"
    style={{ borderTopColor: color }}
  >
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className="text-2xl font-bold text-[#1e293b] mb-3">{title}</h3>
    <p className="text-on-surface-variant font-body-sm leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ bg, border, starColor, initial, name, sub, text, rotate }: any) => (
  <div className={`p-8 rounded-sm sticky-note ${rotate} border-l-4 ${border}`} style={{ backgroundColor: bg }}>
    <div className={`flex ${starColor} mb-6 scale-75 origin-left`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
    <p className="font-note-text text-xl text-primary mb-8 italic">"{text}"</p>
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${starColor.replace("text", "bg")}`}
      >
        {initial}
      </div>
      <div>
        <p className="font-bold text-xs">{name}</p>
        <p className="text-[10px] opacity-60">{sub}</p>
      </div>
    </div>
  </div>
);

const FAQItem = ({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) => (
  <details
    className="group bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden"
    open={defaultOpen}
  >
    <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
      <span className="font-bold text-primary">{question}</span>
      <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
    </summary>
    <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">{answer}</div>
  </details>
);

export default LandingPage;
