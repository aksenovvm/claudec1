// Чат ассистента. Протокол: POST { messages: [{ role: "user" | "assistant", text }] }.
// Успех — поток простого текста (ответ по частям), ошибка — JSON { error } с понятным текстом.
// Шаг 6: поиск по knowledge/ и ответ Gemini.

export type ChatMessage = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;
  const last = messages?.at(-1);
  if (!last || last.role !== "user" || !last.text?.trim()) {
    return Response.json({ error: "Напишите вопрос." }, { status: 400 });
  }

  return Response.json(
    { error: "Ассистент пока не подключён. Напишите Анне в Telegram — она ответит сама." },
    { status: 503 },
  );
}
