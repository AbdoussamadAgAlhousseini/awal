import Link from "next/link";
import { setLocale } from "@/app/actions";
import { messages, type Locale } from "@/lib/i18n";

export default function SiteHeader({ locale, next }: { locale: Locale; next: string }) {
  const t = messages[locale];
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="Awal">
          <span className="g tif">ⴰⵡⴰⵍ</span>
          <span className="w">Awal</span>
          <span className="s">{t.subtitle}</span>
        </Link>

        <form action={setLocale} className="langswitch" aria-label={t.langLabel}>
          <input type="hidden" name="next" value={next} />
          {(["fr", "en", "ar"] as const).map((code) => (
            <button
              key={code}
              type="submit"
              name="locale"
              value={code}
              className={locale === code ? "on" : ""}
              aria-pressed={locale === code}
              lang={code}
            >
              {code === "ar" ? "ع" : code.toUpperCase()}
            </button>
          ))}
        </form>
      </div>
    </header>
  );
}
