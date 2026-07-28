import Link from "next/link";
import { setLocale } from "@/app/actions";
import { messages, type Locale } from "@/lib/i18n";
import { getCurrentUser, isModerator } from "@/lib/session";

export default async function SiteHeader({ locale, next }: { locale: Locale; next: string }) {
  const t = messages[locale];
  const user = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="Awal">
          <span className="g tif">ⴰⵡⴰⵍ</span>
          <span className="w">Awal</span>
          <span className="s">{t.subtitle}</span>
        </Link>

        <nav className="mainnav">
          <Link href="/apprendre">{t.nav.learn}</Link>
          <Link href="/encyclopedie">{t.nav.enc}</Link>
          <Link href="/bibliotheque">{t.nav.lib}</Link>
          <Link href="/atlas">{t.nav.atlas}</Link>
          <Link href="/api-doc">{t.apiNav}</Link>
          <Link href="/contribuer">{t.nav.contribute}</Link>
          {isModerator(user) && <Link href="/moderation">{t.nav.moderation}</Link>}
          {isModerator(user) && <Link href="/admin">{t.nav.admin}</Link>}
          <Link href="/compte">
            {user ? user.pseudonym : t.nav.account}
          </Link>
        </nav>

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
