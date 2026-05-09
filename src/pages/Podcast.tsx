import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getSubjectsForBoard, SubjectCode } from "@/lib/subjects";
import { Headphones, Loader2 } from "lucide-react";

interface EnrolledUnit {
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
}

const Podcast = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const [units, setUnits] = useState<EnrolledUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const subjects = getSubjectsForBoard(board);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select("exam_board").eq("id", user.id).single(),
      supabase.from("user_subjects").select("subject,unit_number,unit_name").eq("user_id", user.id).order("subject").order("unit_number"),
    ]).then(([profile, enrolled]) => {
      setBoard(profile.data?.exam_board === "cie" ? "cie" : "edexcel-ial");
      setUnits((enrolled.data || []) as EnrolledUnit[]);
      setLoading(false);
    });
  }, [user]);

  const grouped = useMemo(() => {
    const map = new Map<SubjectCode, EnrolledUnit[]>();
    units.forEach((u) => map.set(u.subject, [...(map.get(u.subject) || []), u]));
    return Array.from(map.entries());
  }, [units]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-sm text-primary font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <Headphones className="h-3.5 w-3.5" /> Podcast
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Revision podcast topics.</h1>
          <p className="text-muted-foreground mt-1">Your subjects and subtopics, ready for the podcast feature.</p>
        </div>

        {loading ? (
          <div className="surface p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading topics…
          </div>
        ) : (
          <div className="space-y-5">
            {grouped.map(([subject, subjectUnits]) => (
              <section key={subject} className="surface p-5">
                <h2 className="text-lg font-bold mb-4">{subjects[subject]?.emoji} {subjects[subject]?.name}</h2>
                <div className="space-y-4">
                  {subjectUnits.map((unit) => {
                    const meta = subjects[subject]?.units.find((u) => u.number === unit.unit_number);
                    return (
                      <div key={`${subject}-${unit.unit_number}`}>
                        <div className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
                          Unit {unit.unit_number} · {unit.unit_name}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(meta?.topics || []).map((topic) => (
                            <span key={topic} className="rounded-md border border-border bg-secondary/30 px-3 py-1.5 text-sm">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Podcast;
