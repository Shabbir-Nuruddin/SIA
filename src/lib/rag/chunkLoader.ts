// src/lib/rag/chunkLoader.ts

import data from "@/lib/data/physics-edexcel/unit1_complete.json";
export function loadChunks() {
  return data.chunks;
}
