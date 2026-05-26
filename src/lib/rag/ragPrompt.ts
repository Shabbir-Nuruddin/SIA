// src/lib/rag/ragPrompt.ts

export function buildRagPrompt(
  question: string,
  chunks: any[]
) {
  const context = chunks
    .map((c) => c.chunk_text)
    .join("\n\n");

  return `
You are an Edexcel IAL Physics tutor.

Answer ONLY from the provided context.

Question:
${question}

Context:
${context}

If the context is insufficient,
say:
"Database context insufficient."
`;
}
