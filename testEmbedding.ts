import { createEmbedding } from "./src/lib/rag/embeddings";

async function run() {
  const embedding = await createEmbedding(
    "Newton's Second Law"
  );

  console.log(embedding);
}

run();
