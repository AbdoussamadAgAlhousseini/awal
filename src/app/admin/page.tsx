import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "./guard";

export const dynamic = "force-dynamic";

export default async function AdminHub() {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();

  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin" />;

  const [entries, articles, documents, pending, areas] = await Promise.all([
    db.lexeme.count(),
    db.article.count(),
    db.document.count(),
    db.contribution.count({ where: { status: "pending" } }),
    db.area.count(),
  ]);

  const stats: [number, string][] = [
    [entries, t.admin.entries],
    [articles, t.admin.articles],
    [documents, t.admin.documents],
    [pending, t.admin.pending],
    [areas, t.admin.areas],
  ];

  return (
    <>
      <SiteHeader locale={locale} next="/admin" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.admin.title}</h2>
          <p className="muted">{t.admin.intro}</p>

          <div className="stats" style={{ marginTop: 20 }}>
            {stats.map(([v, l]) => (
              <div key={l} className="stat">
                <div className="v">{v}</div>
                <div className="l">{l}</div>
              </div>
            ))}
          </div>

          <div className="admin-links">
            <Link href="/admin/lexemes" className="btn primary">{t.admin.manageLexemes}</Link>
            <Link href="/admin/journal" className="btn">{t.admin.viewJournal}</Link>
            <Link href="/moderation" className="btn">{t.mod.title}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
