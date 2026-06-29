// Admin → Notes Auto-Generator.
//
// One ON/OFF switch that bulk-pre-generates revision notes for every topic on the
// Edexcel IGCSE + IAL specifications, one at a time, into the shared cache. It
// rides on the existing `ai-notes` edge function (so the automatic Gemini multi-
// key rotation does all the credit-juggling for free) and reads "what's done"
// straight from the shared cache, so it resumes cleanly after a reload.
//
// HOW IT RUNS: the loop lives in this page. While the switch is ON *and this tab
// is open*, it keeps generating. Close the tab and it pauses (the switch state is
// saved); reopen the panel and it resumes. For unattended multi-day runs, use
// scripts/bulk-generate-notes.mjs (same loop, headless) — see the note in the UI.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Sparkles, RefreshCw, KeyRound, Pause, CheckCircle2, AlertTriangle, Power } from "lucide-react";
import {
  AUTOGEN_BOARDS, buildAllJobs, fetchDoneKeys, getControl, setControl,
  generateOne, jobKey, boardLabel, NotesJob,
} from "@/lib/notesAutogen";

interface KeyStatus {
  keyNames: string[];
  totalKeys: number;
  currentIndex: number;
  currentKeyName: string | null;
  lastRotatedAt: string | null;
  lastError: string | null;
}

interface RunError { topic: string; subject: string; board: string; message: string; }

// When every key is rate-limited we back off before retrying the same topic.
// Free Gemini quotas reset daily, so a long pause is correct — we keep the run
// alive rather than burning through failed attempts.
const QUOTA_COOLDOWN_MS = 90_000;
const BETWEEN_TOPICS_MS = 1_200;

