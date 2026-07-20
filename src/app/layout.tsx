import type { Metadata } from "next";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, dir } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awal — dictionnaire de la langue tamasheq",
  description:
    "Awal (ⴰⵡⴰⵍ) — plateforme mondiale de référence de la langue tamasheq. MVP dictionnaire v0.1.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        {children}
        <footer className="footer">
          <div className="g tif">ⴰⵡⴰⵍ</div>
          <p>
            « aman d iman » — <em>{t.footerProverb}</em>
            <br />
            {t.footerNote}
          </p>
        </footer>
      </body>
    </html>
  );
}
