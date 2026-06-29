/**
 * Headless Notes Auto-Generator.
 *
 * Same job as the admin panel's ON/OFF switch, but runs from your terminal so it
 * can keep going for hours/days without a browser tab open. It logs in as the
 * admin, then walks every topic on the Edexcel IGCSE + IAL specs and asks the
 * deployed `ai-notes` edge function to generate + cache each one. The function
 * uses your Gemini keys with automatic rotation, so this script never touches the
 * keys directly. Already-generated topics are skipped, so it is safe to re-run.
 *
 * It also respects the panel switch: if you flip "Notes Auto-Generator" OFF in the
 * admin panel, this script stops too (it polls notes_autogen_control).
 *
 * USAGE (PowerShell, from the project root):
 *   $env:SIA_ADMIN_EMAIL="nuruddinshabbir3@gmail.com"
 *   $env:SIA_ADMIN_PASSWORD="admin123"
 *   npm run notes:autogen
 *
 * Reads VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY from .env automatically.
 * `npm run notes:autogen` runs it via `npx tsx` (fetched automatically).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getSubjectsForBoard } from "../src/lib/subjects";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- tiny .env reader (no dotenv dependency) ---
function envFromFile(): Record<string, string> {
  try {
    const raw = readFileSync(join(ROOT, ".env"), "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const fileEnv = envFromFile();
const env = (k: string) => process.env[k] ?? fileEnv[k] ?? "";

const SUPABASE_URL = env("VITE_SUPABASE_URL") || env("SUPABASE_URL");
const SUPABASE_KEY = env("VITE_SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
const ADMIN_EMAIL = env("SIA_ADMIN_EMAIL");
const ADMIN_PASSWORD = env("SIA_ADMIN_PASSWORD");

const BOARDS = ["edexcel-igcse", "edexcel-ial"] as const;
const QUOTA_COOLDOWN_MS = 90_000;
const BETWEEN_TOPICS_MS = 1_200;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const key = (j: any) => `${j.board}::${j.subject}::${j.unit_number}::${j.topic}`;

interface Job {
  board: string; subject: string; subjectName: string;
  unit_number: number; unit_name: string; unit_code: string; topic: string;
}

function buildAllJobs(): Job[] {
  const jobs: Job[] = [];
  for (const board of BOARDS) {
    const subjects = getSubjectsForBoard(board) as Record<string, any>;
    for (const [code, meta] of Object.entries(subjects)) {
      for (const unit of meta.units ?? []) {
        for (const topic of unit.topics ?? []) {
          jobs.push({
            board, subject: code, subjectName: meta.name,
            unit_number: unit.number, unit_name: unit.name,
            unit_code: unit.unitCode ?? `U${unit.number}`, topic,
          });
        }
      }
    }
  }
  return jobs;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (.env or env vars).");
    process.exit(1);
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set SIA_ADMIN_EMAIL and SIA_ADMIN_PASSWORD env vars (the admin account).");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: true },
  });

  const { error: signInErr } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (signInErr) {
    console.error("Sign-in failed:", signInErr.message);
    process.exit(1);
  }
  console.log(`Signed in as ${ADMIN_EMAIL}.`);

  const jobs = buildAllJobs();
  console.log(`Enumerated ${jobs.length} topics across Edexcel IGCSE + IAL.`);

  // Which topics are already cached?
  const done = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("cached_topic_notes")
      .select("board,subject,unit_number,topic")
      .in("board", BOARDS as unknown as string[])
      .range(from, from + 999);
    if (error || !data || data.length === 0) break;
    for (const r of data as any[]) done.add(key(r));
    if (data.length < 1000) break;
  }
  console.log(`${done.size} already generated, ${jobs.length - done.size} to go.`);

  let generated = 0;
  let i = 0;
  for (const job of jobs) {
    i++;
    if (done.has(key(job))) continue;

    // Respect the admin-panel switch — flip it OFF to stop this script.
    const { data: control } = await supabase
      .from("notes_autogen_control").select("enabled").eq("id", 1).maybeSingle();
    if (control && control.enabled === false) {
      console.log("Switch is OFF in the admin panel — stopping.");
      break;
    }

    let attempts = 0;
    while (true) {
      attempts++;
      const body = {
        subject: job.subject, unit_number: job.unit_number, unit_name: job.unit_name,
        unit_code: job.unit_code, topic: job.topic, board: job.board,
        level: job.unit_number >= 4 ? "A2-Level (IA2)" : "AS-Level (IAS)", trigger: "initial",
      };
      const { data, error } = await supabase.functions.invoke("ai-notes", { body });
      const detail = error?.message || (data as any)?.error || "";
      if (!detail) {
        done.add(key(job)); generated++;
        console.log(`[${i}/${jobs.length}] ✓ ${job.board} · ${job.subjectName} · ${job.topic}`);
        await supabase.from("notes_autogen_control")
          .update({ last_topic: `${job.subjectName} · ${job.topic}`, updated_at: new Date().toISOString() }).eq("id", 1);
        break;
      }
      const quota = /exhaust|quota|rate.?limit|429|resource.?exhausted|all gemini keys/i.test(detail);
      if (quota) {
        console.warn(`   …all keys rate-limited (${detail.slice(0, 80)}). Cooling down ${QUOTA_COOLDOWN_MS / 1000}s…`);
        await sleep(QUOTA_COOLDOWN_MS);
        continue; // retry same topic
      }
      if (attempts >= 2) {
        console.error(`[${i}/${jobs.length}] ✗ ${job.subjectName} · ${job.topic} — ${detail.slice(0, 120)}`);
        break; // skip this topic
      }
      await sleep(2000);
    }
    await sleep(BETWEEN_TOPICS_MS);
  }

  console.log(`\nDone. Generated ${generated} new topics this run. Total cached: ${done.size}/${jobs.length}.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
