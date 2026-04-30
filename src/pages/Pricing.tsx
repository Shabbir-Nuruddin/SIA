import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

interface Tier {
  id: "free" | "pro" | "advanced";
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  Icon: typeof Sparkles;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Starter",
    tagline: "Get a real taste of Apex.",
    price: "AED 0",
    cadence: "forever",
    Icon: Sparkles,
    features: [
      "Roadmap for 1 subject",
      "10 AI-marked topical questions / day",
      "AI tutor — 20 messages / day",
      "Notes for 3 topics / week",
      "Built-in focus music",
      "Pomodoro + streaks",
    ],
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "The plan most students pick. Built for exam season.",
    price: "AED 39.99",
    cadence: "/ month",
    Icon: Zap,
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Starter",
      "Unlimited subjects + roadmap rebuilds",
      "Unlimited AI-marked topical questions",
      "Unlimited mock papers with examiner feedback",
      "Unlimited notes — every topic, every unit",
      "AI tutor — 200 messages / day",
      "Photo upload: AI marks your handwritten working",
      "Spotify focus playlists",
      "Multiple active exams + urgency timer",
      "Priority response speed",
    ],
    cta: "Go Pro",
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "For top-grade hunters and full-on offer holders.",
    price: "AED 129.99",
    cadence: "/ month",
    Icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited AI tutor — no message cap",
      "Deep-dive notes (longer, more worked examples)",
      "Adaptive mock papers tuned to your weak spots",
      "Predicted-paper generator (exam-season exclusive)",
      "1-on-1 strategy plan from your diagnostic",
      "Early access to every new feature",
      "Direct line to the Apex team",
    ],
    cta: "Go Advanced",
  },
];

const TierCard = ({ tier }: { tier: Tier }) => {
  const { Icon } = tier;
  return (
    <div
      className={`relative surface p-6 md:p-8 flex flex-col h-full transition-transform hover:-translate-y-0.5 ${
        tier.highlight
          ? "border-primary/60 ring-2 ring-primary/40 shadow-2xl"
          : ""
      }`}
    >
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full shadow">
          {tier.badge}
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            tier.highlight ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{tier.name}</div>
      </div>
      <h3 className="text-2xl font-extrabold mt-2">{tier.tagline}</h3>
      <div className="mt-5 flex items-baseline gap-1.5">
        <div className="text-5xl font-extrabold tabular">{tier.price}</div>
        <div className="text-sm text-muted-foreground">{tier.cadence}</div>
      </div>

      <ul className="mt-6 space-y-2.5 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${tier.highlight ? "text-primary" : "text-success"}`}
            />
            <span className="text-foreground/90 leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => toast.info("Plans launch soon — you're on early access.")}
        className={`mt-7 w-full ${
          tier.highlight ? "btn-primary" : tier.id === "advanced" ? "bg-foreground text-background hover:bg-foreground/90" : ""
        }`}
        variant={tier.highlight || tier.id === "advanced" ? "default" : "outline"}
        size="lg"
      >
        {tier.cta}
      </Button>
      {tier.id === "free" && (
        <div className="mt-3 text-[11px] text-center text-muted-foreground">No card. No catch.</div>
      )}
    </div>
  );
};

const Pricing = () => {
  return (
    <AppLayout>
      <div className="px-6 md:px-10 py-10 md:py-14 max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-10 md:mb-14">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Plans &amp; Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pick the plan that matches your run-up.</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            All plans include the roadmap, the AI tutor, and your daily focus loop. Upgrade when you're ready to go unlimited.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {TIERS.map(t => <TierCard key={t.id} tier={t} />)}
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground font-mono">
          Cancel anytime. VAT included. Pause your subscription during holidays.
        </div>
      </div>
    </AppLayout>
  );
};

export default Pricing;
