import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../guard";

export const dynamic = "force-dynamic";

export default async function AdminArticles({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/articles" />;

  const { deleted } = await searchParams;
  const rows = await db.article.findMany({ orderBy: { title: "asc" }, include: { area: true } });

  return (
    <>
      <SiteHeader locale={locale} next="/admin/articles" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin" className="back">← {t.admin.title}</Link></div>
          <div className="admin-head">
            <h2 className="ptitle">{t.admin.manageArticles} <span className="admin-count">{rows.length}</span></h2>
            <Link href="/admin/articles/new" className="btn primary">+ {t.admin.newItem}</Link>
          </div>

          {deleted && <div className="flash ok">{t.admin.actionDelete} ✓</div>}

          <div className="tablewrap admin-table">
            <table>
              <thead>
                <tr>
                  <th>{t.admin.fTitle}</th>
                  <th>{t.admin.fCategory}</th>
                  <th>{t.admin.fStatus}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <b dir="auto">{a.title}</b>
                      {a.sensitivity === "restricted" && <span className="badge rejected" style={{ marginInlineStart: 8 }}>CARE</span>}
                    </td>
                    <td className="muted">{t.enc.categories[a.category] ?? a.category}</td>
                    <td className="muted">{a.status}</td>
                    <td className="admin-actions-cell">
                      <Link href={`/encyclopedie/${a.slug}`} className="tag">/{a.slug}</Link>
                      <Link href={`/admin/articles/${a.slug}/edit`} className="btn small-btn">{t.admin.edit}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
