import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

/** Écran « accès refusé » commun aux pages d'administration (§19, §25). */
export function AdminDenied({ locale, next }: { locale: Locale; next: string }) {
  const t = messages[locale];
  return (
    <>
      <SiteHeader locale={locale} next={next} />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.admin.title}</h2>
          <div className="flash warn">
            {t.admin.denied} <Link href="/compte">→ {t.nav.account}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
