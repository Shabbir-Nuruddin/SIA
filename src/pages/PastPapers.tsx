import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PAST_PAPER_RESOURCES, GRADE_BOUNDARY_LINKS, type Board } from "@/lib/pastPapers";
import { SUBJECTS } from "@/lib/subjects";
import { ExternalLink } from "lucide-react";

const PastPapers = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>("edexcel-ial");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie");
      else setBoard("edexcel-ial");
    });
  }, [user]);

  const resources = PAST_PAPER_RESOURCES.filter(r => r.board === board);
  const gb = GRADE_BOUNDARY_LINKS[board];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Past Papers</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Real papers. Real mark schemes.</h1>
          <p className="text-muted-foreground mt-1">Direct links to official board pages — every paper, every mark scheme, every examiner report.</p>
        </div>

        <div className="surface p-4 mb-6">
          <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Board</label>
          <select value={board} onChange={e => setBoard(e.target.value as Board)} className="mt-1 w-full md:w-72 h-10 rounded-md bg-background border border-input px-3 text-sm">
            <option value="edexcel-ial">Edexcel IAL</option>
            <option value="cie">Cambridge (CIE)</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {resources.map(r => {
            const meta = SUBJECTS[r.subject];
            return (
              <a key={r.spec_code} href={r.url} target="_blank" rel="noopener noreferrer"
                className="surface surface-hover p-5 group flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{meta.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-primary">{r.spec_code}</span>
                </div>
                <div className="font-semibold text-[15px] mb-1">{r.title}</div>
                <div className="text-xs text-muted-foreground flex-1">{r.description}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-primary group-hover:underline">
                  Open official page <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            );
          })}
        </div>

        <a href={gb.url} target="_blank" rel="noopener noreferrer"
          className="surface surface-hover p-5 inline-flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1">
            <div className="font-semibold">{gb.label}</div>
            <div className="text-xs text-muted-foreground">Latest grade thresholds and boundary marks.</div>
          </div>
          <ExternalLink className="h-4 w-4 text-primary" />
        </a>
      </div>
    </AppLayout>
  );
};

export default PastPapers;
