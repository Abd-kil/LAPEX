import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { HtmlLocaleSync } from "./components/i18n/HtmlLocaleSync";
import { HtmlThemeSync } from "./components/theme/HtmlThemeSync";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LAPEX",
  description: "Online store UI (training project)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`}>
        <HtmlLocaleSync />
        <HtmlThemeSync />
        {children}
      </body>
    </html>
  );
}
