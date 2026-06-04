import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { ClarityLayout } from "@/components/ClarityCompass/ClarityLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { clarityDb } from "@/types/clarity-types";

interface ClarityResult {
  created_at: string;
}

export function ClarityCompassHome(): React.ReactElement {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lastResult, setLastResult] = useState<ClarityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLastResult = async (): Promise<void> => {
      const { data, error } = await clarityDb
        .from("clarity_results")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setLastResult(data as ClarityResult);
      }
      setLoading(false);
    };

    fetchLastResult();
  }, [user]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ClarityLayout>
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Compass className="w-10 h-10 text-primary" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Clarity Compass
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-12 max-w-xl">
            Discover careers you'll actually love — before you commit to one.
          </p>

          {/* Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full">
            {[
              { step: 1, title: "Tell us about you" },
              { step: 2, title: "Take the AI quiz" },
              { step: 3, title: "Get your career roadmap" },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-card border border-border rounded-lg p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">
                  Step {item.step}
                </div>
                <div className="text-sm text-foreground">{item.title}</div>
              </div>
            ))}
          </div>

          {/* Primary Button */}
          <Button
            onClick={() => navigate("/clarity-compass/onboarding")}
            className="mb-4 text-base px-6 py-6"
            size="lg"
          >
            Start my Clarity Journey →
          </Button>

          {/* Previous Results Button */}
          {!loading && lastResult && (
            <Button
              onClick={() => navigate("/clarity-compass/results")}
              variant="outline"
              className="mb-8"
              size="lg"
            >
              View my results · Last taken {formatDate(lastResult.created_at)}
            </Button>
          )}

          {/* Footer Text */}
          <p className="text-xs text-muted-foreground mt-8">
            Free for all SIA Smart Revision users. Retake anytime.
          </p>
        </div>
      </div>
    </ClarityLayout>
  );
}
