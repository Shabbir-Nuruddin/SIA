import React from "react";
import { FlipButton } from "@/components/ui/flip-button";

const LandingPage = () => {

  /**
   * AUTHENTICATION HANDLER
   * Pointing directly to your unified /auth route.
   */
  const handleAuthRedirect = () => {
    window.location.href = "/auth";
  };

  return (
    <main className="bg-[#fdfcf8] text-[#091426] selection:bg-[#f59e0b]/30 selection:text-[#091426] font-['Inter'] antialiased min-h-screen">
      {/* 
          CSS ENGINE: 
          Restoring the full notebook aesthetic and fixing the icon ligature issue.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        
        /* ICON FIX: Ensures text like "arrow_forward" becomes a glyph */
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined' !important;
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
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
      <header className="sticky top-0 z-40 bg-[#fdfcf8]/85 backdrop-blur-md border-b border-[#c5c6cd]/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 py-3 sm:py-5 flex justify-between items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-2xl sm:text-3xl font-caveat font-bold text-[#091426] leading-none truncate">Make Me Revise</span>
            <span className="hidden sm:inline text-[9px] tracking-[0.3em] uppercase mt-1 text-[#45474c] font-bold">
              The Ultimate A-Level Command Center
            </span>
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#inside">
              The System
            </a>
            <a className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm" href="#story">
              Our Mission
            </a>
            <a
              className="text-[#45474c] hover:text-[#091426] transition-colors font-medium text-sm"
              href="#testimonials"
            >
              Community
            </a>
          </nav>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button
              onClick={handleAuthRedirect}
              className="hidden sm:inline text-[#091426] font-semibold text-sm hover:opacity-70 transition-opacity"
            >
              Log in
            </button>
            <FlipButton
              tone="dark"
              size="sm"
              onClick={handleAuthRedirect}
              className="!px-5 sm:!px-6 !py-2 sm:!py-2.5 !text-[11px] sm:!text-xs !rounded-full"
            >
              Start Scoring
            </FlipButton>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden paper-texture py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="absolute inset-0 notebook-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white border border-[#c5c6cd]/40 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm mb-6 sm:mb-10 transform -rotate-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase text-[#091426]/80">
                  Built by A-Level students, for A-Level students.
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-caveat text-[#091426] leading-[0.9] mb-6 sm:mb-8">
                Stop drowning in tabs. <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#f59e0b]">Start scoring A*s.</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#f59e0b]/20 -z-10"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 20"
                  >
                    <path d="M0,15 Q25,0 50,15 T100,15" fill="none" stroke="currentColor" strokeWidth="8"></path>
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-[#45474c] font-medium leading-relaxed max-w-xl mb-8 sm:mb-12">
                One smart hub that builds your revision plan, marks your mock papers in seconds, and explains anything
                you snap a photo of — across <span className="text-[#091426] font-bold">Edexcel IAL</span> and{" "}
                <span className="text-[#091426] font-bold">Cambridge</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <FlipButton
                  tone="dark"
                  size="md"
                  onClick={handleAuthRedirect}
                  className="!text-sm sm:!text-base !px-7 sm:!px-9 !py-3.5 sm:!py-4 shadow-2xl w-full sm:w-auto"
                >
                  Build My A-Level Roadmap
                </FlipButton>
                <a
                  href="#inside"
                  className="bg-white border border-[#091426]/10 text-[#091426] px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-widest hover:bg-white/80 transition-colors shadow-sm flex items-center justify-center w-full sm:w-auto"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-4 text-[#45474c]">
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug">
                  Trusted by <span className="text-[#091426] font-bold">5,000+ A-Level students</span> across the UK, UAE &amp; South Asia
                </p>
              </div>

              {/* STATS STRIP */}
              <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                <div>
                  <div className="text-4xl sm:text-5xl font-caveat font-bold text-[#091426] leading-none">2x</div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#45474c] mt-1">Faster mock marking vs. self-review</p>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-caveat font-bold text-[#f59e0b] leading-none">87%</div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#45474c] mt-1">Hit or beat their target grade</p>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-caveat font-bold text-[#091426] leading-none">9hr</div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#45474c] mt-1">Saved weekly on planning</p>
                </div>
              </div>
            </div>

            {/* FLOATING PRODUCT PREVIEWS */}
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
                      "Next 25m: Mastering Entropies. Your roadmap is synced."
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
                <p className="font-patrick text-[#091426] text-xl leading-none font-bold">
                  Stuck? Snap a photo for an instant explanation! 📸
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
                <p className="text-xs font-bold italic text-[#091426]">
                  "I stopped juggling bookmarks. Everything is just here."
                </p>
              </div>
              <div className="absolute top-0 left-1/4 washi-tape-amber h-6 w-24 z-30"></div>
              <div className="absolute bottom-1/4 right-0 washi-tape-navy h-6 w-20 z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* THE ALL-IN-ONE SYSTEM SECTION */}
      <section id="inside" className="py-16 sm:py-20 lg:py-24 bg-[#f3f0f7] paper-texture relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-caveat text-[#332211]">The High-Performance Ecosystem</h2>
            <p className="text-[#45474c] font-medium mt-4 opacity-70">
              Focus on the 20% of effort that gives you 80% of the results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#a855f7] shadow-sm hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Know exactly what to study, every day</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                A personalised roadmap that adapts to your exam dates and weak topics. No more 2am panic about what
                to revise next.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#ef4444] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">⏳</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Focus that actually lasts an hour</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Built-in Pomodoro timers and curated focus music keep you locked in. Study less, retain more, stop
                drifting to YouTube.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#f97316] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">💡</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Never get stuck on a question again</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Snap any past-paper or textbook problem. The AI tutor explains it step by step using your exact board's
                command words and mark scheme.
              </p>
            </div>


            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#3b82f6] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Get mocks marked in 30 seconds</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Submit a full mock, get a marked paper instantly — with the silly-mark traps highlighted before they
                cost you in May.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#10b981] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">Spaced repetition that fixes weak topics</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                Your weakest topics quietly resurface in your roadmap on the exact day you're about to forget them. No
                guesswork, no flashcards to manage.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-t-[6px] border-[#f43f5e] shadow-sm hover:shadow-xl transition-all">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-3">See where your A-Levels actually lead</h3>
              <p className="text-[#45474c] text-sm leading-relaxed">
                The Clarity Compass maps your subjects to real university courses and growing careers — so revision
                feels like it's going somewhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-[#fdfcf8] paper-texture border-t border-[#c5c6cd]/20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-caveat text-[#091426]">The Cohort Consensus</h2>
            <p className="text-[#45474c] text-xs font-bold tracking-widest uppercase mt-4">
              Real feedback from students who've stopped the site-hopping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <StickyNote
              color="#fff9c4"
              border="border-amber-400"
              rotate="-rotate-1"
              text="Went from a predicted C to an A in Chem Unit 4 in one term. The adaptive roadmap basically forced me to fix my weak topics instead of re-reading the ones I already knew."
              author="Hamad Al-Tayer"
              info="Year 13 · Edexcel IAL · Dubai College"
              initials="HT"
              avatar="bg-amber-500"
            />
            <StickyNote
              color="#e3f2fd"
              border="border-blue-400"
              rotate="rotate-1"
              text="I asked the AI to mark my mock at 1am the night before my Physics paper. It caught three command-word mistakes I'd been making for months. Genuinely terrifying value."
              author="Zainab Siddiqui"
              info="A2 Physics · Karachi Grammar School"
              initials="ZS"
              avatar="bg-blue-500"
            />
            <StickyNote
              color="#fce4ec"
              border="border-pink-400"
              rotate="-rotate-2"
              text="I had 40+ tabs open for revision — Save My Exams, Physics & Maths Tutor, Quizlet, YouTube. Now I just open one tab. My screen time literally dropped 3 hours a day."
              author="Oliver Smith"
              info="Year 12 · Cambridge A-Level · Westminster"
              initials="OS"
              avatar="bg-pink-500"
            />
            <StickyNote
              color="#e8f5e9"
              border="border-green-400"
              rotate="rotate-2"
              text="The Pomodoro + focus music combo is the only reason I finished Bio Unit 5. I went from doing 1hr a day to a real 4hr study block without burning out."
              author="Ayesha Khan"
              info="Year 13 Bio + Chem · Repton Abu Dhabi"
              initials="AK"
              avatar="bg-green-600"
            />
            <StickyNote
              color="#fff3e0"
              border="border-orange-400"
              rotate="-rotate-1"
              text="My teacher takes a week to mark mocks. This thing did it in 40 seconds — and the feedback was honestly more specific. Saved my January retakes."
              author="Ibrahim Jamal"
              info="Edexcel IAL Chemistry · GEMS Sharjah"
              initials="IJ"
              avatar="bg-orange-500"
            />
            <StickyNote
              color="#f3e5f5"
              border="border-purple-400"
              rotate="rotate-1"
              text="I was paying £40/month for a tutor I barely used. £8 for unlimited AI marking + a plan that actually tells me what to do? Easy switch."
              author="Lila Mansoor"
              info="Year 13 Maths + Further · Dubai British School"
              initials="LM"
              avatar="bg-purple-500"
            />
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE SECTION */}
      <section id="story" className="py-14 sm:py-18 lg:py-20 bg-[#fff9ea] relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-32 w-24 h-8 bg-pink-300/60 rotate-2 z-10 shadow-sm"></div>
        <div className="absolute top-12 left-1/2 translate-x-32 w-24 h-8 bg-purple-300/60 -rotate-3 z-10 shadow-sm"></div>

        <div className="max-w-3xl mx-auto px-5 sm:px-6 relative">
          <div className="founder-note-clip bg-white p-12 md:p-16 shadow-2xl relative border-l-4 border-amber-400 paper-texture">
            <div className="text-amber-500 text-5xl font-serif mb-8 opacity-40">"</div>
            <div className="space-y-6 font-patrick text-2xl text-[#45474c] leading-relaxed">
              <p>
                I built this because I was tired of site-hopping. I saw my friends spending more time organizing their
                revision than actually studying. We had one tab for notes, one for papers, and another just to ask a
                chatbot for help. It was chaotic. Make Me Revise is the single, focused command center I wish I had—a
                place where you just sit down, follow the roadmap, and win. No distractions, just progress.
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

      {/* FAQ SECTION: FIXED ICONS */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#f8f9fb] paper-texture">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#f59e0b] font-bold text-xs tracking-widest uppercase">The Specifics</span>
            <h2 className="text-4xl sm:text-5xl font-caveat text-[#091426] mt-2">Everything you need to know</h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Why pay £8/month when Save My Exams, PMT and YouTube are free?"
              answer="Free sites give you scattered notes and PDFs. They don't mark your mock paper, don't tell you which topic to revise on Tuesday, and don't catch the specific command-word mistakes losing you marks. £8 buys you a coach, a marker and a planner — not just another notes site."
              isOpen={true}
            />
            <FAQItem
              question="Is the content actually up to date with the latest specs?"
              answer="Yes. Every topic is mapped to the current Edexcel IAL, Edexcel UK GCE and Cambridge A-Level specifications, and reviewed each exam cycle. When boards update a spec or release a new past paper, our content updates within days — not the next academic year."
              isOpen={false}
            />
            <FAQItem
              question="What if I sign up and don't actually use it?"
              answer="Cancel anytime in two clicks — no contracts, no awkward emails. There's also a 7-day free trial so you can build your roadmap, mark a real mock and decide before you pay a penny."
              isOpen={false}
            />
            <FAQItem
              question="How accurate is the AI marking — can I really trust it for a real grade?"
              answer="The marker is trained on official Edexcel and Cambridge mark schemes plus published Examiner Reports. It flags exactly which mark you earned, which you missed, and why — using the board's own wording. Treat it as a strict second opinion, not a replacement for your teacher's final word."
              isOpen={false}
            />
            <FAQItem
              question="Does it cover my exact subject and board?"
              answer="If you sit Physics, Chemistry, Biology or Maths at Edexcel IAL, Edexcel UK GCE or Cambridge A-Level, you're fully covered — every unit, every topic, every past paper. More boards and subjects are being added each term."
              isOpen={false}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-24 lg:py-32 bg-[#091426] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-5 sm:px-6 relative z-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-caveat text-white mb-6 sm:mb-8">Your A* is 7 days away.</h2>
          <p className="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto">
            Build your roadmap, mark a real mock paper, and feel the difference before you pay anything. Free for 7 days.
          </p>
          <FlipButton
            tone="primary"
            size="lg"
            onClick={handleAuthRedirect}
            className="!bg-[#f59e0b] !text-[#091426] [--flip-sweep:#091426] shadow-[0_20px_50px_rgba(245,158,11,0.25)] text-xl"
          >
            Build My A-Level Roadmap
          </FlipButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#091426] py-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-caveat text-3xl text-white font-bold leading-none mb-2">Make Me Revise</span>
            <p className="text-white/40">© 2026 Designed in the UAE • For the Global Scholar</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="hover:text-[#f59e0b]" href="/privacy">
              Privacy Hub
            </a>
            <a className="hover:text-[#f59e0b]" href="/terms">
              User Terms
            </a>
            <a className="hover:text-[#f59e0b]" href="#">
              Contact Support
            </a>
            <a className="hover:text-[#f59e0b]" href="#">
              Syllabus Hub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

/* --- SUB-COMPONENTS --- */

const MarqueeContent = () => (
  <>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">timer</span> Integrated Pomodoro
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">school</span> Edexcel & CIE Mastery
    </span>
    <span className="flex items-center gap-2 text-[#f59e0b] font-bold">
      <span className="material-symbols-outlined">verified</span> ALL-IN-ONE HUB
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">psychology</span> Spaced Repetition
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">camera_alt</span> Photo-Search Mentor
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">music_note</span> Curated Focus Music
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">history_edu</span> Instant Mock Marking
    </span>
    <span className="flex items-center gap-2">
      <span className="material-symbols-outlined">explore</span> Clarity Compass
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
