import Image from "next/image";

// Временная страница для согласования дизайн-токенов (шаг 3). Заменяется лендингом на шаге 4.
const tones = [
  ["bg", "Фон"],
  ["surface", "Поверхность"],
  ["line", "Линии"],
  ["muted", "Тауп: второстепенный текст"],
  ["ink", "Слоновая кость: текст и кнопки"],
  ["camel", "Тренч: фокус и выделение"],
] as const;

const zones = Array.from({ length: 11 }, (_, i) => i);
const roman = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function Home() {
  return (
    <main className="mx-auto max-w-(--container-page) px-(--spacing-gut) py-(--spacing-section)">
      <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Image src="/brand/logo.png" alt="Anna Kanaki" width={144} height={35} />
          <h1 className="mt-10 text-(length:--text-h1)">Курсы свадебной и семейной фотографии</h1>
          <p className="mt-6 max-w-[52ch] text-(length:--text-lead) text-muted">
            Онлайн-уроки от Анны Канаки: свет, позирование без натянутых улыбок и обработка в её стиле.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="rounded-(--radius-control) bg-ink px-7 py-3 font-medium text-ink-on">
              Выбрать курс
            </a>
            <a href="#" className="rounded-(--radius-control) border border-line px-7 py-3 font-medium">
              Задать вопрос ассистенту
            </a>
          </div>
        </div>
        <Image
          src="/photos/anna-06.jpg"
          alt="Пара в бежевых тренчах обнимается на улице"
          width={1067}
          height={1600}
          className="aspect-[4/5] w-full rounded-(--radius-frame) object-cover"
          priority
        />
      </div>

      <h2 className="mt-28 text-(length:--text-h2)">Шкала зон</h2>
      <div className="mt-6 grid grid-cols-11" aria-hidden="true">
        {zones.map((z) => (
          <div key={z} className="h-16" style={{ background: `var(--color-zone-${z})` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-11 text-center text-(length:--text-label) text-muted">
        {zones.map((z) => (
          <span key={z}>{roman[z]}</span>
        ))}
      </div>

      <h2 className="mt-28 text-(length:--text-h2)">Палитра</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tones.map(([name, label]) => (
          <li key={name} className="rounded-(--radius-frame) border border-line bg-surface p-4">
            <div className="h-20 border border-line" style={{ background: `var(--color-${name})` }} />
            <p className="mt-3 font-medium">{label}</p>
            <p className="text-(length:--text-small) text-muted">--color-{name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
