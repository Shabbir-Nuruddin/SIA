import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GRADE_BOUNDARY_LINKS, type Board } from "@/lib/pastPapers";
import { ExternalLink } from "lucide-react";

type SubjectKey = "Chemistry" | "Biology" | "Physics" | "Mathematics";

interface PaperLink {
  label: string;   // e.g. "Unit 1" or "Pure 1"
  url: string;
}

// =====================================================================
// Direct links to past-paper hub pages on Physics & Maths Tutor.
// Each link is the page that already lists every year + mark scheme,
// so we just hand the student straight to it.
// =====================================================================

const EDEXCEL_LINKS: Record<SubjectKey, PaperLink[]> = {
  Chemistry: [
    { label: "Unit 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-1/" },
    { label: "Unit 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-2/" },
    { label: "Unit 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-3/" },
    { label: "Unit 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-4/" },
    { label: "Unit 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-5/" },
    { label: "Unit 6", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-unit-6/" },
  ],
  Biology: [
    { label: "Unit 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-1/" },
    { label: "Unit 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-2/" },
    { label: "Unit 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-3/" },
    { label: "Unit 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-4/" },
    { label: "Unit 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-5/" },
    { label: "Unit 6", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-unit-6/" },
  ],
  Physics: [
    { label: "Unit 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-1/" },
    { label: "Unit 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-2/" },
    { label: "Unit 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-3/" },
    { label: "Unit 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-4/" },
    { label: "Unit 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-5/" },
    { label: "Unit 6", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-unit-6/" },
  ],
  Mathematics: [
    { label: "Pure 1 (C1)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/c1-edexcel/" },
    { label: "Pure 2 (C2)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/c2-edexcel/" },
    { label: "Pure 3 (C3)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/c3-edexcel/" },
    { label: "Further Pure 1 (FP1)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/fp1-edexcel/" },
    { label: "Further Pure 2 (FP2)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/fp2-edexcel/" },
    { label: "Further Pure 3 (FP3)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/fp3-edexcel/" },
    { label: "Mechanics 1 (M1)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/m1-edexcel/" },
    { label: "Mechanics 2 (M2)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/m2-edexcel/" },
    { label: "Mechanics 3 (M3)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/m3-edexcel/" },
    { label: "Statistics 1 (S1)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/s1-edexcel/" },
    { label: "Statistics 2 (S2)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/s2-edexcel/" },
    { label: "Statistics 3 (S3)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/s3-edexcel/" },
    { label: "Decision 1 (D1)", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/d1-edexcel/" },
  ],
};

const CIE_LINKS: Record<SubjectKey, PaperLink[]> = {
  Chemistry: [
    { label: "Paper 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-1/" },
    { label: "Paper 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-2/" },
    { label: "Paper 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-3/" },
    { label: "Paper 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-4/" },
    { label: "Paper 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-5/" },
  ],
  Biology: [
    { label: "Paper 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/cie-paper-1/" },
    { label: "Paper 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/cie-paper-2/" },
    { label: "Paper 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/cie-paper-3/" },
    { label: "Paper 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/cie-paper-4/" },
    { label: "Paper 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-biology/cie-paper-5/" },
  ],
  Physics: [
    { label: "Paper 1", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-1/" },
    { label: "Paper 2", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-2/" },
    { label: "Paper 3", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-3/" },
    { label: "Paper 4", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-4/" },
    { label: "Paper 5", url: "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-5/" },
  ],
  Mathematics: [
    { label: "Pure 1", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-1/" },
    { label: "Pure 2", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-2/" },
    { label: "Pure 3", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-3/" },
    { label: "Further Pure 1", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-fp1/" },
    { label: "Further Pure 2", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-fp2/" },
    { label: "Mechanics 1", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-4" },
    { label: "Mechanics 2", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-5/" },
    { label: "Statistics 1", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-6/" },
    { label: "Statistics 2", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-paper-7/" },
    { label: "Further Mechanics", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-fm/" },
    { label: "Further Probability & Statistics", url: "https://www.physicsandmathstutor.com/a-level-maths-papers/cie-fps/" },
  ],
};

const SUBJECT_META: Record<SubjectKey, { emoji: string }> = {
  Chemistry: { emoji: "🧪" },
  Biology: { emoji: "🧬" },
  Physics: { emoji: "⚛️" },
  Mathematics: { emoji: "📐" },
};

const PastPapers = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>("edexcel-ial");
  const [subject, setSubject] = useState<SubjectKey>("Chemistry");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie");
      else setBoard("edexcel-ial");
    });
  }, [user]);

  const links = useMemo<PaperLink[]>(() => {
    return board === "cie" ? CIE_LINKS[subject] : EDEXCEL_LINKS[subject];
  }, [board, subject]);

  const gb = GRADE_BOUNDARY_LINKS[board];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Past Papers</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Real papers. Real mark schemes.</h1>
          <p className="text-muted-foreground mt-1">
            Pick a subject and unit — every paper opens in a new tab, ready to download.
          </p>
        </div>

        <div className="surface p-4 mb-6 grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Board</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value as Board)}
              className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
            >
              <option value="edexcel-ial">Edexcel IAL</option>
              <option value="cie">Cambridge (CIE)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectKey)}
              className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
            >
              {(Object.keys(SUBJECT_META) as SubjectKey[]).map((s) => (
                <option key={s} value={s}>
                  {SUBJECT_META[s].emoji}  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface surface-hover p-4 group flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-primary">
                  {board === "cie" ? "CIE" : "Edexcel IAL"} · {subject}
                </div>
                <div className="font-semibold text-sm mt-0.5">{l.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">All years, question papers + mark schemes.</div>
              </div>
              <ExternalLink className="h-4 w-4 text-primary shrink-0" />
            </a>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mb-6 italic">
          Papers open on an external site — we don't host any PDFs ourselves.
        </p>

        <a
          href={gb.url}
          target="_blank"
          rel="noopener noreferrer"
          className="surface surface-hover p-5 inline-flex items-center gap-3 w-full md:w-auto"
        >
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
