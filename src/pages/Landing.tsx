import React, { useEffect } from "react";

const LandingPage = () => {
  // FIX 1: Updated the href to include display=block and variable font parameters
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "<https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Inter:wght@400;500;600;700&family=Patrick+Hand&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block>";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="bg-[#fdfcf8] text-[#091426] selection:bg-[#f59e0b]/30 selection:text-[#091426] font-['Inter'] antialiased min-h-screen">
      {/* 
          INTERNAL STYLES: 
          Fixed the material-symbols-outlined class to prevent icons rendering as text.
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
            animation: scroll 45s linear infinite;
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
        
        /* FIX 2: Explicitly defining the font-family for Material Symbols to stop "arrow_forward" text showing */
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        
        .font-caveat { font-family: 'Caveat', cursive; }
        .font-patrick { font-family: 'Patrick Hand', cursive; }
      `,
        }}
      />

      {/* TOP MARQUEE BANNER */}
      <div className="w-full bg-[#091426] py-2.5 overflow-hidden relative z-50 border-b border-black/10">
        <div className="marquee-content gap-12 text-white/90 text-[11px] font-medium tracking-[0.2em] uppercase items-center whitespace-nowrap">
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#fdfcf8]/80 backdrop-blur-md border-b border-[#c5c6cd]/30">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-3xl font-caveat font-bold text-[#091426] leading-none">Make Me Revise</span>
            <span className="text-[9px] tracking-[0.3em] uppercase mt-1 text-[#45474c] font-bold">
              The Ultimate A-Level Command Center
            </span>
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#inside">
              The System
            </a>
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#story">
              Our Story
            </a>
            <a
              className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm"
              href="#testimonials"
            >
              Community
            </a>
          </nav>
          <div className="flex items-center gap-6">
            <button className="text-[#091426] font-semibold text-sm hover:opacity-70 transition-opacity">Log in</button>
            <button className="bg-[#091426] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-[#091426]/20 hover:scale-105 transition-all">
              Start Scoring
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
                  Stop Site-Hopping. Start Mastering.
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-caveat text-[#091426] leading-[0.9] mb-8">
                Your entire IAL journey <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#f59e0b]">in a single tab.</span>
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
                Exam timers, science-backed Pomodoros, an AI mentor, and automated mock marking. For{" "}
                <span className="text-[#091426] font-bold">Edexcel</span> and{" "}
                <span className="text-[#091426] font-bold">Cambridge</span> students who value their time.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-[#091426] text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all group">
                  Claim your Roadmap
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button className="bg-white border-2 border-[#091426]/5 text-[#091426] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-colors shadow-sm">
                  Explore Features
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4 text-[#45474c]">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <p className="text-sm font-medium">
                  Join <span className="text-[#091426] font-bold">5,000+ A* students</span> reclaiming their focus
                </p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-20 bg-white p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-[#c5c6cd]/20 transform rotate-2 max-w-md mx-auto">
                <div className="w-full h-4 bg-[#091426]/5 rounded-full mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b]">
                      <span className="material-symbols-outlined">timer</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                      <div className="h-2 w-1/3 bg-slate-50 rounded mt-2 text-[10px] font-bold">POMODORO ACTIVE</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-caveat text-[#091426] text-2xl">IAL Chemistry: Unit 4</p>
                    <p className="font-patrick text-[#45474c] text-lg mt-2">
                      "Next 25m: Mastering Entropies. Don't check your phone."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="px-4 py-2 bg-[#091426] text-white text-xs font-bold rounded-full">
                    Mark Scheme Synergized
                  </div>
                </div>
              </div>

              <div className="absolute -top-10 -right-4 z-30 bg-[#f59e0b] p-4 rounded-xl shadow-lg transform -rotate-12 w-48">
                <p className="font-patrick text-[#091426] text-xl leading-none">
                  Photo any problem—I'll explain it instantly! 📸
                </p>
              </div>
              <div className="absolute top-1/4 left-1/4 washi-tape-amber h-6 w-24 z-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* THE ALL-IN-ONE SYSTEM SECTION */}
      <section id="inside" className="py-24 bg-[#f3f0f7] paper-texture relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-caveat text-[#332211]">The High-Performance System</h2>
            <p className="text-[#45474c] font-medium mt-4 opacity-70">Stop browsing for resources. Start using them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#a855f7] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🗺️</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Intelligent Roadmaps</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Integrated calendars that tell you exactly when to study each unit based on your actual exam dates. Zero
                decision fatigue.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#ef4444] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Science-Based Timers</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Built-in Pomodoro cycles with curated focus music. Study in 25-minute bursts proven to maximize
                retention and prevent burnout.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#f97316] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Dedicated IAL Mentor</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Not just generic AI. Our mentor is trained on Edexcel and CIE mark schemes. Snap a photo, ask a
                question, get an examiner-level answer.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#10b981] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Topic Generators</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Instantly generate 10 topical questions for any sub-unit. Complete them, get them marked, and track your
                mastery in real-time.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#3b82f6] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Mock Mastery</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Full-length mocks marked instantly. We don't just give the answers; we tell you why you lost the mark
                based on examiner reports.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#f43f5e] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🧭</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Clarity Compass</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Coming Soon: A career-matching engine that maps your A-Level interests to university degrees and future
                industry skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-[#fdfcf8] paper-texture border-t border-[#c5c6cd]/20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-caveat text-[#091426]">Student Success Stories</h2>
            <p className="text-[#45474c] text-xs font-bold tracking-widest uppercase mt-4">
              Real results from the global cohort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <StickyNote
              color="#fff9c4"
              border="border-amber-400"
              rotate="-rotate-1"
              text="I used to spend 2 hours a day just looking for resources. Now I just follow the roadmap. My Biology grade jumped from a B to an A in 6 weeks."
              author="Hamad Al-Tayer"
              info="Dubai Student • Edexcel IAL"
              initials="HT"
              avatar="bg-amber-500"
            />
            <StickyNote
              color="#e3f2fd"
              border="border-blue-400"
              rotate="rotate-1"
              text="The snap-and-explain feature is incredible. It caught the specific keyword I was missing in my Physics mock. I feel much more confident now."
              author="Zainab Siddiqui"
              info="Karachi Student • CIE A-Level"
              initials="ZS"
              avatar="bg-blue-500"
            />
            <StickyNote
              color="#fce4ec"
              border="border-pink-400"
              rotate="-rotate-2"
              text="Finally, one place for everything. I deleted my 50 bookmarked revision tabs. The cognitive load I've lost is huge."
              author="Oliver Smith"
              info="London Student • Edexcel GCE"
              initials="OS"
              avatar="bg-pink-500"
            />
            <StickyNote
              color="#e8f5e9"
              border="border-green-400"
              rotate="rotate-2"
              text="The Pomodoro timer with the focus music actually makes me study. I used to lack motivation, but the system just pulls me in."
              author="Ayesha Khan"
              info="Abu Dhabi Student • Edexcel IAL"
              initials="AK"
              avatar="bg-green-600"
            />
            <StickyNote
              color="#fff3e0"
              border="border-orange-400"
              rotate="-rotate-1"
              text="The marking scheme analyzer is scary accurate. It explains the Examiner Reports better than my actual textbooks."
              author="Ibrahim J."
              info="Sharjah Student • CIE IGCSE"
              initials="IJ"
              avatar="bg-orange-500"
            />
            <StickyNote
              color="#f3e5f5"
              border="border-purple-400"
              rotate="rotate-1"
              text="I love the all-in-one approach. No more switching between GPT, PMT, and YouTube. Everything is curated for the syllabus."
              author="Lila M."
              info="Dubai Student • Cambridge A-Level"
              initials="LM"
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
                I built this because I was tired of 'site-hopping'. I saw my friends spending more time 'organizing'
                their study than actually studying. One tab for notes, one for papers, one for a timer. It's a mess.
                Make Me Revise is my vision for a single, focused hub where you sit down, follow the roadmap, and win.
                No distractions, just progress.
              </p>
              <div className="w-full h-px bg-amber-100 my-8"></div>
              <div className="flex flex-col items-end">
                <p className="text-4xl text-amber-600 italic font-bold">Shabbir</p>
                <p className="text-lg text-[#45474c] mt-2 opacity-60">— Founder & Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#f8f9fb] paper-texture">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#f59e0b] font-bold text-xs tracking-widest uppercase">The Specifics</span>
            <h2 className="text-5xl font-caveat text-[#091426] mt-2">Common Questions</h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Can I really replace all my other revision websites?"
              answer="That's exactly what it's for. We've combined the best of past paper banks, topical generators, note sites, and AI help into one synchronized command center. Save your bookmarks for something else."
              isOpen={true}
            />
            <FAQItem
              question="How does the image-upload AI differ from ChatGPT?"
              answer="Generic AI lacks syllabus context. Our mentor is specifically trained on Edexcel and Cambridge Examiner Reports. It doesn't just give an answer—it gives the 'Mark Scheme Answer' and explains the keywords you need for the marks."
            />
            <FAQItem
              question="Is the study roadmap automatic?"
              answer="Yes. You put in your exam dates and your study preferences, and the system builds a calendar for you. It uses interleaved practice (alternating subjects) to ensure long-term retention."
            />
            <FAQItem
              question="Does it support both IAL and CIE?"
              answer="Absolutely. We have mapped the entire syllabus for Edexcel IAL, Edexcel UK GCE, and Cambridge (CIE) across Physics, Biology, Chemistry, and Maths."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-[#091426] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-7xl font-caveat text-white mb-8">Stop the site-hopping.</h2>
          <p className="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto">
            Get your roadmap. Ask your questions. Master your mocks. Everything you need is already here.
          </p>
          <button className="bg-[#f59e0b] text-[#091426] px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
            Join the Cohort
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#091426] py-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-caveat text-3xl text-white font-bold leading-none mb-2">Make Me Revise</span>
            <p className="text-white/40">© 2026 Developed in the UAE • For the Global Scholar</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="hover:text-[#f59e0b]" href="#">
              Privacy
            </a>
            <a className="hover:text-[#f59e0b]" href="#">
              Terms
            </a>
            <a className="hover:text-[#f59e0b]" href="#">
              Support
            </a>
            <a className="hover:text-[#f59e0b]" href="#">
              Syllabus Hub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const MarqueeContent = () => (
  <>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">timer</span> Integrated Pomodoro
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">school</span> Edexcel & CIE Mastery
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px] text-[#f59e0b]">verified</span> All-in-One Dashboard
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">psychology</span> Spaced Repetition Roadmaps
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">camera_alt</span> Image-Search Mentor
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">music_note</span> Curated Focus Music
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">history_edu</span> Instant Mock Marking
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[14px]">explore</span> Career Clarity Compass
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
