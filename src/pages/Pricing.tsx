import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate, useSearchParams } from "react-router-dom";
import { friendlyCheckoutError } from "@/lib/dodo";

type Currency = "AED" | "GBP" | "USD";

// Conversion rates relative to AED (approximate, for display).
const RATES: Record<Currency, { symbol: string; rate: number; code: string }> = {
  AED: { symbol: "AED", rate: 1, code: "AED" },
  GBP: { symbol: "£", rate: 0.2126, code: "GBP" }, // 39.99 AED ≈ £8.50
  USD: { symbol: "$", rate: 0.2723, code: "USD" }, // 39.99 AED ≈ $10.89
};

const formatPrice = (aed: number, currency: Currency) => {
  const { symbol, rate } = RATES[currency];
  if (aed === 0) return `${currency === "AED" ? "AED " : symbol}0`;
  const v = aed * rate;
  // Round nicely: GBP/USD show .XX, AED keeps .99 style
  const rounded = currency === "AED" ? v.toFixed(2) : (Math.round(v * 100) / 100).toFixed(2);
  return currency === "AED" ? `AED ${rounded}` : `${symbol}${rounded}`;
};

interface Tier {
  id: "free" | "pro" | "advanced";
  name: string;
  tagline: string;
  monthlyAED: number;
  annualAED?: number;
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
    tagline: "Get a real taste of Make Me Revise.",
    monthlyAED: 0,
    Icon: Sparkles,
    features: [
      "Roadmap for 1 subject",
      "10 AI-marked topical questions / day",
      "AI tutor — 5 messages total (try it out)",
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
    monthlyAED: 39.99,
    annualAED: 299,
    Icon: Zap,
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Starter",
      "Photo upload: AI marks your handwritten working",
      "Unlimited subjects + roadmap rebuilds",
      "Unlimited AI-marked topical questions",
      "Unlimited mock papers with examiner feedback",
      "Unlimited notes — every topic, every unit",
      "AI tutor — 200 messages / day",
      "Expanded built-in focus & lofi library",
      "Multiple active exams + urgency timer",
      "Priority response speed",
    ],
    cta: "Go Pro",
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "For top-grade hunters and full-on offer holders.",
    monthlyAED: 129.99,
    Icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited AI tutor — no message cap",
      "Deep-dive notes (longer, more worked examples)",
      "Adaptive mock papers tuned to your weak spots",
      "Predicted-paper generator (exam-season exclusive)",
      "Full AI exam strategy report — personalised to your diagnostic results, weak topics, and target grade",
      "Early access to every new feature",
    ],
    cta: "Go Advanced",
  },
];

const TierCard = ({ tier, currency }: { tier: Tier; currency: Currency }) => {
  const { Icon } = tier;
  const { isPro, upgrade } = useSubscription();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (tier.id === "free") {
      navigate("/dashboard");
      return;
    }
    if (tier.id === "pro") {
      if (isPro) {
        toast.success("You're already on Pro 🎉");
        return;
      }
      try {
        await upgrade();
      } catch (err) {
        console.error(err);
        toast.error(friendlyCheckoutError(err), {
          action: { label: "Retry", onClick: () => void upgrade().catch((e) => toast.error(friendlyCheckoutError(e))) },
        });
      }
      return;
    }
    toast.info("Advanced launches soon — you're on early access.");
  };
  const priceLabel = formatPrice(tier.monthlyAED, currency);
  const annualLabel = tier.annualAED ? formatPrice(tier.annualAED, currency) : null;

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
      <div className="mt-5 flex items-baseline gap-1.5 flex-wrap">
        <div className="text-5xl font-extrabold tabular">{priceLabel}</div>
        <div className="text-sm text-muted-foreground">
          {tier.monthlyAED === 0 ? "forever" : "/ month"}
        </div>
      </div>
      {annualLabel && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">or</span>{" "}
          <span className="font-semibold text-foreground">{annualLabel}</span>{" "}
          <span className="text-muted-foreground">/ year</span>{" "}
          <span className="ml-1 inline-block px-1.5 py-0.5 rounded bg-success/15 text-success text-[10px] font-bold uppercase tracking-wider">
            Save 38%
          </span>
        </div>
      )}

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
        onClick={handleClick}
        className={`mt-7 w-full ${
          tier.highlight ? "btn-primary" : tier.id === "advanced" ? "bg-foreground text-background hover:bg-foreground/90" : ""
        }`}
        variant={tier.highlight || tier.id === "advanced" ? "default" : "outline"}
        size="lg"
      >
        {tier.id === "pro" && isPro ? "Current plan" : tier.cta}
      </Button>
      {tier.id === "free" && (
        <div className="mt-3 text-[11px] text-center text-muted-foreground">No card. No catch.</div>
      )}
    </div>
  );
};

const CurrencyToggle = ({ currency, onChange }: { currency: Currency; onChange: (c: Currency) => void }) => {
  const options: Currency[] = ["AED", "GBP", "USD"];
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-1">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
            currency === c
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

const Pricing = () => {
  const [currency, setCurrency] = useState<Currency>("AED");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("checkout") !== "retry") return;
    toast.info("Payment was not completed. You can retry checkout here without starting over.");
    searchParams.delete("checkout");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <AppLayout>
      <div className="px-6 md:px-10 py-10 md:py-14 max-w-6xl mx-auto animate-fade-in">
        <div className="relative mb-10 md:mb-14">
          <div className="absolute right-0 top-0 hidden md:block">
            <CurrencyToggle currency={currency} onChange={setCurrency} />
          </div>
          <div className="text-center">
            <div className="text-xs text-primary font-mono uppercase tracking-widest mb-3 inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Plans &amp; Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pick the plan that matches your run-up.</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              SaveMyExams gives you notes and questions. Make Me Revise gives you a complete daily plan, AI marking, and a roadmap that thinks for you.
            </p>
            <div className="mt-5 md:hidden flex justify-center">
              <CurrencyToggle currency={currency} onChange={setCurrency} />
            </div>
          </div>
        </div>

        <div className="mb-6 max-w-2xl mx-auto rounded-2xl border-2 border-dashed border-primary/60 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="text-[11px] uppercase tracking-widest font-mono text-primary font-bold mb-2">🔥 Launch offer — first 100 users only</div>
          <div className="text-2xl md:text-3xl font-extrabold mb-1">50% off your first month</div>
          <div className="text-sm text-muted-foreground">
            Use code <span className="font-mono font-extrabold text-primary text-base bg-background/40 px-2 py-0.5 rounded border border-primary/40">REVISE50</span> at checkout
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Pro is <span className="font-semibold text-foreground">AED 39.99/month before VAT</span>. <span className="font-semibold text-foreground">5-day free trial</span> — you are only charged after the trial ends, and you can cancel anytime before then.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {TIERS.map(t => <TierCard key={t.id} tier={t} currency={currency} />)}
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground font-mono">
          Cancel anytime. AED 39.99/month before VAT. 5-day free trial — money is only deducted after the trial period. Pause your subscription during holidays.
        </div>
      </div>
    </AppLayout>
  );
};

export default Pricing;
