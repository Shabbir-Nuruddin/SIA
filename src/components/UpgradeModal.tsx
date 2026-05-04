import { useNavigate } from "react-router-dom";
import { Sparkles, X, Loader2, Check, Crown, Zap, Copy, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LIMIT_LABELS, type LimitKey, type Plan } from "@/lib/plan";
import { useSubscription } from "@/hooks/useSubscription";
import { detectDefaultCurrency, formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  limitKey: LimitKey;
  plan: Plan;
  used?: number;
  limit?: number;
  title?: string;
  body?: string;
}

const FEATURE_COPY: Partial<Record<LimitKey, { headline: string; sub: string }>> = {
  photo_upload: {
    headline: "Snap your working. We'll mark it.",
    sub: "Upload a photo of your handwritten answer and the AI marks it line-by-line — exactly like an examiner.",
  },
  tutor_messages: {
    headline: "Your private tutor — on tap.",
    sub: "Unlimited step-by-step explanations, worked solutions, and concept breakdowns — 24/7.",
  },
  questions_per_day: {
    headline: "Practise as much as you want.",
    sub: "Unlimited exam-style questions with AI marking and model answers.",
  },
  notes_per_week: {
    headline: "Notes for every topic.",
    sub: "Generate clean, syllabus-aligned notes for any chapter, instantly.",
  },
  mock_papers: {
    headline: "Sit a real mock — anytime.",
    sub: "Full mock papers timed and AI-marked. See exactly where you lost marks.",
  },
  subjects: {
    headline: "Add every subject you sit.",
    sub: "Unlimited subjects and roadmap rebuilds when your plan changes.",
  },
};

export const UpgradeModal = ({ open, onClose, limitKey, plan, used, limit, title, body }: UpgradeModalProps) => {
  const navigate = useNavigate();
  const { upgrade } = useSubscription();
  const [busy, setBusy] = useState(false);
  const promoPrice = useMemo(() => formatCurrency(19.99, detectDefaultCurrency()), []);
  if (!open) return null;

  const handleUpgrade = async () => {
    setBusy(true);
    try {
      await upgrade();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Checkout could not open right now. Please try again in a minute.");
      navigate("/pricing");
    } finally {
      setBusy(false);
    }
  };

  const copy = FEATURE_COPY[limitKey];
  const proOnly = limit === 0;
  const headline =
    title ?? copy?.headline ??
    (proOnly
      ? `${LIMIT_LABELS[limitKey]} is a Pro feature`
      : `You've used all your ${LIMIT_LABELS[limitKey]}`);

  const description =
    body ?? copy?.sub ??
    (plan === "free"
      ? `You've hit the free tier limit (${used ?? limit}/${limit}). Upgrade to Pro for unlimited access.`
      : `You've reached your plan's limit. Upgrade for unlimited access.`);

  const copyCode = () => {
    navigator.clipboard.writeText("REVISE50");
    toast.success("Promo code copied — REVISE50");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.45)] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow / hero band */}
        <div
          className="relative px-6 pt-7 pb-6 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)/0.25) 0%, hsl(var(--accent)/0.18) 60%, transparent 100%)",
          }}
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
              <Crown className="h-3 w-3" /> Make Me Revise Pro
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
              <Flame className="h-3 w-3" /> Limited launch
            </div>
          </div>

          <h2 className="relative text-2xl md:text-[26px] font-extrabold leading-tight tracking-tight mb-2">
            {headline}
          </h2>
          <p className="relative text-sm text-muted-foreground leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-5">
            {[
              "Photo upload marking",
              "Unlimited AI tutor",
              "Unlimited questions",
              "Full mock papers",
              "Notes — every topic",
              "Multi-subject roadmaps",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs">
                <div className="h-4 w-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5" />
                </div>
                <span className="text-foreground/90">{f}</span>
              </div>
            ))}
          </div>

          {/* Promo code — eye-catching */}
          <button
            onClick={copyCode}
            className="w-full group relative overflow-hidden rounded-xl border-2 border-dashed border-primary/60 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 p-3.5 mb-4 text-left hover:border-primary transition"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                  <Zap className="h-3 w-3" /> 50% off — first 100 users
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-extrabold text-xl tracking-wider text-primary">REVISE50</span>
                  <span className="text-[11px] text-muted-foreground">enter it at checkout</span>
                </div>
              </div>
              <div className="shrink-0 h-9 w-9 rounded-lg border border-primary/40 bg-background/40 flex items-center justify-center text-primary group-hover:scale-105 transition">
                <Copy className="h-4 w-4" />
              </div>
            </div>
          </button>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 px-1">
            <span>From <span className="font-bold text-foreground">AED 19.99</span> first month</span>
            <span>Cancel anytime</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Maybe later
            </Button>
            <Button
              className="flex-1 btn-primary font-bold"
              disabled={busy}
              onClick={handleUpgrade}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Unlock Pro</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
