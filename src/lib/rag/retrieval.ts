// src/lib/rag/retrieval.ts

import { createClient } from "@supabase/supabase-js";
import { createEmbedding } from "./embeddings";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function retrieveRelevantChunks(
  question: string
) {
  const embedding = await createEmbedding(question);

  const { data, error } = await supabase.rpc(
    "match_physics_chunks",
    {
      query_embedding: embedding,
      match_count: 5,
    }
  );

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
