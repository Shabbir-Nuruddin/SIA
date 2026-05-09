const GATEWAY = "https://api.groq.com/openai/v1/chat/completions";

const TEXT_MODELS = [
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "llama3-8b-8192",
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
];

const VISION_MODELS = [
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  ...TEXT_MODELS,
];

const tryParseJson = (s: string) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const recoverToolArgs = (raw: string) => {
  const valid = (obj: any) => (obj && typeof obj === "object" && !obj.error ? obj : null);
  const parse = (s: string) => valid(tryParseJson(s));
  const candidates: string[] = [raw];
  const failed = tryParseJson(raw)?.error?.failed_generation;
  if (typeof failed === "string") candidates.push(failed);
  for (const source of candidates) {
    const match = source.match(/\{[\s\S]*\}/);
    const body = match?.[0] ?? source;
    const parsed =
      parse(body) ||
      parse(body.replace(/```json|```/g, "").trim()) ||
      parse(body.replace(/\\(?!["\\/bfnrtu])/g, "\\\\")) ||
      parse(body.replace(/\\(?!["\\/bfnrtu])/g, "\\\\").replace(/[\u0000-\u001F\u007F]+/g, " "));
    if (parsed) return parsed;
  }
  return null;
};

export async function callGroqTool({
  apiKey,
  messages,
  tools,
  toolName,
  temperature = 0.3,
  maxTokens = 4096,
  vision = false,
}: {
  apiKey: string;
  messages: any[];
  tools: any[];
  toolName: string;
  temperature?: number;
  maxTokens?: number;
  vision?: boolean;
}) {
  let lastStatus = 500;
  let lastBody = "";
  const models = vision ? VISION_MODELS : TEXT_MODELS;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages,
          tools,
          tool_choice: { type: "function", function: { name: toolName } },
          temperature,
          max_tokens: maxTokens,
        }),
      });

      const body = await res.text();
      lastStatus = res.status;
      lastBody = body;
      if (!res.ok) {
        console.error("groq tool error", { model, attempt, status: res.status, body: body.slice(0, 700) });
        const recovered = recoverToolArgs(body);
        if (recovered) return recovered;
        if ([400, 401, 402, 404, 413, 422, 429].includes(res.status)) break;
        continue;
      }

      const data = tryParseJson(body);
      const finishReason = data?.choices?.[0]?.finish_reason;
      if (finishReason === "length" || finishReason === "max_tokens") {
        console.error("groq truncated output", { model, attempt });
        continue;
      }
      const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      const parsed = typeof args === "string" ? recoverToolArgs(args) : null;
      if (parsed) return parsed;
      console.error("groq no parseable tool output", { model, attempt, body: body.slice(0, 700) });
    }
  }

  const message =
    lastStatus === 429
      ? "Rate limit hit. Trying again shortly should work."
      : lastStatus === 402
        ? "AI credits exhausted."
        : "AI generation failed after trying fallback models.";
  throw { status: lastStatus, message, body: lastBody };
}
