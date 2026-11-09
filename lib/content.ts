import path from "node:path";
import readXlsxFile from "read-excel-file/node";

// Все тексты сайта лежат в content/site.xlsx. Лист = раздел, первая строка = названия колонок.
const FILE = path.join(process.cwd(), "content", "site.xlsx");

export type Level = "Новичок" | "Средний" | "Продвинутый";

export type Course = {
  title: string;
  audience: string;
  level: Level;
  duration: string;
  format: string;
  price: string;
  photo: string;
};

export type Content = {
  main: Record<string, string>;
  courses: Course[];
  steps: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  gallery: { photo: string; alt: string }[];
};

type Rows = Record<string, string>[];

function fail(message: string): never {
  throw new Error(`content/site.xlsx: ${message}`);
}

function toRows(sheet: string, data: unknown[][] | undefined, columns: string[]): Rows {
  if (!data) fail(`нет листа «${sheet}»`);
  const [header = [], ...body] = data;
  const titles = header.map((c) => String(c ?? "").trim());
  for (const col of columns) {
    if (!titles.includes(col)) fail(`на листе «${sheet}» нет колонки «${col}»`);
  }
  return body
    .map((row) => Object.fromEntries(titles.map((t, i) => [t, String(row[i] ?? "").trim()])))
    .filter((row) => columns.some((col) => row[col]));
}

export async function getContent(): Promise<Content> {
  const sheets = await readXlsxFile(FILE);
  const get = (name: string, columns: string[]) =>
    toRows(name, sheets.find((s) => s.sheet === name)?.data as unknown[][] | undefined, columns);

  const main = Object.fromEntries(get("Главная", ["Поле", "Значение"]).map((r) => [r["Поле"], r["Значение"]]));
  const mainFields = [
    "Название", "Заголовок", "Подзаголовок", "Факт", "Фото первого экрана",
    "Об Анне: заголовок", "Об Анне: текст", "Об Анне: фото",
    "Запись: заголовок", "Запись: текст", "Telegram", "Сайт-портфолио",
    "Ассистент: заголовок", "Ассистент: текст", "Ассистент: примеры вопросов",
  ];
  for (const f of mainFields) if (!main[f]) fail(`на листе «Главная» не заполнено поле «${f}»`);

  const levels: Level[] = ["Новичок", "Средний", "Продвинутый"];
  const courses = get("Курсы", ["Название", "Для кого", "Уровень", "Длительность", "Формат", "Цена", "Фото"]).map((r) => {
    if (!levels.includes(r["Уровень"] as Level)) {
      fail(`курс «${r["Название"]}»: уровень должен быть одним из: ${levels.join(", ")}`);
    }
    return {
      title: r["Название"],
      audience: r["Для кого"],
      level: r["Уровень"] as Level,
      duration: r["Длительность"],
      format: r["Формат"],
      price: r["Цена"],
      photo: r["Фото"],
    };
  });

  return {
    main,
    courses,
    steps: get("Шаги", ["Шаг", "Описание"]).map((r) => ({ title: r["Шаг"], text: r["Описание"] })),
    faq: get("Вопросы", ["Вопрос", "Ответ"]).map((r) => ({ question: r["Вопрос"], answer: r["Ответ"] })),
    gallery: get("Галерея", ["Фото", "Описание для незрячих"]).map((r) => ({
      photo: r["Фото"],
      alt: r["Описание для незрячих"],
    })),
  };
}
