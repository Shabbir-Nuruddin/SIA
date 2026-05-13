web application/stitch/projects/3603110588908651483/screens/d4633ae4543b414c9e43f5eb94902909
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, Star, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthRoute } from "@/lib/postAuthRoute";

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
    <div className="min-h-screen bg-[#f7f9fb] font-sans text-slate-900 scroll-smooth selection:bg-amber-200 overflow-x-hidden">
      {/* TOP MARQUEE BANNER */}
      <div className="bg-amber-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-amber-700/20 sticky top-0 z-[60]">
        <div className="flex animate-marquee gap-8 items-center text-xs font-bold tracking-wider uppercase">
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><BookOpen size={14}/> Edexcel IAL</span>
              <span className="opacity-50">/</span>
              <span className="flex items-center gap-2"><FileText size={14}/> Cambridge A-Level</span>
              <span className="opacity-50">/</span>
              <span className="flex items-center gap-2">Built for 2026 Spec</span>
              <span className="opacity-50">/</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-[33px] z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900">Make Me Revise</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 -mt-1">Revise Smart, Score Higher</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#inside" className="hover:text-amber-600 transition-colors font-bold">What's inside</a>
            <a href="#founder" className="hover:text-amber-600 transition-colors font-bold">The story</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 px-6 font-bold shadow-sm active:scale-95 transition-transform">
                Start free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Denser Notebook Lines Pattern - 24px as requested */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
            backgroundSize: '100% 24px' 
          }} 
        />
        
        <div className="container mx-auto px-6 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 mb-8 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                BUILT BY STUDENTS, FOR THE NEXT A* COHORT
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-[0.9] mb-8" style={{ fontFamily: "'Caveat', cursive" }}>
                The revision app <br/>
                <span className="text-amber-500 italic">built for your exams.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-xl mb-10 leading-relaxed font-medium">
                Stop drowning in textbooks. Get AI notes, custom mock papers, and a roadmap tailored to <span className="font-bold text-slate-900 underline decoration-amber-500/30">Edexcel IAL</span> and <span className="font-bold text-slate-900 underline decoration-amber-500/30">Cambridge A-Level</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="rounded-xl h-16 px-10 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl group transition-all duration-300 active:scale-95">
                    Start for free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#inside">
                  <Button size="lg" variant="outline" className="rounded-xl h-16 px-10 text-lg font-bold border-2 border-slate-200 text-slate-900 hover:bg-slate-50 transition-all active:scale-95">
                    See how it works
                  </Button>
                </a>
              </div>
              <div className="mt-12 flex items-center gap-4 text-sm font-bold text-slate-400">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="Student" />
                    </div>
                  ))}
                </div>
                <span>Join <span className="text-slate-900">5,000+ students</span> crushing their finals</span>
              </div>
            </div>

            <div className="relative">
              {/* Floating Academic Interface Card */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-[#fcfdfd] rounded-2xl p-8 border border-slate-50">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-3 w-24 bg-slate-100 rounded-full" />
                    <div className="h-3 w-12 bg-amber-100 rounded-full" />
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex gap-4 items-start">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><BookOpen size={20}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Topic: Organic Chemistry</div>
                        <div className="text-sm font-medium text-slate-700 italic">"Remember to use the specific keywords from the 2026 mark scheme..."</div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">AI Analysis Complete</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sticky Note Decoration */}
              <div className="absolute -top-6 -right-4 bg-amber-400 p-4 shadow-lg rotate-12 text-slate-900 font-bold text-xs max-w-[140px] z-20 select-none">
                Don't forget the mock paper tonight! 📚
              </div>
              {/* Accent Circles */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section id="inside" className="py-32 bg-white relative">
         <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
            backgroundSize: '100% 24px'
          }} 
        />
        <div className="container mx-auto px-6 max-w-6xl relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>What's inside</h2>
            <p className="text-slate-500 font-medium text-lg italic">Everything you need. Nothing you don't.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon="📖"
              color="border-purple-500"
              title="AI Notes"
              desc="Topic-by-topic notes generated for your exact exam board and unit"
            />
            <FeatureCard
              icon="📝"
              color="border-rose-500"
              title="Mock Papers"
              desc="Original exam-style questions with full mark schemes"
            />
            <FeatureCard
              icon="🗺️"
              color="border-orange-500"
              title="Roadmap"
              desc="A personalised study plan that knows your weak spots"
            />
            <FeatureCard
              icon="🎯"
              color="border-emerald-500"
              title="Exam FAQs"
              desc="The questions that actually come up, answered like a model student"
            />
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section id="founder" className="py-32 bg-[#fffdf0] relative overflow-hidden">
        {/* Notebook Lines for this section - denser */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(180, 100, 50, 0.25) 1px, transparent 1px)', backgroundSize: '100% 24px' }} />
        
        {/* Tape Decorations */}
        <div className="absolute top-8 left-1/4 w-32 h-8 bg-pink-300/40 -rotate-3 shadow-sm" />
        <div className="absolute top-8 right-1/4 w-32 h-8 bg-purple-300/40 rotate-2 shadow-sm" />

        <div className="container mx-auto px-6 max-w-3xl relative">
          <div className="bg-white p-12 md:p-16 shadow-2xl relative" style={{ clipPath: "polygon(0 2%, 100% 0, 98% 100%, 2% 98%)" }}>
            <div className="text-amber-200 text-9xl absolute -top-8 -left-4 font-serif italic select-none opacity-50">"</div>
            <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-medium mb-12 relative z-10" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and have no idea where to start. I built MakeMeRevise because I needed it — and because no one was making it for students like us.
            </p>
            <div className="flex flex-col items-end border-t border-amber-100 pt-8">
              <span className="text-4xl text-amber-700 mb-1" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}>Shabbir</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">— Shabbir, Founder & Student</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>What students are saying</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Verified students from our beta cohort</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              bg="bg-amber-50"
              initial="FA"
              name="Fatima Al Mansoori"
              sub="Year 13 • Edexcel Biology"
              quote="I went from a C to a B in three weeks. The roadmap literally saved my grade."
              rotate="-rotate-1"
            />
            <TestimonialCard
              bg="bg-blue-50"
              initial="KA"
              name="Khalid Al Rashidi"
              sub="Year 13 • Maths & Physics"
              quote="The AI feedback is actually smart. It doesn't just say 'wrong', it tells you why."
              rotate="rotate-1"
            />
            <TestimonialCard
              bg="bg-rose-50"
              initial="MH"
              name="Mariam Hassan"
              sub="Year 12 • Cambridge Chem"
              quote="Best investment for my A-levels. It's so much better than generic revision sites."
              rotate="-rotate-2"
            />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 bg-[#f7f9fb]">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-bold text-[10px] uppercase tracking-widest block mb-2">FAQ</span>
            <h2 className="text-5xl font-bold text-slate-900" style={{ fontFamily: "'Caveat', cursive" }}>Quick answers.</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Which exam boards do you support?", a: "Currently, we provide full support for Edexcel IAL and Cambridge A-Level specifications. More boards are being added every month!" },
              { q: "Is the AI marking actually accurate?", a: "Yes, our AI is trained specifically on official mark schemes and past paper data to provide high-fidelity feedback." },
              { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can manage your subscription directly from your dashboard with no hidden fees." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left group transition-colors hover:bg-slate-50">
                  <span className="font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown className="text-slate-400 group-hover:text-slate-900 transition-colors" size={20}/>
                </button>
                {i === 0 && (
                  <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-slate-900 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
            Stop guessing, start knowing.
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Join the students securing their university spots today. Built by a student who's been exactly where you are.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="rounded-xl h-20 px-16 text-xl font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.2)] transition-all active:scale-95">
              Start for free
            </Button>
          </Link>
        </div>
        {/* Subtle grid pattern for footer CTA */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-white font-bold text-lg mb-1">Make Me Revise</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">© 2026 Make Me Revise. Built with pride for the next generation.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
              <Link to="/guides" className="hover:text-white transition-colors">Guides</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Helper Components ---

const FeatureCard = ({ icon, color, title, desc }: { icon: string; color: string; title: string; desc: string }) => (
  <div className={`bg-white p-8 rounded-2xl border border-slate-100 shadow-lg border-t-4 ${color} hover:-translate-y-1 transition-all duration-300`}>
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 text-slate-900" style={{ fontFamily: "'Patrick Hand', cursive" }}>{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const TestimonialCard = ({ bg, initial, name, sub, quote, rotate }: any) => (
  <div className={`${bg} p-8 rounded-2xl border border-white shadow-sm transform transition-all duration-500 hover:scale-105 ${rotate}`}>
    <div className="flex gap-1 text-amber-400 mb-4">
      {Array.from({ length: 5 }).map((_, star) => <Star key={star} size={14} fill="currentColor"/>)}
    </div>
    <p className="text-slate-800 font-medium italic mb-8 leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-400 uppercase border border-slate-100 shadow-sm">{initial}</div>
      <div>
        <div className="text-sm font-bold text-slate-900">{name}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">{sub}</div>
      </div>
    </div>
  </div>
);

export default Landing;
