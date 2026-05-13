import React, { useEffect } from "react";

const LandingPage = () => {
  // Ensuring all fonts and material symbols are loaded correctly
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "<https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Inter:wght@400;500;600;700&family=Patrick+Hand&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap>";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="bg-[#fdfcf8] text-[#091426] selection:bg-[#f59e0b]/30 selection:text-[#091426] font-['Inter'] antialiased min-h-screen">
      {/* 
          INTERNAL STYLES: 
          Preserving the exact patterns, animations, and clipping paths 
          from the high-fidelity HTML version.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .marquee-content {
            display: flex;
            width: max-content;
            animation: scroll 40s linear infinite;
        }
        .notebook-pattern {
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 100% 28px;
        }
        .grid-pattern {
            background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
            background-size: 24px 24px;
        }
        .paper-texture {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .founder-note-clip {
            clip-path: polygon(1% 1%, 99% 0%, 100% 98%, 97% 100%, 0% 99%);
        }
        .washi-tape-amber {
            background: rgba(245, 158, 11, 0.4);
            transform: rotate(-2deg);
            box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
        }
        .washi-tape-navy {
            background: rgba(9, 20, 38, 0.2);
            transform: rotate(1deg);
        }
        .sticky-note {
            box-shadow: 5px 5px 15px rgba(0,0,0,0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sticky-note:hover {
            transform: translateY(-8px) rotate(0deg) scale(1.02);
            z-index: 10;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-patrick { font-family: 'Patrick Hand', cursive; }
      `,
        }}
      />

      {/* TOP MARQUEE BANNER: FIXED TO CONTINUOUS ANIMATION */}
      <div className="w-full bg-[#091426] py-2.5 overflow-hidden relative z-50 border-b border-black/10">
        <div className="marquee-content gap-12 text-white/90 text-[11px] font-medium tracking-[0.2em] uppercase items-center whitespace-nowrap">
          <MarqueeContent />
          <MarqueeContent /> {/* Second set ensures the loop is seamless */}
          <MarqueeContent /> {/* Third set covers ultra-wide screens */}
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#fdfcf8]/80 backdrop-blur-md border-b border-[#c5c6cd]/30">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-3xl font-caveat font-bold text-[#091426] leading-none">Make Me Revise</span>
            <span className="text-[9px] tracking-[0.3em] uppercase mt-1 text-[#45474c] font-bold">
              Revise Smart, Score Higher
            </span>
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#inside">
              What's inside
            </a>
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#story">
              The story
            </a>
            <a
              className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm"
              href="#testimonials"
            >
              Reviews
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <button className="text-[#091426] font-semibold text-sm hover:opacity-70 transition-opacity">Log in</button>
            <button className="bg-[#091426] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-[#091426]/20 hover:scale-105 transition-all">
              Start free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden paper-texture py-20">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute inset-0 notebook-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-3 bg-white border border-[#c5c6cd]/40 px-5 py-2 rounded-full shadow-sm mb-10 transform -rotate-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                </span>
                <span className="text-xs font-bold tracking-wide uppercase text-[#091426]/80">
                  Built by students, for the next A* cohort
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-caveat text-[#091426] leading-[0.9] mb-8">
                The revision app <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#f59e0b]">built for your exams.</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#f59e0b]/20 -z-10"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 20"
                  >
                    <path d="M0,15 Q25,0 50,15 T100,15" fill="none" stroke="currentColor" strokeWidth="8"></path>
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[#45474c] font-medium leading-relaxed max-w-xl mb-12">
                Stop drowning in textbooks. Get AI notes, custom mock papers, and a roadmap tailored to{" "}
                <span className="text-[#091426] font-bold">Edexcel IAL</span> and{" "}
                <span className="text-[#091426] font-bold">Cambridge A-Level</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-[#091426] text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all group">
                  Start for free
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button className="bg-white border-2 border-[#091426]/5 text-[#091426] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-colors shadow-sm">
                  See how it works
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4 text-[#45474c]">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <p className="text-sm font-medium">
                  Join <span className="text-[#091426] font-bold">5,000+ students</span> crushing their finals
                </p>
              </div>
            </div>

            {/* FLOATING DECORATIONS */}
            <div className="relative hidden lg:block">
              <div className="relative z-20 bg-white p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-[#c5c6cd]/20 transform rotate-2 max-w-md mx-auto">
                <div className="w-full h-4 bg-[#091426]/5 rounded-full mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b]">
                      <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                      <div className="h-2 w-1/3 bg-slate-50 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-caveat text-[#091426] text-2xl">Topic: Organic Chemistry</p>
                    <p className="font-patrick text-[#45474c] text-lg mt-2">
                      "Remember to use the specific keywords from the 2026 mark scheme..."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="px-4 py-2 bg-[#091426] text-white text-xs font-bold rounded-full">
                    AI Analysis Complete
                  </div>
                </div>
              </div>

              <div className="absolute -top-10 -right-4 z-30 bg-[#f59e0b] p-4 rounded-xl shadow-lg transform -rotate-12 w-48">
                <p className="font-patrick text-[#091426] text-xl leading-none">
                  Don't forget the mock paper tonight! 📚
                </p>
              </div>

              <div className="absolute top-1/2 -left-20 z-10 bg-white p-6 rounded-2xl shadow-xl transform rotate-6 border border-slate-100 max-w-[200px]">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[#f59e0b] text-sm"
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

      {/* WHAT'S INSIDE SECTION */}
      <section id="inside" className="py-24 bg-[#f3f0f7] paper-texture relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-caveat text-[#332211]">What's inside</h2>
            <p className="text-[#45474c] font-medium mt-4 opacity-70">Everything you need. Nothing you don't.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#a855f7] shadow-sm hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6">📖</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">AI Notes</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Topic-by-topic notes generated for your exact exam board and unit, updated for the 2026 syllabus.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#ef4444] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Mock Papers</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Original exam-style questions with full mark schemes that mimic the latest testing patterns.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#f97316] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🗺️</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Roadmap</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                A personalised study plan that tracks your performance and focuses on your weakest areas first.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#10b981] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Exam FAQs</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                The questions that actually come up, answered with the exact keywords required by examiners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION: FIXED WITH 6 STICKY NOTES */}
      <section id="testimonials" className="py-24 bg-[#fdfcf8] paper-texture border-t border-[#c5c6cd]/20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-caveat text-[#091426]">What students are saying</h2>
            <p className="text-[#45474c] text-xs font-bold tracking-widest uppercase mt-4">
              Verified students from our beta cohort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <StickyNote
              color="#fff9c4"
              border="border-amber-400"
              rotate="-rotate-1"
              text="I went from a C to a B in three weeks. The roadmap literally saved my grade."
              author="Fatima Al Mansoori"
              info="Year 13 • Edexcel Biology"
              initials="FA"
              avatar="bg-amber-500"
            />
            <StickyNote
              color="#e3f2fd"
              border="border-blue-400"
              rotate="rotate-1"
              text="The AI feedback is actually smart. It doesn't just say 'wrong', it tells you why."
              author="Khalid Al Rashidi"
              info="Year 13 • Maths & Physics"
              initials="KA"
              avatar="bg-blue-500"
            />
            <StickyNote
              color="#fce4ec"
              border="border-pink-400"
              rotate="-rotate-2"
              text="Best investment for my A-levels. It's so much better than generic revision sites."
              author="Mariam Hassan"
              info="Year 12 • Cambridge Chem"
              initials="MH"
              avatar="bg-pink-500"
            />
            <StickyNote
              color="#e8f5e9"
              border="border-green-400"
              rotate="rotate-2"
              text="The 2026 spec changes were scary, but the AI notes here are already updated. Absolute lifesaver."
              author="Zainab Omar"
              info="Year 13 • Edexcel Physics"
              initials="ZO"
              avatar="bg-green-600"
            />
            <StickyNote
              color="#fff3e0"
              border="border-orange-400"
              rotate="-rotate-1"
              text="Finally an app that knows the difference between IAL and A-Level. The question banks are perfect."
              author="Ahmed S."
              info="Year 12 • Cambridge Maths"
              initials="AS"
              avatar="bg-orange-500"
            />
            <StickyNote
              color="#f3e5f5"
              border="border-purple-400"
              rotate="rotate-1"
              text="The marking scheme analyzer caught exactly where I was losing marks in organic chemistry."
              author="Sarah Jenkins"
              info="Year 13 • Edexcel Chemistry"
              initials="SJ"
              avatar="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE SECTION */}
      <section id="story" className="py-20 bg-[#fff9ea] relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-32 w-24 h-8 bg-pink-300/60 rotate-2 z-10 shadow-sm"></div>
        <div className="absolute top-12 left-1/2 translate-x-32 w-24 h-8 bg-purple-300/60 -rotate-3 z-10 shadow-sm"></div>

        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="founder-note-clip bg-white p-12 md:p-16 shadow-2xl relative border-l-4 border-amber-400 paper-texture">
            <div className="text-amber-500 text-5xl font-serif mb-8 opacity-40">"</div>
            <div className="space-y-6 font-patrick text-2xl text-[#45474c] leading-relaxed">
              <p>
                I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and
                have no idea where to start. I built MakeMeRevise because I needed it — and because no one was making it
                for students like us.
              </p>
              <div className="w-full h-px bg-amber-100 my-8"></div>
              <div className="flex flex-col items-end">
                <p className="text-4xl text-amber-600 italic font-bold">Shabbir</p>
                <p className="text-lg text-[#45474c] mt-2 opacity-60">— Shabbir, Founder & Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION: ADVANCED & EXPANDED */}
      <section className="py-24 bg-[#f8f9fb] paper-texture">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#f59e0b] font-bold text-xs tracking-widest uppercase">FAQ</span>
            <h2 className="text-5xl font-caveat text-[#091426] mt-2">Quick answers.</h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Are the 2026 Specifications actually supported?"
              answer="Yes. We have already updated our AI models to prioritize the new keyword requirements and practical assessments for the 2026 Edexcel and Cambridge IGCSE/A-Level cohorts."
              isOpen={true}
            />
            <FAQItem
              question="Does the AI marking align with official mark schemes?"
              answer="Absolutely. Unlike generic AI, our engine is trained exclusively on past examiner reports and model answers to ensure you're learning exactly what the examiner looks for."
            />
            <FAQItem
              question="Which subjects do you currently offer?"
              answer="We currently provide full support for Biology, Chemistry, Physics, and Mathematics. Economics and Psychology are currently in development for release later this year."
            />
            <FAQItem
              question="What is the difference between A-Level and IAL support?"
              answer="We have separate content tracks for standard UK A-Levels and International A-Levels (IAL). The units, practicals, and marking styles are mapped specifically to your chosen board."
            />
            <FAQItem
              question="Can I use this for mock exam preparation?"
              answer="Yes! Our 'Mock Paper' feature generates papers that match the weighting and difficulty distribution of a real paper, helping you manage your time effectively."
            />
            <FAQItem
              question="Is there a free version available?"
              answer="You can start for free to explore the roadmap and get your first set of AI notes. Premium access unlocks unlimited mock papers and the advanced marking analyzer."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, there are no long-term contracts. You can manage and cancel your subscription with a single click in your account settings."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-[#091426] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-caveat text-white mb-8">Stop guessing, start knowing.</h2>
          <p className="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto">
            Join the students securing their university spots today. Built by a student who's been exactly where you
            are.
          </p>
          <button className="bg-[#f59e0b] text-[#091426] px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
            Start for free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#091426] py-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-caveat text-3xl text-white font-bold">Make Me Revise</span>
            <p className="text-white/40 text-[10px] mt-2">
              © 2026 Make Me Revise. Built with pride for the next generation.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold tracking-widest uppercase text-white/60">
            <a className="hover:text-[#f59e0b] transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-[#f59e0b] transition-colors" href="#">
              Terms
            </a>
            <a className="hover:text-[#f59e0b] transition-colors" href="#">
              Support
            </a>
            <a className="hover:text-[#f59e0b] transition-colors" href="#">
              Guides
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS TO MAINTAIN CLEAN CODE WITHOUT LOSING DETAIL --- */

const MarqueeContent = () => (
  <>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">school</span> Cambridge IGCSE
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">book</span> Edexcel IGCSE
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px] text-[#f59e0b]">auto_awesome</span> Built for the 2026 spec
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

const StickyNote = ({ color, border, rotate, text, author, info, initials, avatar }) => (
  <div className={`p-8 rounded-sm sticky-note ${rotate} border-l-4 ${border}`} style={{ backgroundColor: color }}>
    <div className="flex text-[#f59e0b] mb-6 scale-75 origin-left">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
    <p className="font-patrick text-xl text-[#091426] mb-8 italic leading-tight">"{text}"</p>
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full ${avatar} text-white flex items-center justify-center text-[10px] font-bold`}
      >
        {initials}
      </div>
      <div>
        <p className="font-bold text-xs">{author}</p>
        <p className="text-[10px] opacity-60 font-bold tracking-tight">{info}</p>
      </div>
    </div>
  </div>
);

const FAQItem = ({ question, answer, isOpen = false }) => (
  <details className="group bg-white rounded-xl border border-[#c5c6cd]/30 shadow-sm overflow-hidden" open={isOpen}>
    <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
      <span className="font-bold text-[#091426]">{question}</span>
      <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
    </summary>
    <div className="px-6 pb-6 text-[#45474c] text-sm leading-relaxed border-t border-slate-50 pt-4">{answer}</div>
  </details>
);

export default LandingPage;
