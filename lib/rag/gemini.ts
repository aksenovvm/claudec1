import { GoogleGenAI } from "@google/genai";

// Модели Gemini: одна отвечает в чате, вторая превращает текст в векторы для поиска.
export const CHAT_MODEL = "gemini-3.8-flash";
export const EMBED_MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function embed(texts: string[], taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {
  const vectors: number[][] = [];
  // Не больше 100 текстов за запрос (ограничение API).
  for (let i = 0; i < texts.length; i += 100) {
    const res = await gemini.models.embedContent({
      model: EMBED_MODEL,
      contents: texts.slice(i, i + 100),
      config: { taskType, outputDimensionality: DIMENSIONS },
    });
    vectors.push(...(res.embeddings ?? []).map((e) => e.values ?? []));
  }
  return vectors;
}
