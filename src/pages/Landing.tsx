<!DOCTYPE html>

<html class="scroll-smooth" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Make Me Revise | High-Performance Study App for Students</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&amp;family=Inter:wght@400;500;600;700&amp;family=Patrick+Hand&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        :root {
            --paper-bg: #fdfcf8;
            --navy: #091426;
            --amber: #f59e0b;
        }
        .notebook-pattern {
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 100% 28px;
        }
        .grid-pattern {
            background-image: radial-gradient(#cbd5e1 0.5px, transparent 0.5px);
            background-size: 24px 24px;
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
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
        }
        .marquee-content {
            display: inline-block;
            animation: scroll 40s linear infinite;
        }
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .paper-texture {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .sticky-note {
            box-shadow: 5px 5px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        .sticky-note:hover {
            transform: translateY(-5px) rotate(1deg);
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#091426",
                        "secondary": "#f59e0b",
                        "background": "#fdfcf8",
                        "surface": "#ffffff",
                        "on-surface": "#191c1e",
                        "on-surface-variant": "#45474c",
                        "outline-variant": "#c5c6cd",
                    },
                    fontFamily: {
                        "note-text": ["Patrick Hand"],
                        "label-caps": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-lg": ["Caveat"],
                        "headline-md": ["Caveat"],
                        "headline-xl": ["Caveat"]
                    },
                    spacing: {
                        "gutter": "24px",
                        "max-width": "1200px",
                        "margin-mobile": "16px",
                        "margin-desktop": "64px",
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-primary selection:bg-secondary/30 selection:text-primary">
<!-- TOP MARQUEE BANNER -->
<div class="w-full bg-primary py-2.5 marquee-container border-b border-black/10 overflow-hidden relative z-50">
<div class="marquee-content flex gap-12 items-center text-white/90 font-label-caps text-[11px] tracking-[0.2em] uppercase">
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">school</span> Cambridge IGCSE</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">book</span> Edexcel IGCSE</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px] text-secondary">auto_awesome</span> Built for the 2026 spec</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">science</span> Chemistry</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">psychology</span> Biology</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">bolt</span> Physics</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">architecture</span> Mathematics</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">smart_toy</span> AI Mark Schemes</span>
<!-- Duplicate for infinite scroll -->
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">school</span> Cambridge IGCSE</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">book</span> Edexcel IGCSE</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px] text-secondary">auto_awesome</span> Built for the 2026 spec</span>
<span class="flex items-center gap-2"><span class="material-symbols-outlined text-[14px]">science</span> Chemistry</span>
</div>
</div>
<!-- NAVBAR -->
<header class="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
<div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-5 flex justify-between items-center">
<div class="flex items-center gap-3">
<div class="flex flex-col">
<span class="text-3xl font-headline-xl font-bold text-primary leading-none">Make Me Revise</span>
<span class="text-[9px] font-label-caps text-on-surface-variant tracking-[0.3em] uppercase mt-1">Revise Smart, Score Higher</span>
</div>
</div>
<nav class="hidden md:flex gap-10 items-center">
<a class="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm" href="#">What's inside</a>
<a class="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm" href="#">The story</a>
</nav>
<div class="flex items-center gap-6">
<button class="text-primary font-semibold text-sm hover:opacity-70 transition-opacity">Log in</button>
<button class="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all">Start free</button>
</div>
</div>
</header>
<!-- HERO SECTION -->
<section class="relative min-h-[85vh] flex items-center overflow-hidden paper-texture py-20">
<div class="absolute inset-0 grid-pattern opacity-40"></div>
<div class="absolute inset-0 notebook-pattern opacity-10 pointer-events-none"></div>
<!-- Background Accents -->
<div class="absolute top-[10%] left-[5%] w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
<div class="absolute bottom-[10%] right-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
<div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full">
<div class="grid lg:grid-cols-2 gap-16 items-center">
<div class="text-left">
<div class="inline-flex items-center gap-3 bg-white border border-outline-variant/40 px-5 py-2 rounded-full shadow-sm mb-10 transform -rotate-1">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
</span>
<span class="text-xs font-bold tracking-wide uppercase text-primary/80">Built by students, for the next A* cohort</span>
</div>
<h1 class="text-6xl md:text-8xl font-headline-xl text-primary leading-[0.9] mb-8">
                    The revision app <br/>
<span class="relative inline-block">
<span class="relative z-10 text-secondary">built for your exams.</span>
<svg class="absolute -bottom-2 left-0 w-full h-4 text-secondary/20 -z-10" preserveaspectratio="none" viewbox="0 0 100 20"><path d="M0,15 Q25,0 50,15 T100,15" fill="none" stroke="currentColor" stroke-width="8"></path></svg>
</span>
</h1>
<p class="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-xl mb-12">
                    Stop drowning in textbooks. Get AI notes, custom mock papers, and a roadmap tailored to <span class="text-primary font-bold">Edexcel IAL</span> and <span class="text-primary font-bold">Cambridge A-Level</span>.
                </p>
<div class="flex flex-col sm:flex-row gap-5">
<button class="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all group">
                        Start for free
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
<button class="bg-white border-2 border-primary/5 text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-surface transition-colors shadow-sm">
                        See how it works
                    </button>
</div>
<div class="mt-12 flex items-center gap-4 text-on-surface-variant">
<div class="flex -space-x-3">
<div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
<div class="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
<div class="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
</div>
<p class="text-sm font-medium">Join <span class="text-primary font-bold">5,000+ students</span> crushing their finals</p>
</div>
</div>
<!-- Asymmetrical Floating Elements -->
<div class="relative hidden lg:block">
<!-- Main "Card" -->
<div class="relative z-20 bg-white p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-outline-variant/20 transform rotate-2 max-w-md mx-auto">
<div class="w-full h-4 bg-primary/5 rounded-full mb-6"></div>
<div class="space-y-4">
<div class="flex items-center gap-4">
<div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">menu_book</span>
</div>
<div class="flex-1">
<div class="h-3 w-1/2 bg-slate-100 rounded"></div>
<div class="h-2 w-1/3 bg-slate-50 rounded mt-2"></div>
</div>
</div>
<div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
<p class="font-headline-md text-primary text-2xl">Topic: Organic Chemistry</p>
<p class="font-note-text text-on-surface-variant text-lg mt-2">"Remember to use the specific keywords from the 2026 mark scheme..."</p>
</div>
</div>
<div class="mt-8 flex justify-end">
<div class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full">AI Analysis Complete</div>
</div>
</div>
<!-- Floating Notes -->
<div class="absolute -top-10 -right-4 z-30 bg-secondary p-4 rounded-xl shadow-lg transform -rotate-12 w-48">
<p class="font-note-text text-primary text-xl leading-none">Don't forget the mock paper tonight! 📚</p>
</div>
<div class="absolute top-1/2 -left-20 z-10 bg-white p-6 rounded-2xl shadow-xl transform rotate-6 border border-slate-100 max-w-[200px]">
<div class="flex gap-1 mb-3">
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-secondary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="text-xs font-bold italic">"Changed my life. I finally understand Physics."</p>
</div>
<!-- Washi Tapes -->
<div class="absolute top-0 left-1/4 washi-tape-amber h-6 w-24 z-30"></div>
<div class="absolute bottom-1/4 right-0 washi-tape-navy h-6 w-20 z-10"></div>
</div>
</div>
</div>
</section>
<!-- WHAT'S INSIDE (RECREATED EXACTLY AS IMAGE_7) -->
<section class="py-24 bg-[#f3f0f7] paper-texture relative overflow-hidden">
<div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
<div class="text-center mb-16">
<h2 class="text-5xl font-headline-lg text-[#332211]">What's inside</h2>
<p class="text-on-surface-variant font-body-md mt-4 opacity-70">Everything you need. Nothing you don't.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
<!-- AI Notes Card -->
<div class="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#a855f7] shadow-sm hover:shadow-xl transition-all group">
<div class="text-4xl mb-6">📖</div>
<h3 class="text-2xl font-bold text-[#1e293b] mb-3">AI Notes</h3>
<p class="text-on-surface-variant font-body-sm leading-relaxed">Topic-by-topic notes generated for your exact exam board and unit</p>
</div>
<!-- Mock Papers Card -->
<div class="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#ef4444] shadow-sm hover:shadow-xl transition-all">
<div class="text-4xl mb-6">📝</div>
<h3 class="text-2xl font-bold text-[#1e293b] mb-3">Mock Papers</h3>
<p class="text-on-surface-variant font-body-sm leading-relaxed">Original exam-style questions with full mark schemes</p>
</div>
<!-- Roadmap Card -->
<div class="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#f97316] shadow-sm hover:shadow-xl transition-all">
<div class="text-4xl mb-6">🗺️</div>
<h3 class="text-2xl font-bold text-[#1e293b] mb-3">Roadmap</h3>
<p class="text-on-surface-variant font-body-sm leading-relaxed">A personalised study plan that knows your weak spots</p>
</div>
<!-- Exam FAQs Card -->
<div class="bg-white rounded-[2rem] p-10 border-t-[6px] border-[#10b981] shadow-sm hover:shadow-xl transition-all">
<div class="text-4xl mb-6">🎯</div>
<h3 class="text-2xl font-bold text-[#1e293b] mb-3">Exam FAQs</h3>
<p class="text-on-surface-variant font-body-sm leading-relaxed">The questions that actually come up, answered like a model student</p>
</div>
</div>
</div>
</section>
<!-- FOUNDER NOTE (RETAINED EXACTLY AS IMAGE_6) -->
<section class="py-20 bg-[#fff9ea] relative overflow-hidden">
<!-- Washi Tapes -->
<div class="absolute top-10 left-1/2 -translate-x-32 w-24 h-8 bg-pink-300/60 rotate-2 z-10 shadow-sm"></div>
<div class="absolute top-12 left-1/2 translate-x-32 w-24 h-8 bg-purple-300/60 -rotate-3 z-10 shadow-sm"></div>
<div class="max-w-3xl mx-auto px-6 relative">
<div class="founder-note-clip bg-white p-12 md:p-16 shadow-2xl relative border-l-4 border-amber-400 paper-texture">
<div class="text-amber-500 text-5xl font-serif mb-8 opacity-40">"</div>
<div class="space-y-6 font-note-text text-2xl text-on-surface-variant leading-relaxed">
<p>I'm 17. I know the panic the night before an exam. I know what it feels like to open a 60-page spec and have no idea where to start. I built MakeMeRevise because I needed it — and because no one was making it for students like us.</p>
<div class="w-full h-px bg-amber-100 my-8"></div>
<div class="flex flex-col items-end">
<p class="text-4xl text-amber-600 italic font-bold">Shabbir</p>
<p class="text-lg text-on-surface-variant mt-2 opacity-60">— Shabbir, Founder &amp; Student</p>
</div>
</div>
</div>
</div>
</section>
<!-- TESTIMONIALS (Elevated sticky note UI) -->
<section class="py-24 bg-background paper-texture border-t border-outline-variant/20">
<div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
<div class="text-center mb-20">
<h2 class="text-5xl font-headline-lg text-primary">What students are saying</h2>
<p class="text-on-surface-variant font-label-caps text-xs tracking-widest uppercase mt-4">Verified students from our beta cohort</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- Testimonial 1 -->
<div class="bg-[#fff9c4] p-8 rounded-sm sticky-note -rotate-1 border-l-4 border-amber-400">
<div class="flex text-amber-500 mb-6 scale-75 origin-left">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-note-text text-xl text-primary mb-8 italic">"I went from a C to a B in three weeks. The roadmap literally saved my grade."</p>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">FA</div>
<div>
<p class="font-bold text-xs">Fatima Al Mansoori</p>
<p class="text-[10px] opacity-60">Year 13 • Edexcel Biology</p>
</div>
</div>
</div>
<!-- Testimonial 2 -->
<div class="bg-[#e3f2fd] p-8 rounded-sm sticky-note rotate-1 border-l-4 border-blue-400">
<div class="flex text-blue-500 mb-6 scale-75 origin-left">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-note-text text-xl text-primary mb-8 italic">"The AI feedback is actually smart. It doesn't just say 'wrong', it tells you why."</p>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">KA</div>
<div>
<p class="font-bold text-xs">Khalid Al Rashidi</p>
<p class="text-[10px] opacity-60">Year 13 • Maths &amp; Physics</p>
</div>
</div>
</div>
<!-- Testimonial 3 -->
<div class="bg-[#fce4ec] p-8 rounded-sm sticky-note -rotate-2 border-l-4 border-pink-400">
<div class="flex text-pink-500 mb-6 scale-75 origin-left">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<p class="font-note-text text-xl text-primary mb-8 italic">"Best investment for my A-levels. It's so much better than generic revision sites."</p>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">MH</div>
<div>
<p class="font-bold text-xs">Mariam Hassan</p>
<p class="text-[10px] opacity-60">Year 12 • Cambridge Chem</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- FAQ SECTION (Index card UI) -->
<section class="py-24 bg-[#f8f9fb] paper-texture">
<div class="max-w-3xl mx-auto px-margin-mobile">
<div class="text-center mb-12">
<span class="text-secondary font-bold text-xs tracking-widest uppercase">FAQ</span>
<h2 class="text-5xl font-headline-xl text-primary mt-2">Quick answers.</h2>
</div>
<div class="space-y-4">
<details class="group bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden" open="">
<summary class="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
<span class="font-bold text-primary">Which exam boards do you support?</span>
<span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                    Currently, we provide full support for Edexcel IAL and Cambridge A-Level specifications. More boards are being added every month!
                </div>
</details>
<details class="group bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
<summary class="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
<span class="font-bold text-primary">Is the AI marking actually accurate?</span>
<span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                    Our AI is trained exclusively on official mark schemes and examiner reports to ensure precision in keyword detection.
                </div>
</details>
<details class="group bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
<summary class="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
<span class="font-bold text-primary">Can I cancel my subscription anytime?</span>
<span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<div class="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                    Absolutely. No long-term contracts. You can cancel with a single click in your settings.
                </div>
</details>
</div>
</div>
</section>
<!-- FINAL CTA -->
<section class="py-32 bg-primary relative overflow-hidden">
<div class="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
<div class="max-w-4xl mx-auto px-6 text-center relative z-10">
<h2 class="text-6xl md:text-7xl font-headline-xl text-white mb-8">Stop guessing, start knowing.</h2>
<p class="text-white/60 text-xl font-medium mb-12 max-w-xl mx-auto">
            Join the students securing their university spots today. Built by a student who's been exactly where you are.
        </p>
<button class="bg-secondary text-primary px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
            Start for free
        </button>
</div>
</section>
<!-- FOOTER -->
<footer class="bg-primary py-16 border-t border-white/5">
<div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
<div class="flex flex-col md:flex-row justify-between items-center gap-10">
<div class="flex flex-col items-center md:items-start">
<span class="font-headline-md text-3xl text-white font-bold">Make Me Revise</span>
<p class="text-white/40 text-xs mt-2">© 2026 Make Me Revise. Built with pride for the next generation.</p>
</div>
<div class="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest uppercase text-white/60">
<a class="hover:text-secondary transition-colors" href="#">Privacy</a>
<a class="hover:text-secondary transition-colors" href="#">Terms</a>
<a class="hover:text-secondary transition-colors" href="#">Support</a>
<a class="hover:text-secondary transition-colors" href="#">Guides</a>
</div>
</div>
</div>
</footer>
</body></html>