export default function NotesAutogen() {
  const jobs = useMemo(() => buildAllJobs(AUTOGEN_BOARDS), []);
  const total = jobs.length;

  const doneRef = useRef<Set<string>>(new Set());
  const skipRef = useRef<Set<string>>(new Set()); // hard-failed (non-quota) — don't loop forever
  const activeRef = useRef(false);                 // the loop reads this each tick

  const [version, setVersion] = useState(0);       // bump to re-render progress
  const bump = () => setVersion((v) => v + 1);

  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState<NotesJob | null>(null);
  const [errors, setErrors] = useState<RunError[]>([]);
  const [keyStatus, setKeyStatus] = useState<KeyStatus | null>(null);

  const doneCount = doneRef.current.size;
  const remaining = Math.max(0, total - doneCount);
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const loadKeyStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-ai-keys");
      if (!error && data) setKeyStatus(data);
    } catch { /* non-fatal */ }
  }, []);

  const refreshDone = useCallback(async () => {
    doneRef.current = await fetchDoneKeys(AUTOGEN_BOARDS);
    bump();
  }, []);

  // Initial load. If the switch was left ON, resume the run automatically.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [control] = await Promise.all([getControl(), refreshDone(), loadKeyStatus()]);
      if (cancelled) return;
      setEnabled(control.enabled);
      setLoading(false);
      if (control.enabled) startLoop();
    })();
    return () => {
      cancelled = true;
      activeRef.current = false; // stop the loop when leaving the page
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const step = 500;
      let waited = 0;
      const tick = () => {
        if (!activeRef.current || waited >= ms) return resolve();
        waited += step;
        setTimeout(tick, step);
      };
      tick();
    });

  const nextJob = (): NotesJob | null => {
    for (const j of jobs) {
      const k = jobKey(j);
      if (!doneRef.current.has(k) && !skipRef.current.has(k)) return j;
    }
    return null;
  };

  const startLoop = useCallback(() => {
    if (activeRef.current) return; // already running
    activeRef.current = true;
    setRunning(true);
    setPaused(false);

    (async () => {
      let sinceKeyRefresh = 0;
      while (activeRef.current) {
        const job = nextJob();
        if (!job) {
          setCurrent(null);
          activeRef.current = false;
          setRunning(false);
          toast.success("All Edexcel IGCSE + IAL topics are generated. 🎉");
          break;
        }
        setCurrent(job);
        setPaused(false);
        const res = await generateOne(job);
        if (!activeRef.current) break;

        if (res.ok) {
          doneRef.current.add(jobKey(job));
          await setControl({ last_topic: `${boardLabel(job.board)} · ${job.subjectName} · ${job.topic}` });
        } else if (res.quota) {
          // Every key is rate-limited right now. Pause, surface it, retry later.
          setPaused(true);
          await loadKeyStatus();
          toast.warning("All Gemini keys are rate-limited — pausing. Free quotas reset daily; the run will retry automatically.", { id: "autogen-quota" });
          await sleep(QUOTA_COOLDOWN_MS);
          continue; // retry the SAME job (don't mark done)
        } else {
          // Hard failure for this topic — log it and move on so one bad topic
          // never blocks the whole sweep. You can re-run it later.
          skipRef.current.add(jobKey(job));
          setErrors((e) => [{ topic: job.topic, subject: job.subjectName, board: boardLabel(job.board), message: res.message }, ...e].slice(0, 30));
        }

        bump();
        if (++sinceKeyRefresh >= 5) { sinceKeyRefresh = 0; loadKeyStatus(); }
        await sleep(BETWEEN_TOPICS_MS);
      }
    })();
  }, [jobs, loadKeyStatus]);

  const stopLoop = useCallback(() => {
    activeRef.current = false;
    setRunning(false);
    setPaused(false);
    setCurrent(null);
  }, []);

  const toggle = async (next: boolean) => {
    setEnabled(next);
    try {
      await setControl({ enabled: next });
    } catch {
      toast.error("Couldn't save the switch state (are you signed in as the admin?).");
    }
    if (next) startLoop();
    else stopLoop();
  };

  // Per-board / per-subject breakdown for the progress table.
  const breakdown = useMemo(() => {
    const map = new Map<string, { board: string; subject: string; done: number; total: number }>();
    for (const j of jobs) {
      const key = `${j.board}::${j.subject}`;
      const row = map.get(key) ?? { board: boardLabel(j.board), subject: j.subjectName, done: 0, total: 0 };
      row.total += 1;
      if (doneRef.current.has(jobKey(j))) row.done += 1;
      map.set(key, row);
    }
    return [...map.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, version]);

  return (
    <section className="surface p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Notes Auto-Generator
        </h2>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono uppercase tracking-wider ${enabled ? "text-primary" : "text-muted-foreground"}`}>
            {enabled ? (paused ? "Paused (quota)" : running ? "Running" : "On") : "Off"}
          </span>
          <Switch checked={enabled} disabled={loading} onCheckedChange={toggle} aria-label="Toggle notes auto-generation" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Flip this ON to pre-generate revision notes for <strong>every topic on Edexcel IGCSE + Edexcel International A-Level</strong>, one at a time,
        into the shared cache so students open them instantly. It uses your Gemini keys with automatic rotation and resumes where it left off.
        Keep this tab open while it runs (or use the headless script for unattended multi-day runs).
      </p>

      {loading ? (
        <div className="py-6 flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading progress…</div>
      ) : (
        <div className="space-y-5">
          {/* Overall progress */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-sm">
                <span className="font-bold text-2xl tabular">{doneCount}</span>
                <span className="text-muted-foreground"> / {total} topics generated</span>
                <span className="text-muted-foreground"> · {remaining} remaining</span>
              </div>
              <div className="text-sm font-mono text-primary">{pct}%</div>
            </div>
            <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Live status line */}
          <div className="rounded-xl border border-border/70 bg-card p-3 text-sm flex items-center gap-2 min-h-[44px]">
            {paused ? (
              <><Pause className="h-4 w-4 text-accent shrink-0" /> <span>All keys rate-limited — waiting for quota to reset, then retrying…</span></>
            ) : running && current ? (
              <><Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" /> <span className="truncate">Generating: <strong>{boardLabel(current.board)}</strong> · {current.subjectName} · {current.unit_code} · <span className="text-primary">{current.topic}</span></span></>
            ) : doneCount >= total ? (
              <><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> <span>Everything is generated. Nothing left to do.</span></>
            ) : (
              <><Power className="h-4 w-4 text-muted-foreground shrink-0" /> <span className="text-muted-foreground">Idle — flip the switch ON to start generating.</span></>
            )}
          </div>

          {/* Active Gemini key */}
          <div className="rounded-xl border border-border/70 bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5" /> Gemini key in use</div>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={loadKeyStatus}><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
            {!keyStatus || keyStatus.totalKeys === 0 ? (
              <p className="text-xs text-urgent">No Gemini keys detected. Add GEMINI_API_KEY (and _1, _2, …) in Supabase → Edge Functions → Secrets.</p>
            ) : (
              <div className="space-y-2">
                <div className="text-sm">Active: <span className="font-mono font-bold text-primary">{keyStatus.currentKeyName}</span> <span className="text-muted-foreground">({keyStatus.currentIndex + 1}/{keyStatus.totalKeys})</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {keyStatus.keyNames.map((n, i) => (
                    <span key={n} className={`px-2 py-0.5 rounded text-[11px] font-mono border ${i === keyStatus.currentIndex ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground"}`}>
                      {i + 1}{i === keyStatus.currentIndex ? " ●" : ""}
                    </span>
                  ))}
                </div>
                {keyStatus.lastError && <p className="text-[11px] text-urgent/80 font-mono break-all">Last error: {keyStatus.lastError}</p>}
              </div>
            )}
          </div>

          {/* Per-subject breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                <tr className="border-b border-border"><th className="text-left py-2 pr-3">Board</th><th className="text-left py-2 pr-3">Subject</th><th className="text-left py-2 pr-3 w-1/2">Progress</th><th className="text-right py-2">Done</th></tr>
              </thead>
              <tbody>
                {breakdown.map((r) => {
                  const p = r.total > 0 ? Math.round((r.done / r.total) * 100) : 0;
                  return (
                    <tr key={`${r.board}-${r.subject}`} className="border-b border-border/50">
                      <td className="py-2 pr-3 whitespace-nowrap">{r.board}</td>
                      <td className="py-2 pr-3">{r.subject}</td>
                      <td className="py-2 pr-3">
                        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${p}%` }} />
                        </div>
                      </td>
                      <td className="py-2 text-right font-mono tabular text-xs whitespace-nowrap">{r.done}/{r.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="rounded-xl border border-urgent/30 bg-urgent/5 p-3">
              <div className="text-xs font-mono uppercase tracking-wider text-urgent mb-2 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Skipped topics ({errors.length})</div>
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {errors.map((e, i) => (
                  <div key={i} className="text-[11px] font-mono text-muted-foreground">
                    <span className="text-foreground">{e.subject} · {e.topic}</span> — {e.message}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={() => { skipRef.current.clear(); setErrors([]); if (enabled) startLoop(); }}>
                Retry skipped topics
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
