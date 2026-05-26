// src/lib/rag/embedAll.ts

import { loadChunks } from "./chunkLoader";
import { createEmbedding } from "./embeddings";
import { saveChunk } from "./vectorStore";

async function run() {
  const chunks = loadChunks();

  for (const chunk of chunks) {
    console.log("Embedding:", chunk.metadata.topic);

    const embedding = await createEmbedding(
      chunk.chunk_text
    );

    await saveChunk(
      chunk.chunk_text,
      chunk.metadata,
      embedding
    );

    console.log("Saved");
  }
}

run();
