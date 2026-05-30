import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cancelProSubscription, friendlyCheckoutError } from "@/lib/dodo";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  type Currency,
  CURRENCY_OPTIONS,
  detectDefaultCurrency,
  formatCurrency as formatPrice,
} from "@/lib/currency";

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
      "Priority access to more features as they launch",
    ],
    cta: "Coming soon",
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
    toast.info("Advanced is coming soon with more features — deeper analytics, smarter mocks, and extra AI tutor power.");
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
        {tier.id === "pro" ? (
          <>
            <div className="text-5xl font-extrabold tabular">{formatPrice(tier.monthlyAED / 2, currency)}</div>
            <div className="text-lg font-semibold text-muted-foreground line-through tabular">{priceLabel}</div>
            <div className="text-sm text-muted-foreground">/ first month</div>
            <span className="ml-1 inline-block px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-wider">
              50% off — code REVISE50
            </span>
          </>
        ) : (
          <>
            <div className="text-5xl font-extrabold tabular">{priceLabel}</div>
            <div className="text-sm text-muted-foreground">
              {tier.monthlyAED === 0 ? "forever" : "/ month"}
            </div>
          </>
        )}
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
        className={`mt-7 w-full ${tier.id === "free" ? "" : "h-12"}`}
        variant={tier.highlight ? "flip" : tier.id === "advanced" ? "flipDark" : "outline"}
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
  const options: Currency[] = CURRENCY_OPTIONS;
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
  const [currency, setCurrency] = useState<Currency>(() => detectDefaultCurrency());
  const [searchParams, setSearchParams] = useSearchParams();
  const { upgrade, isPro, inTrial, refresh } = useSubscription();
  const [cancellingPlan, setCancellingPlan] = useState(false);

  const cancelPlan = async () => {
    setCancellingPlan(true);
    try {
      const message = await cancelProSubscription();
      await refresh();
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We could not cancel your subscription right now. Please try again in a minute.");
    } finally {
      setCancellingPlan(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("checkout") !== "retry") return;
    const errorText = searchParams.get("error") ?? searchParams.get("error_code") ?? searchParams.get("message") ?? searchParams.get("reason");
    toast.error(errorText ? friendlyCheckoutError(errorText) : "Payment was not completed. Your card was not charged.", {
      action: { label: "Retry", onClick: () => void upgrade().catch((err) => toast.error(friendlyCheckoutError(err))) },
    });
    searchParams.delete("checkout");
    searchParams.delete("error");
    searchParams.delete("error_code");
    searchParams.delete("message");
    searchParams.delete("reason");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, upgrade]);

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
          <div className="text-[11px] uppercase tracking-widest font-mono text-primary font-bold mb-2">🔥 Launch offer — first 100 users only</div>
          <div className="text-2xl md:text-3xl font-extrabold mb-1">50% off your first month</div>
          <div className="text-sm text-muted-foreground">
            Use code <span className="font-mono font-extrabold text-primary text-base bg-background/40 px-2 py-0.5 rounded border border-primary/40">REVISE50</span> at checkout
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Pro is <span className="font-semibold text-foreground">AED 39.99/month before VAT</span>. <span className="font-semibold text-foreground">3-day free trial</span> — you are only charged after the trial ends, and you can cancel anytime before then.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {TIERS.map(t => <TierCard key={t.id} tier={t} currency={currency} />)}
        </div>

        {isPro && (
          <div className="mt-8 surface p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold">Manage your Pro plan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {inTrial ? "Cancel before the 3-day trial ends and no money will be deducted." : "Cancel anytime. Your subscription will stop renewing."}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-urgent border-urgent/40 hover:bg-urgent/10 hover:text-urgent">
                  Cancel {inTrial ? "trial" : "subscription"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel {inTrial ? "trial" : "subscription"}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will not be charged again. If you are in the 3-day trial, cancelling now stops it before any money is deducted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                  <AlertDialogAction onClick={cancelPlan} disabled={cancellingPlan} className="bg-urgent hover:bg-urgent/90 text-urgent-foreground">
                    {cancellingPlan ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Cancel plan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        <div className="mt-16">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2 text-center">FAQs</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">Quick answers before you upgrade.</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto surface px-5">
            {[
              { q: "How does the 3-day free trial work?", a: "When you start Pro, you get full Pro access for 3 days. You are not charged during the trial. Cancel anytime before day 3 and you pay nothing." },
              { q: "How much is Pro after the trial?", a: "AED 39.99 per month before VAT. VAT is added at checkout based on your country. Annual is AED 299/year (saves about 38%)." },
              { q: "Can I cancel anytime?", a: "Yes — open this page (or Settings) once you are on Pro and use the Cancel button. Your Pro access stays until the end of the current billing period, and you will not be charged again." },
              { q: "What happens if I cancel and come back later?", a: "Your free trial only applies once. If you cancel and re-subscribe later, you will be charged immediately when you resubscribe — no second free trial." },
              { q: "Is the AI tutor really unlimited on Pro?", a: "Pro includes 200 AI tutor messages per day, unlimited AI-marked topical questions, unlimited mock papers, and unlimited notes. Free is capped (5 tutor messages total, 10 questions/day, 3 notes/week)." },
              { q: "Do you support my exam board?", a: "Yes — Edexcel IAL and Cambridge (CIE) for A-Level Biology, Chemistry, Physics and Maths. More boards rolling out." },
              { q: "What payment methods do you accept?", a: "Credit and debit cards via our secure payment provider. We do not store your card details." },
              { q: "I had a card error at checkout — what now?", a: "If your card was declined or had insufficient funds, no money was taken. Try another card, or contact your bank if it keeps happening, then click Retry on the pricing page." },
            ].map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border last:border-0">
                <AccordionTrigger className="text-left font-semibold text-[15px]">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground font-mono">
          Cancel anytime. AED 39.99/month before VAT. 3-day free trial — money is only deducted after the trial period.
        </div>
      </div>
    </AppLayout>
  );
};

export default Pricing;
