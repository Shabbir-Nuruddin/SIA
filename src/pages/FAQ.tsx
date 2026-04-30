import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EXAM_FAQS, type Board } from "@/lib/examFaqs";
import { SUBJECTS, type SubjectCode } from "@/lib/subjects";
import { Search, ChevronDown } from "lucide-react";

const BOARD_LABEL: Record<Board, string> = {
  "edexcel-ial": "Edexcel IAL",
  "cie": "Cambridge (CIE)",
};

const FAQPage = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>("edexcel-ial");
  const [subject, setSubject] = useState<SubjectCode | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie");
      else setBoard("edexcel-ial");
    });
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXAM_FAQS.filter(f =>
      f.board === board &&
      (subject === "all" || f.subject === subject) &&
      (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.topic.toLowerCase().includes(q))
    );
  }, [board, subject, query]);

  const grouped = useMemo(() => {
    const m: Record<string, typeof EXAM_FAQS> = {};
    for (const f of filtered) {
      const key = `${SUBJECTS[f.subject].name} · ${f.topic}`;
      (m[key] ||= []).push(f);
    }
    return m;
  }, [filtered]);

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Exam FAQs</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">The questions students always get wrong.</h1>
          <p className="text-muted-foreground mt-1">Mark-scheme phrasing, not approximations. Every answer carries the wording examiners look for.</p>
        </div>

        <div className="surface p-4 mb-6 grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Board</label>
            <select value={board} onChange={e => setBoard(e.target.value as Board)} className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
              <option value="edexcel-ial">Edexcel IAL</option>
              <option value="cie">Cambridge (CIE)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value as any)} className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm">
              <option value="all">All subjects</option>
              {Object.values(SUBJECTS).map(s => <option key={s.code} value={s.code}>{s.emoji} {s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. activation energy"
                className="w-full h-10 rounded-md bg-background border border-input pl-9 pr-3 text-sm" />
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 font-mono">{filtered.length} questions · {BOARD_LABEL[board]}</div>

        {Object.entries(grouped).map(([group, items]) => (
          <section key={group} className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">{group}</h2>
            <div className="space-y-2">
              {items.map(f => {
                const open = openId === f.id;
                return (
                  <div key={f.id} className="surface overflow-hidden">
                    <button onClick={() => setOpenId(open ? null : f.id)} className="w-full flex items-start gap-3 p-4 text-left hover:bg-card-hover transition-colors">
                      <ChevronDown className={`h-4 w-4 mt-0.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                      <span className="font-semibold flex-1 text-[15px]">{f.question}</span>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pl-11 space-y-3 text-sm animate-fade-in">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest font-mono text-success mb-1">Mark-scheme answer</div>
                          <p>{f.answer}</p>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest font-mono text-accent mb-1">Examiner note</div>
                          <p className="text-muted-foreground italic">{f.examiner_note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="surface p-8 text-center text-sm text-muted-foreground">No matches. Try a different subject or search term.</div>
        )}
      </div>
    </AppLayout>
  );
};

export default FAQPage;
