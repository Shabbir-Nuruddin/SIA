import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GRADE_BOUNDARY_LINKS, type Board } from "@/lib/pastPapers";
import { ChevronDown, ChevronRight, ExternalLink, FileText, ClipboardCheck } from "lucide-react";

type SubjectKey = "Chemistry" | "Biology" | "Physics" | "Mathematics";

const SUBJECTS: Record<SubjectKey, { emoji: string; units: string[] }> = {
  Chemistry: { emoji: "🧪", units: ["Unit-1", "Unit-2", "Unit-3", "Unit-4", "Unit-5", "Unit-6"] },
  Biology: { emoji: "🧬", units: ["Unit-1", "Unit-2", "Unit-3", "Unit-4", "Unit-5", "Unit-6"] },
  Physics: { emoji: "⚛️", units: ["Unit-1", "Unit-2", "Unit-3", "Unit-4", "Unit-5", "Unit-6"] },
  Mathematics: {
    emoji: "📐",
    units: [
      "Pure-Mathematics-1",
      "Pure-Mathematics-2",
      "Pure-Mathematics-3",
      "Pure-Mathematics-4",
      "Statistics-1",
      "Statistics-2",
      "Mechanics-1",
      "Mechanics-2",
    ],
  },
};

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"] as const;
const SESSIONS = ["January", "June", "October"] as const;

const PMT_BASE = "https://www.physicsandmathstutor.com/pdf-pages/?pdf=";

function generateLink(
  subject: SubjectKey,
  unit: string,
  year: string,
  session: string,
  type: "QP" | "MS",
) {
  const inner = `https://pmt.physicsandmathstutor.com/download/${subject}/A-level/Past-Papers/Edexcel-IAL/2018-spec/${unit}/${type}/${session} ${year} (IAL) ${type}.pdf`;
  return PMT_BASE + encodeURIComponent(inner);
}

const prettyUnit = (u: string) => u.replace(/-/g, " ");

const PastPapers = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>("edexcel-ial");
  const [subject, setSubject] = useState<SubjectKey>("Chemistry");
  const [unit, setUnit] = useState<string>(SUBJECTS["Chemistry"].units[0]);
  const [openYear, setOpenYear] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("exam_board").eq("id", user.id).single().then(({ data }) => {
      if (data?.exam_board === "cie") setBoard("cie");
      else setBoard("edexcel-ial");
    });
  }, [user]);

  useEffect(() => {
    setUnit(SUBJECTS[subject].units[0]);
    setOpenYear(null);
  }, [subject]);

  const gb = GRADE_BOUNDARY_LINKS[board];

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Past Papers</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Real papers. Real mark schemes.</h1>
          <p className="text-muted-foreground mt-1">
            Pick a subject and unit — every paper, every mark scheme, generated on demand.
          </p>
        </div>

        <div className="surface p-4 mb-6 grid md:grid-cols-3 gap-3">
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

          {board === "edexcel-ial" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectKey)}
                  className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
                >
                  {(Object.keys(SUBJECTS) as SubjectKey[]).map((s) => (
                    <option key={s} value={s}>
                      {SUBJECTS[s].emoji}  {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mt-1 w-full h-10 rounded-md bg-background border border-input px-3 text-sm"
                >
                  {SUBJECTS[subject].units.map((u) => (
                    <option key={u} value={u}>
                      {prettyUnit(u)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {board === "edexcel-ial" ? (
          <div className="surface overflow-hidden mb-8">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-3 border-b border-border bg-muted/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
              <div>Year / Session</div>
              <div className="w-32 text-center">Question Paper</div>
              <div className="w-32 text-center">Mark Scheme</div>
            </div>

            {YEARS.map((year) => {
              const isOpen = openYear === year;
              return (
                <div key={year} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => setOpenYear(isOpen ? null : year)}
                    className="w-full grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-3 items-center hover:bg-muted/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {isOpen ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      {year}
                    </div>
                    <div className="w-32 text-center text-xs text-muted-foreground">3 sessions</div>
                    <div className="w-32 text-center text-xs text-muted-foreground">3 sessions</div>
                  </button>

                  {isOpen && (
                    <div className="bg-muted/20">
                      {SESSIONS.map((session) => (
                        <div
                          key={session}
                          className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 items-center border-t border-border/60"
                        >
                          <div className="pl-6 text-sm">{session}</div>
                          <a
                            href={generateLink(subject, unit, year, session, "QP")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-32 inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-primary/10 text-primary text-xs font-mono hover:bg-primary/20 transition-colors"
                          >
                            <FileText className="h-3 w-3" /> QP
                          </a>
                          <a
                            href={generateLink(subject, unit, year, session, "MS")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-32 inline-flex items-center justify-center gap-1.5 h-8 rounded-md bg-accent/40 text-foreground text-xs font-mono hover:bg-accent/60 transition-colors"
                          >
                            <ClipboardCheck className="h-3 w-3" /> MS
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="px-4 py-3 text-[11px] text-muted-foreground bg-muted/20 border-t border-border">
              Links open Physics & Maths Tutor's PDF viewer with the official Edexcel paper. If a session wasn't sat in a given year, the page will say so.
            </div>
          </div>
        ) : (
          <div className="surface p-6 mb-8">
            <div className="font-semibold mb-1">Cambridge (CIE) A Level</div>
            <p className="text-sm text-muted-foreground mb-4">
              CIE publishes papers on their official site — open the subject page for your syllabus.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { code: "9701", title: "Chemistry 9701", url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-chemistry-9701/past-papers/" },
                { code: "9700", title: "Biology 9700", url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-biology-9700/past-papers/" },
                { code: "9702", title: "Physics 9702", url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-physics-9702/past-papers/" },
                { code: "9709", title: "Mathematics 9709", url: "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/" },
              ].map((r) => (
                <a key={r.code} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="surface surface-hover p-4 group flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-primary">{r.code}</div>
                    <div className="font-semibold text-sm">{r.title}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary" />
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground/60 mb-4 italic">
          We do not host any PDFs. All papers are accessed from external educational sources.
        </p>

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
