// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "MakeMeRevise <hello@makemerevise.com>";
const APP_URL = "https://makemerevise.com";

interface EmailContent {
  subject: string;
  preheader: string;
  heading: string;
  body: string; // HTML inside main card
  cta?: { label: string; url: string };
}

function buildContent(n: number, firstName: string | null): EmailContent {
  const name = firstName?.trim() || "there";
  switch (n) {
    case 1:
      return {
        subject: "Welcome to MakeMeRevise — your A-Level edge starts now",
        preheader: "Your personalised revision plan is one click away.",
        heading: `Welcome, ${name}.`,
        body: `
          <p>You've just joined thousands of A-Level students who revise smarter, not longer.</p>
          <p><strong>Here's how to get the most out of MakeMeRevise in 5 minutes:</strong></p>
          <ol>
            <li><strong>Build your roadmap</strong> — tell us your subjects and exam dates; we'll plan every topic for you.</li>
            <li><strong>Open your first topic</strong> — get AI-marked notes, definitions, and worked examples.</li>
            <li><strong>Try a mock paper</strong> — get instant, examiner-grade feedback.</li>
          </ol>
          <p>Today, just open your dashboard and complete your first roadmap node. Momentum is everything.</p>
        `,
        cta: { label: "Open my dashboard", url: `${APP_URL}/dashboard` },
      };
    case 2:
      return {
        subject: "The #1 feature top students use on MakeMeRevise",
        preheader: "AI-marked mock papers — feedback in 30 seconds.",
        heading: "Mock papers, marked instantly.",
        body: `
          <p>${name}, the single highest-leverage feature on MakeMeRevise is our <strong>AI-marked mock papers</strong>.</p>
          <p>Past-paper practice is the #1 predictor of A-Level success — but only if you actually mark it. Our AI marks against the official mark scheme in under a minute, showing you exactly where you lost marks and how to fix it.</p>
          <p><strong>Try this today:</strong> pick one topic you feel weakest on, generate a mock paper, and let the AI mark it. Read the feedback carefully — that's your study list for the week.</p>
        `,
        cta: { label: "Generate a mock paper", url: `${APP_URL}/mock-papers` },
      };
    case 3:
      return {
        subject: "A hidden MakeMeRevise tip most students miss",
        preheader: "Two minutes a day, and your weak spots disappear.",
        heading: "The two-minute weak-spot trick.",
        body: `
          <p>Most students revise by re-reading notes. The top 10% do something different:</p>
          <p><strong>They retrieve from memory, daily, in tiny doses.</strong></p>
          <p>On MakeMeRevise, open any topic and use the <em>Definitions</em> and <em>Quick Quiz</em> sections — even for two minutes between classes. The roadmap quietly tracks which concepts you keep slipping on and surfaces them again.</p>
          <p>Try it tomorrow morning: pick one weak topic from your roadmap, do a 2-minute retrieval, then go to school. Repeat for 7 days and watch your confidence shift.</p>
        `,
        cta: { label: "Open my roadmap", url: `${APP_URL}/roadmap` },
      };
    case 4:
      return {
        subject: "How's your revision going, " + name + "?",
        preheader: "Reply and tell us what's working — or what isn't.",
        heading: "A quick check-in.",
        body: `
          <p>You've been on MakeMeRevise for a week. We genuinely want to know:</p>
          <ul>
            <li>What's been the most useful so far?</li>
            <li>Where are you getting stuck?</li>
            <li>Anything we could build that would change your revision?</li>
          </ul>
          <p><strong>Just hit reply</strong> — this email goes to a real person on our team, not a black hole. We read every single response and use them to decide what to build next.</p>
          <p>And if you need help with anything specific, ask — we're here.</p>
        `,
        cta: { label: "Back to my dashboard", url: `${APP_URL}/dashboard` },
      };
    case 5:
      return {
        subject: "Ready to unlock the full MakeMeRevise?",
        preheader: "Unlimited mocks, all subjects, full roadmap — for less than a tutor's hour.",
        heading: "Two weeks in. Ready for more?",
        body: `
          <p>${name}, you've now experienced what MakeMeRevise can do on the free plan. Here's what unlocks when you go Pro:</p>
          <ul>
            <li><strong>Unlimited AI-marked mock papers</strong> across every subject you study.</li>
            <li><strong>Full topic-by-topic roadmap</strong> with personalised pacing to your exam dates.</li>
            <li><strong>Priority AI tutor</strong> — ask anything, get exam-grade answers.</li>
            <li><strong>Mastery tracking & weak-spot reports</strong> so you always know what to revise next.</li>
          </ul>
          <p>For most students, it costs less than a single hour with a private tutor — and works around your schedule.</p>
        `,
        cta: { label: "See Pro plans", url: `${APP_URL}/pricing` },
      };
    default:
      throw new Error("invalid email number");
  }
}

function renderEmail(c: EmailContent): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${c.subject}</title></head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;color:#f6f7fb">${c.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f7fb;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;box-shadow:0 1px 3px rgba(15,23,42,.06);overflow:hidden;">
        <tr><td style="padding:28px 32px 0 32px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,hsl(160,65%,35%),hsl(160,70%,45%));"></div>
            <span style="font-weight:700;font-size:16px;letter-spacing:-.01em;">MakeMeRevise</span>
          </div>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;">
          <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.25;letter-spacing:-.02em;color:#0f172a;">${c.heading}</h1>
          <div style="font-size:15px;line-height:1.65;color:#334155;">${c.body}</div>
          ${
            c.cta
              ? `<div style="margin:26px 0 8px 0;"><a href="${c.cta.url}" style="display:inline-block;background:hsl(160,65%,35%);color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:15px;">${c.cta.label}</a></div>`
              : ""
          }
        </td></tr>
        <tr><td style="padding:24px 32px 28px 32px;">
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0 16px 0"/>
          <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
            You're getting this because you signed up to <a href="${APP_URL}" style="color:#64748b;">MakeMeRevise</a>.
            <br/>Don't want onboarding emails? <a href="${APP_URL}/settings" style="color:#64748b;">Manage in settings</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendOne(supabase: any, row: any) {
  const content = buildContent(row.email_number, row.first_name);
  const html = renderEmail(content);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [row.email],
      subject: content.subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    await supabase
      .from("onboarding_emails")
      .update({ status: "failed", error: text.slice(0, 500) })
      .eq("id", row.id);
    return { ok: false, error: text };
  }
  await supabase
    .from("onboarding_emails")
    .update({ status: "sent", sent_at: new Date().toISOString(), error: null })
    .eq("id", row.id);
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Require service-role JWT — this endpoint is only callable by trusted
  // server-side callers (cron / other edge functions). It must never be
  // triggerable by anonymous or end-user requests.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!token || token !== serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceRoleKey
  );

  try {
    const body = await req.json().catch(() => ({}));

    // Mode A: send a specific row by id (used right after signup for email #1)
    if (body?.id) {
      const { data: row, error } = await supabase
        .from("onboarding_emails")
        .select("*")
        .eq("id", body.id)
        .eq("status", "pending")
        .maybeSingle();
      if (error) throw error;
      if (!row)
        return new Response(JSON.stringify({ skipped: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const result = await sendOne(supabase, row);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mode B: drain all due rows (used by cron)
    const { data: due, error } = await supabase
      .from("onboarding_emails")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(50);
    if (error) throw error;

    let sent = 0;
    let failed = 0;
    for (const row of due ?? []) {
      const r = await sendOne(supabase, row);
      if (r.ok) sent++;
      else failed++;
    }
    return new Response(JSON.stringify({ processed: due?.length ?? 0, sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
