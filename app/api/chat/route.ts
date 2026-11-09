// Чат ассистента. Протокол: POST { messages: [{ role: "user" | "assistant", text }] }.
// Успех — поток простого текста (ответ по частям), ошибка — JSON { error } с понятным текстом.
import { CHAT_MODEL, embed, gemini } from "@/lib/rag/gemini";
import { loadIndex, search } from "@/lib/rag/store";

export type ChatMessage = { role: "user" | "assistant"; text: string };

const HISTORY = 10; // сколько последних сообщений помнит ассистент
const MAX_TEXT = 2000;
const TOP_K = 5;

const EMPTY_BASE =
  "В базе знаний пока нет материалов, поэтому ответить не могу. Напишите Анне в Telegram — она ответит сама.";

const SYSTEM = `Ты — ассистент онлайн-курсов фотографии Анны Канаки на её сайте.
Отвечай по-русски, коротко и по делу, обычным текстом без разметки.
Отвечай только на основе фрагментов базы знаний ниже. Если ответа в них нет, прямо скажи, что не знаешь,
и предложи написать Анне в Telegram. Не придумывай цены, даты, сроки и другие факты.`;

function textStream(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;
  const last = messages?.at(-1);
  if (!messages || !last || last.role !== "user" || !last.text?.trim()) {
    return Response.json({ error: "Напишите вопрос." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "Ассистент пока не подключён. Напишите Анне в Telegram — она ответит сама." },
      { status: 503 },
    );
  }

  const index = await loadIndex();
  if (!index?.chunks.length) return textStream(EMPTY_BASE);

  try {
    const [query] = await embed([last.text.slice(0, MAX_TEXT)], "RETRIEVAL_QUERY");
    const context = search(index, query, TOP_K)
      .map(({ chunk }, i) => `[${i + 1}] (${chunk.source})\n${chunk.text}`)
      .join("\n\n");

    const stream = await gemini.models.generateContentStream({
      model: CHAT_MODEL,
      contents: messages.slice(-HISTORY).filter((m) => m.text?.trim()).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text.slice(0, MAX_TEXT) }],
      })),
      config: { systemInstruction: `${SYSTEM}\n\nФрагменты базы знаний:\n\n${context}` },
    });

    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const part of stream) if (part.text) controller.enqueue(encoder.encode(part.text));
            controller.close();
          } catch (e) {
            console.error("Gemini stream:", e);
            controller.error(e);
          }
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  } catch (e) {
    console.error("Gemini:", e);
    return Response.json(
      { error: "Ассистент сейчас не может ответить. Попробуйте позже или напишите Анне в Telegram." },
      { status: 502 },
    );
  }
}
