// src/lib/rag/vectorStore.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveChunk(
  chunk_text: string,
  metadata: any,
  embedding: number[]
) {
  const { data, error } = await supabase
    .from("physics_chunks")
    .insert([
      {
        chunk_text,
        metadata,
        embedding,
      },
    ]);

  if (error) {
    console.error(error);
  }

  return data;
}
