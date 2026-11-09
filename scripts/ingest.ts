// Строит индекс базы знаний: читает файлы из knowledge/, режет на фрагменты, получает векторы Gemini
// и сохраняет всё в .rag-index.json. Запуск: npm run ingest (после каждого изменения файлов в knowledge/).
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { extractText, getDocumentProxy } from "unpdf";
import { EMBED_MODEL, embed } from "../lib/rag/gemini";
import { INDEX_PATH, type Chunk, type Index } from "../lib/rag/store";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");
const EXTENSIONS = [".md", ".txt", ".pdf"];
const MAX_CHARS = 1200;
const OVERLAP = 200;

async function readText(file: string) {
  if (file.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(new Uint8Array(await readFile(file)));
    return (await extractText(pdf, { mergePages: true })).text;
  }
  return readFile(file, "utf8");
}

// Склеиваем абзацы во фрагменты до MAX_CHARS; слишком длинный абзац режем с перекрытием.
function split(text: string) {
  const chunks: string[] = [];
  let current = "";
  for (const para of text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)) {
    if (current && current.length + para.length + 2 > MAX_CHARS) {
      chunks.push(current);
      current = "";
    }
    if (para.length > MAX_CHARS) {
      for (let i = 0; i < para.length; i += MAX_CHARS - OVERLAP) chunks.push(para.slice(i, i + MAX_CHARS));
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error("Нет GEMINI_API_KEY: добавьте его в файл .env.local");

  const files = (await readdir(KNOWLEDGE_DIR, { recursive: true }))
    .filter((f) => EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort();

  const pieces: Omit<Chunk, "embedding">[] = [];
  for (const file of files) {
    const parts = split(await readText(path.join(KNOWLEDGE_DIR, file)));
    pieces.push(...parts.map((text) => ({ source: file.split(path.sep).join("/"), text })));
    console.log(`${file}: ${parts.length} фрагм.`);
  }

  const vectors = await embed(pieces.map((p) => p.text), "RETRIEVAL_DOCUMENT");
  const index: Index = {
    model: EMBED_MODEL,
    createdAt: new Date().toISOString(),
    chunks: pieces.map((p, i) => ({ ...p, embedding: vectors[i] })),
  };
  await writeFile(INDEX_PATH, JSON.stringify(index));
  console.log(`Готово: ${files.length} файл(ов), ${pieces.length} фрагм. → .rag-index.json`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
