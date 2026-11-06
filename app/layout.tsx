import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Курсы фотографии Анны Канаки",
  description: "Онлайн-курсы по свадебной и семейной фотографии от фотографа Анны Канаки",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
