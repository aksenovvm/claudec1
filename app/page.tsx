import Image from "next/image";
import { getContent, type Level } from "@/lib/content";
import Assistant from "@/components/Assistant";

const LEVEL_STEPS: Record<Level, number> = { Новичок: 3, Средний: 6, Продвинутый: 9 };
const photo = (file: string) => `/photos/${file}`;
const paragraphs = (text: string) => text.split(/\n\s*\n/).filter(Boolean);

const btn =
  "inline-flex items-center justify-center rounded-(--radius-control) px-7 py-3 font-medium transition duration-200 active:translate-y-px";
const btnPrimary = `${btn} bg-ink text-ink-on hover:bg-zone-9`;
const btnGhost = `${btn} border border-line hover:border-muted`;
const wrap = "mx-auto w-full max-w-(--container-page) px-(--spacing-gut)";
const section = "min-h-svh border-t border-line py-(--spacing-section)";
const h2 = "text-(length:--text-h2)";

function LevelScale({ level }: { level: Level }) {
  const active = LEVEL_STEPS[level];
  return (
    <div>
      <div className="grid grid-cols-10 gap-1" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-1.5 ${i < active ? "bg-camel" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-2 text-(length:--text-small) text-muted">Уровень: {level.toLowerCase()}</p>
    </div>
  );
}

export async function generateMetadata() {
  const { main } = await getContent();
  return { title: main["Название"], description: main["Подзаголовок"] };
}

export default async function Home() {
  const { main, courses, steps, faq, gallery } = await getContent();
  const telegram = main["Telegram"];

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className={`${wrap} flex h-16 items-center justify-between gap-6`}>
          <a href="#top" aria-label="Наверх">
            <Image src="/brand/logo.png" alt="Anna Kanaki" width={132} height={32} priority />
          </a>
          <nav className="hidden gap-8 text-(length:--text-small) md:flex">
            {[
              ["#courses", "Курсы"],
              ["#how", "Обучение"],
              ["#about", "Об Анне"],
              ["#works", "Работы"],
              ["#faq", "Вопросы"],
              ["#assistant", "Ассистент"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-muted transition-colors hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          <a href="#courses" className={`${btnPrimary} px-5 py-2 text-(length:--text-small)`}>
            Выбрать курс
          </a>
        </div>
      </header>

      <main id="top">
        {/* Первый экран */}
        <section className="py-10 lg:min-h-[calc(100svh-4rem)]">
          <div className={`${wrap} grid h-full items-center gap-10 lg:grid-cols-[1.05fr_1fr]`}>
            <div>
              <h1 className="text-(length:--text-h1)">{main["Заголовок"]}</h1>
              <p className="mt-6 max-w-[48ch] text-(length:--text-lead) text-muted">{main["Подзаголовок"]}</p>
              <p className="mt-4 text-(length:--text-small)">{main["Факт"]}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#courses" className={btnPrimary}>
                  Выбрать курс
                </a>
                <a href="#works" className={btnGhost}>
                  Посмотреть работы
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-frame) lg:aspect-auto lg:h-[calc(100svh-9rem)]">
              <Image
                src={photo(main["Фото первого экрана"])}
                alt="Работа Анны Канаки"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Курсы */}
        <section id="courses" className={section}>
          <div className={wrap}>
            <h2 className={h2}>Курсы</h2>
            <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <li key={c.title} className="group flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-frame)">
                    <Image
                      src={photo(c.photo)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-6 text-(length:--text-h3)">{c.title}</h3>
                  <p className="mt-2 text-muted">{c.audience}</p>
                  <div className="mt-5">
                    <LevelScale level={c.level} />
                  </div>
                  <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-(length:--text-small)">
                    <dt className="text-muted">Длительность</dt>
                    <dd>{c.duration}</dd>
                    <dt className="text-muted">Формат</dt>
                    <dd>{c.format}</dd>
                    <dt className="text-muted">Цена</dt>
                    <dd>{c.price}</dd>
                  </dl>
                  <div className="mt-auto pt-6">
                    <a href={telegram} className={btnGhost} target="_blank" rel="noreferrer">
                      Записаться на курс
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Как проходит обучение */}
        <section id="how" className={section}>
          <div className={wrap}>
            <h2 className={h2}>Как проходит обучение</h2>
            <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-(--radius-frame)">
              <Image src={photo("anna-01.jpg")} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="text-(length:--text-h2) font-light text-muted">{i + 1}</span>
                  <h3 className="mt-3 text-(length:--text-h3)">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Об Анне */}
        <section id="about" className={section}>
          <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-frame)">
              <Image
                src={photo(main["Об Анне: фото"])}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className={h2}>{main["Об Анне: заголовок"]}</h2>
              <div className="mt-6 max-w-[60ch] space-y-4 text-(length:--text-lead) text-muted">
                {paragraphs(main["Об Анне: текст"]).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <a href={main["Сайт-портфолио"]} className={`${btnGhost} mt-8`} target="_blank" rel="noreferrer">
                Открыть портфолио Анны
              </a>
            </div>
          </div>
        </section>

        {/* Работы */}
        <section id="works" className={section}>
          <div className={wrap}>
            <h2 className={h2}>Работы Анны</h2>
            <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
              {gallery.map((g) => (
                <li key={g.photo} className="group relative aspect-[2/3] overflow-hidden rounded-(--radius-frame)">
                  <Image
                    src={photo(g.photo)}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Вопросы */}
        <section id="faq" className="border-t border-line py-(--spacing-section)">
          <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.4fr]`}>
            <h2 className={h2}>Частые вопросы</h2>
            <div className="divide-y divide-line border-y border-line">
              {faq.map((f) => (
                <details key={f.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-(length:--text-lead)">
                    {f.question}
                    <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[60ch] text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Ассистент */}
        <section id="assistant" className="border-t border-line py-(--spacing-section)">
          <div className={`${wrap} grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]`}>
            <div>
              <h2 className={h2}>{main["Ассистент: заголовок"]}</h2>
              <p className="mt-6 max-w-[48ch] text-(length:--text-lead) text-muted">{main["Ассистент: текст"]}</p>
            </div>
            <Assistant
              examples={main["Ассистент: примеры вопросов"].split("\n").map((q) => q.trim()).filter(Boolean)}
              telegram={telegram}
            />
          </div>
        </section>

        {/* Запись */}
        <section id="enroll" className="border-t border-line py-(--spacing-section)">
          <div className={`${wrap} max-w-[56rem] text-center`}>
            <h2 className={h2}>{main["Запись: заголовок"]}</h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-(length:--text-lead) text-muted">{main["Запись: текст"]}</p>
            <a href={telegram} className={`${btnPrimary} mt-8`} target="_blank" rel="noreferrer">
              Написать Анне в Telegram
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-10">
        <div className={`${wrap} flex flex-col gap-4 text-(length:--text-small) text-muted sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {new Date().getFullYear()} Анна Канаки. Все фотографии — работы Анны.</p>
          <a href={main["Сайт-портфолио"]} className="hover:text-ink" target="_blank" rel="noreferrer">
            annakanaki.wfolio.pro
          </a>
        </div>
      </footer>
    </>
  );
}
