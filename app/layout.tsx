import type { Metadata } from "next";
import "./globals.css";

// Метадані вашого сайту
export const metadata: Metadata = {
  title: "English Grammar for Real Life",
  description: "12 тем для реального життя — зрозуміти логіку, а не зазубрювати правила",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      {/* Ми прибрали className з викликом шрифтів Geist, 
        щоб уникнути помилки "Unknown font Geist".
      */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}