import { useNavigate } from "react-router-dom";
import { Sparkles, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LIMIT_LABELS, type LimitKey, type Plan } from "@/lib/plan";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  limitKey: LimitKey;
  plan: Plan;
  used?: number;
  limit?: number;
  /** Optional title override */
  title?: string;
  /** Optional body override */
  body?: string;
}

export const UpgradeModal = ({ open, onClose, limitKey, plan, used, limit, title, body }: UpgradeModalProps) => {
  const navigate = useNavigate();
  if (!open) return null;

  const proOnly = limit === 0;
  const label = LIMIT_LABELS[limitKey];

  const headline =
    title ??
    (proOnly
      ? `${label[0].toUpperCase() + label.slice(1)} is a Pro feature`
      : `You've used all your ${label}`);

  const description =
    body ??
    (proOnly
      ? `Upgrade to Pro to unlock ${label}, unlimited practice questions, the AI tutor, and more.`
      : plan === "free"
        ? `You've hit the free tier limit (${used ?? limit}/${limit}). Upgrade to Pro for unlimited access — AED 39.99/month or AED 299/year.`
        : `You've reached your plan's limit. Upgrade for unlimited access.`);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold leading-tight">{headline}</h2>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5">{description}</p>

        <div className="rounded-lg bg-muted/50 p-3 mb-5 text-sm">
          <div className="font-medium mb-1">Pro includes</div>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• Unlimited AI tutor + photo upload marking</li>
            <li>• Unlimited practice questions & topic notes</li>
            <li>• Mock papers with AI marking</li>
            <li>• Multi-subject roadmaps</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Maybe later
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onClose();
              navigate("/pricing");
            }}
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
};
