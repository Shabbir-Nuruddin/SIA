import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, ChevronRight, ChevronLeft, Sparkles, Clock, BookOpen } from "lucide-react";
import { BOX_LABEL, isDue, makeCardKey, nextSchedule, type ReviewOutcome } from "@/lib/leitner";
import { toast } from "sonner";

export interface FlashcardInput {
  q: string;
  a: string;
}

interface FlashcardDeckProps {
  cards: FlashcardInput[];
  source: "notes" | "faq" | "roadmap";
  subject?: string | null;
  unit_number?: number | null;
  topic?: string | null;
  board?: string | null;
  /** When true, only show cards that are due now (plus brand-new cards). */
  dueOnly?: boolean;
  emptyHint?: string;
}

interface ReviewRow {
  id: string;
  card_key: string;
  box: number;
  due_at: string;
  correct_streak: number;
  total_reviews: number;
  total_correct: number;
}

export function FlashcardDeck({
  cards,
  source,
  subject,
  unit_number,
  topic,
  board,
  dueOnly = false,
  emptyHint,
}: FlashcardDeckProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Record<string, ReviewRow>>({});
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);

  // Build stable keys
  const keyed = useMemo(
    () =>
      cards
        .filter((c) => c?.q && c?.a)
        .map((c) => ({
          ...c,
          key: makeCardKey({ source, subject, unit_number, topic, question: c.q }),
        })),
    [cards, source, subject, unit_number, topic]
  );

  // Filter to due cards if requested. Cards without a review row are treated as due (new).
  const deck = useMemo(() => {
    if (!dueOnly) return keyed;
    return keyed.filter((c) => {
      const r = reviews[c.key];
      return !r || isDue(r.due_at);
    });
  }, [keyed, reviews, dueOnly]);

  // Load existing review state
  useEffect(() => {
    if (!user || keyed.length === 0) return;
    let cancelled = false;
    const keys = keyed.map((c) => c.key);
    supabase
      .from("flashcard_reviews")
      .select("id,card_key,box,due_at,correct_streak,total_reviews,total_correct")
      .eq("user_id", user.id)
      .in("card_key", keys)
      .then(({ data }) => {
        if (cancelled || !data) return;
        const map: Record<string, ReviewRow> = {};
        for (const r of data as ReviewRow[]) map[r.card_key] = r;
        setReviews(map);
      });
    return () => {
      cancelled = true;
    };
  }, [user, keyed]);

  // Reset index whenever the deck shrinks below current index
  useEffect(() => {
    if (index >= deck.length) {
      setIndex(0);
      setFlipped(false);
    }
  }, [deck.length, index]);

  if (keyed.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/50 p-8 text-center text-sm text-muted-foreground">
        <BookOpen className="h-6 w-6 mx-auto mb-2 opacity-60" />
        {emptyHint ?? "No flashcards available for this topic yet."}
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center text-sm">
        <Sparkles className="h-6 w-6 mx-auto mb-2 text-success" />
        <p className="font-semibold text-foreground">All caught up.</p>
        <p className="text-muted-foreground mt-1">
          No flashcards are due right now. Come back later to keep the streak going.
        </p>
      </div>
    );
  }

  const card = deck[Math.min(index, deck.length - 1)];
  const review = reviews[card.key];

  const submit = async (outcome: ReviewOutcome) => {
    if (!user || saving) return;
    setSaving(true);
    const currentBox = review?.box ?? 1;
    const { box, dueAt } = nextSchedule(currentBox, outcome);
    const isCorrect = outcome === "correct";
    const totalReviews = (review?.total_reviews ?? 0) + 1;
    const totalCorrect = (review?.total_correct ?? 0) + (isCorrect ? 1 : 0);
    const correctStreak = isCorrect ? (review?.correct_streak ?? 0) + 1 : 0;

    const payload = {
      user_id: user.id,
      source,
      card_key: card.key,
      subject: subject ?? null,
      unit_number: unit_number ?? null,
      topic: topic ?? null,
      board: board ?? null,
      question: card.q,
      answer: card.a,
      box,
      due_at: dueAt.toISOString(),
      last_reviewed_at: new Date().toISOString(),
      correct_streak: correctStreak,
      total_reviews: totalReviews,
      total_correct: totalCorrect,
    };

    try {
      if (review?.id) {
        await supabase
          .from("flashcard_reviews")
          .update(payload)
          .eq("id", review.id);
        setReviews((r) => ({
          ...r,
          [card.key]: { ...review, ...payload, id: review.id } as ReviewRow,
        }));
      } else {
        const { data, error } = await supabase
          .from("flashcard_reviews")
          .insert(payload)
          .select("id,card_key,box,due_at,correct_streak,total_reviews,total_correct")
          .single();
        if (error) throw error;
        if (data) {
          setReviews((r) => ({ ...r, [card.key]: data as ReviewRow }));
        }
      }
      if (isCorrect) {
        toast.success(`Boxed up. Next review in ${BOX_LABEL[box]}.`, { duration: 1500 });
      } else {
        toast.info("Back to Box 1. We'll show it again soon.", { duration: 1500 });
      }
    } catch (e: any) {
      toast.error("Couldn't save review. " + (e?.message ?? ""));
    } finally {
      setSaving(false);
      setFlipped(false);
      // advance
      if (dueOnly) {
        // The current card may drop out of the filter on next render; keep index
        setIndex((i) => Math.min(i, deck.length - 2 < 0 ? 0 : deck.length - 1));
      } else {
        setIndex((i) => (i + 1) % deck.length);
      }
    }
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  };

  const accuracy =
    review && review.total_reviews > 0
      ? Math.round((review.total_correct / review.total_reviews) * 100)
      : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>
          Card {Math.min(index, deck.length - 1) + 1} of {deck.length}
          {dueOnly ? " · due" : ""}
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Box {review?.box ?? 1} · {BOX_LABEL[review?.box ?? 1]}
          </span>
          {accuracy != null && <span>· {accuracy}% over {review!.total_reviews}</span>}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full rounded-2xl border border-border/70 bg-background-elevated p-6 md:p-8 text-left transition-shadow hover:shadow-md min-h-[200px] flex flex-col"
        aria-label="Flip flashcard"
      >
        <div className="text-[10px] uppercase tracking-widest font-mono text-primary mb-3">
          {flipped ? "Answer" : "Question"}
        </div>
        <div className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap flex-1">
          {flipped ? card.a : card.q}
        </div>
        <div className="text-[11px] text-muted-foreground mt-4 italic">
          Tap card to {flipped ? "see question" : "reveal answer"}
        </div>
      </button>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={prev} className="h-9 px-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {flipped ? (
          <>
            <Button
              onClick={() => submit("wrong")}
              variant="outline"
              size="sm"
              disabled={saving}
              className="h-9 px-3 text-xs border-urgent/40 text-urgent hover:bg-urgent/10"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Review again
            </Button>
            <Button
              onClick={() => submit("correct")}
              size="sm"
              disabled={saving}
              className="h-9 px-3 text-xs bg-primary hover:bg-primary/90"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Knew it
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setFlipped(true)}
            size="sm"
            className="h-9 px-3 text-xs bg-primary hover:bg-primary/90"
          >
            Reveal answer
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={next} className="h-9 px-2 ml-auto">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
