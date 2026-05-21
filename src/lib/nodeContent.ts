import { supabase } from "@/integrations/supabase/client";
import { callAITool } from "@/integrations/supabase/functions/_shared/ai";
import type { NodeType } from "./roadmapNodes";

/**
 * Generates AI content for a roadmap node. The function first checks if the
 * content already exists in the `node_content` table. If not, it calls the
 * shared Gemini helper to generate a summary and 5 multiple‑choice questions.
 */
export async function generateNodeContent(nodeId: string) {
  // Check cache
  const { data: existing, error: e1 } = await supabase
    .from("node_content")
    .select("summary, questions")
    .eq("node_id", nodeId)
    .single();
  if (existing && !e1) return existing;

  // Fetch node details
  const { data: node, error: e2 } = await supabase
    .from("roadmap_nodes")
    .select("subject, topic_name, unit_name, unit_number, unit_code, science_method")
    .eq("id", nodeId)
    .single();
  if (e2 || !node) throw new Error("Node not found for content generation");

  const prompt = `Generate a concise summary and 5 multiple‑choice questions (easy → hard) for the following topic. Provide the summary, each question with 4 options, the correct answer, and a brief explanation.

Topic: ${node.topic_name}
Subject: ${node.subject}
Unit: ${node.unit_name} (${node.unit_number})
Learning method: ${node.science_method ?? "active_recall"}`;

  const aiResult = await callAITool({
    messages: [{ role: "user", content: prompt }],
    tools: [],
    toolName: "gemini",
  });
  const { summary, questions } = aiResult as { summary: string; questions: any };

  const { data: inserted, error: e3 } = await supabase
    .from("node_content")
    .insert({ node_id: nodeId, summary, questions })
    .single();
  if (e3) throw e3;
  return inserted;
}

export type Question = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};
