"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/app/api/chat/route";

type Props = { examples: string[]; telegram: string };

const MAX_LENGTH = 1000;

export default function Assistant({ examples, telegram }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, loading, error]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const history: ChatMessage[] = [...messages, { role: "user", text: question }];
    setMessages(history);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Ассистент не ответил. Попробуйте ещё раз через минуту.");
        return;
      }

      // Ответ приходит по частям: дописываем их в последнее сообщение.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", text: answer }]);
      }
    } catch {
      setError("Связь с ассистентом прервалась. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const waiting = loading && messages.at(-1)?.role === "user";

  return (
    <div className="flex h-[min(640px,70svh)] flex-col rounded-(--radius-frame) border border-line bg-surface">
      <div ref={logRef} className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" role="log" aria-live="polite" aria-label="Переписка с ассистентом">
        {messages.length === 0 && (
          <div>
            <p className="text-muted">Задайте вопрос или выберите пример:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {examples.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-(--radius-control) border border-line px-4 py-2 text-left text-(length:--text-small) transition hover:border-muted active:translate-y-px"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-[18px] bg-line px-4 py-2.5">
              {m.text}
            </p>
          ) : (
            <p key={i} className="max-w-[60ch] whitespace-pre-wrap text-ink">
              {m.text}
            </p>
          ),
        )}

        {waiting && <p className="animate-pulse text-muted">Ассистент думает…</p>}

        {error && (
          <div className="border-l-2 border-camel pl-4">
            <p>{error}</p>
            <a href={telegram} target="_blank" rel="noreferrer" className="mt-1 inline-block text-camel underline underline-offset-4 hover:text-ink">
              Написать Анне в Telegram
            </a>
          </div>
        )}
      </div>

      <form
        className="flex items-end gap-3 border-t border-line p-3 sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="assistant-input" className="sr-only">
          Ваш вопрос
        </label>
        <textarea
          id="assistant-input"
          rows={1}
          value={input}
          maxLength={MAX_LENGTH}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ваш вопрос"
          className="max-h-40 min-h-12 min-w-0 flex-1 resize-none rounded-[24px] border border-line bg-bg px-4 py-3 text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-12 items-center justify-center rounded-(--radius-control) bg-ink px-6 font-medium text-ink-on transition hover:bg-zone-9 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
