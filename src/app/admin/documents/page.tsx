import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../guard";

export const dynamic = "force-dynamic";

function rightsBadge(rights: string) {
  return rights === "open" ? "approved" : rights === "restricted" ? "pending" : "rejected";
}

export default async function AdminDocuments({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/documents" />;

  const { deleted } = await searchParams;
  const rows = await db.document.findMany({ orderBy: [{ kind: "asc" }, { title: "asc" }] });

  return (
    <>
      <SiteHeader locale={locale} next="/admin/documents" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin" className="back">← {t.admin.title}</Link></div>
          <div className="admin-head">
            <h2 className="ptitle">{t.admin.manageDocuments} <span className="admin-count">{rows.length}</span></h2>
            <Link href="/admin/documents/new" className="btn primary">+ {t.admin.newItem}</Link>
          </div>

          {deleted && <div className="flash ok">{t.admin.actionDelete} ✓</div>}

          <div className="tablewrap admin-table">
            <table>
              <thead>
                <tr>
                  <th>{t.admin.fTitle}</th>
                  <th>{t.lib.kind}</th>
                  <th>{t.lib.rights}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <b dir="auto">{d.title}</b>
                      {d.author && <span className="muted small"> — {d.author}</span>}
                    </td>
                    <td className="muted">{t.lib.kinds[d.kind] ?? d.kind}</td>
                    <td>
                      <span className={`badge ${rightsBadge(d.rights)}`}>
                        {d.rights === "open" ? t.lib.open : d.rights === "restricted" ? t.lib.restricted : t.lib.unknown}
                      </span>
                    </td>
                    <td className="admin-actions-cell">
                      <Link href={`/bibliotheque/${d.id}`} className="tag">↗</Link>
                      <Link href={`/admin/documents/${d.id}/edit`} className="btn small-btn">{t.admin.edit}</Link>
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
