// Временная страница для согласования дизайн-токенов (шаг 3). Заменяется лендингом на шаге 4.
const tones = [
  ["bg", "Фон, зона II"],
  ["surface", "Поверхность, зона III"],
  ["line", "Линии"],
  ["muted", "Второстепенный текст, зона VI"],
  ["ink", "Основной текст, зона IX"],
  ["tungsten", "Вольфрам: действие и фокус"],
] as const;

const zones = Array.from({ length: 11 }, (_, i) => i);

export default function Home() {
  return (
    <main className="mx-auto max-w-(--container-page) px-(--spacing-gut) py-(--spacing-section)">
      <h1 className="max-w-[14ch] text-(length:--text-h1)">Онлайн-курсы фотографии для тех, кто снимает всерьёз</h1>
      <p className="mt-6 max-w-[60ch] text-(length:--text-lead) text-muted">
        Заголовки набраны Source Serif 4, текст — Onest. Оба шрифта с кириллицей. Цвет на странице дают фотографии,
        интерфейс остаётся в оттенках серого.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#" className="rounded-(--radius-control) bg-tungsten px-6 py-3 font-medium text-tungsten-ink">
          Выбрать курс
        </a>
        <a href="#" className="rounded-(--radius-control) border border-line px-6 py-3 font-medium">
          Задать вопрос ассистенту
        </a>
      </div>

      <h2 className="mt-24 text-(length:--text-h2)">Шкала зон</h2>
      <div className="mt-6 grid grid-cols-11 overflow-hidden rounded-(--radius-frame)" aria-hidden="true">
        {zones.map((z) => (
          <div key={z} className="h-16" style={{ background: `var(--color-zone-${z})` }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-11 text-center text-(length:--text-label) text-muted">
        {zones.map((z) => (
          <span key={z}>{["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][z]}</span>
        ))}
      </div>

      <h2 className="mt-24 text-(length:--text-h2)">Палитра</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tones.map(([name, label]) => (
          <li key={name} className="rounded-(--radius-frame) border border-line bg-surface p-4">
            <div className="h-20 rounded-(--radius-frame) border border-line" style={{ background: `var(--color-${name})` }} />
            <p className="mt-3 font-medium">{label}</p>
            <p className="text-(length:--text-small) text-muted">--color-{name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
