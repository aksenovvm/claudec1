import { readFile } from "node:fs/promises";
import path from "node:path";

// Индекс базы знаний: фрагменты текста из knowledge/ и их векторы. Строится командой npm run ingest.
export const INDEX_PATH = path.join(process.cwd(), ".rag-index.json");

export type Chunk = { source: string; text: string; embedding: number[] };
export type Index = { model: string; createdAt: string; chunks: Chunk[] };

export async function loadIndex(): Promise<Index | null> {
  try {
    return JSON.parse(await readFile(INDEX_PATH, "utf8"));
  } catch {
    return null; // индекс ещё не построен
  }
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function search(index: Index, query: number[], k: number) {
  return index.chunks
    .map((chunk) => ({ chunk, score: cosine(chunk.embedding, query) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
