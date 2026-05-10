// Fetches active admin-defined prompt modifiers for a given AI feature/board
// and returns them as an additional system-prompt fragment. Falls back to "" on any error.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export type Feature = "notes" | "faq" | "questions" | "mock" | "tutor";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

export async function getAdminModifiers(feature: Feature, board: string): Promise<string> {
  try {
    const boardKey = board === "cie" ? "cie" : "edexcel";
    const { data } = await admin
      .from("admin_ai_modifiers")
      .select("instruction")
      .eq("feature", feature)
      .eq("is_active", true)
      .in("board", [boardKey, "all"]);
    if (!data?.length) return "";
    const list = data.map((r: any, i: number) => `${i + 1}. ${r.instruction}`).join("\n");
    return `\n\nADDITIONAL ADMIN INSTRUCTIONS (highest priority — follow exactly):\n${list}`;
  } catch (e) {
    console.error("modifiers fetch failed", e);
    return "";
  }
}
