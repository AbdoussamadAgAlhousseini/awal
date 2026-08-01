import Link from "next/link";
import { setLocale } from "@/app/actions";
import { messages, type Locale } from "@/lib/i18n";
import { getCurrentUser, isModerator } from "@/lib/session";
import NavMenu, { type NavLink } from "@/components/NavMenu";

export default async function SiteHeader({ locale, next }: { locale: Locale; next: string }) {
  const t = messages[locale];
  const user = await getCurrentUser();

  // Liste calculée côté serveur (dont les entrées réservées aux valideurs), passée
  // au menu responsive.
  const links: NavLink[] = [
    { href: "/apprendre", label: t.nav.learn },
    { href: "/jouer", label: t.nav.quiz },
    { href: "/encyclopedie", label: t.nav.enc },
    { href: "/bibliotheque", label: t.nav.lib },
    { href: "/atlas", label: t.nav.atlas },
    { href: "/tableau", label: t.nav.dash },
    { href: "/api-doc", label: t.apiNav },
    { href: "/contribuer", label: t.nav.contribute },
    ...(isModerator(user)
      ? [
          { href: "/moderation", label: t.nav.moderation },
          { href: "/admin", label: t.nav.admin },
        ]
      : []),
    { href: "/compte", label: user ? user.pseudonym : t.nav.account },
  ];

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="Awal">
          <span className="g tif">ⴰⵡⴰⵍ</span>
          <span className="w">Awal</span>
          <span className="s">{t.subtitle}</span>
        </Link>

        <NavMenu links={links} menuLabel={t.nav.menu} />

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
