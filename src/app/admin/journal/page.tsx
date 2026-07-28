import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../guard";

export const dynamic = "force-dynamic";

function label(t: (typeof messages)[Locale], action: string) {
  if (action === "create") return t.admin.actionCreate;
  if (action === "update") return t.admin.actionUpdate;
  if (action === "delete") return t.admin.actionDelete;
  return action;
}

function badgeClass(action: string) {
  if (action === "create") return "approved";
  if (action === "delete") return "rejected";
  return "pending";
}

export default async function AdminJournal() {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/journal" />;

  const rows = await db.revision.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  // Résolution des auteurs pour un affichage lisible.
  const userIds = [...new Set(rows.map((r) => r.userId).filter((v): v is string => Boolean(v)))];
  const users = userIds.length
    ? await db.user.findMany({ where: { id: { in: userIds } }, select: { id: true, pseudonym: true } })
    : [];
  const nameBy = new Map(users.map((u) => [u.id, u.pseudonym]));

  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" });

  return (
    <>
      <SiteHeader locale={locale} next="/admin/journal" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb">
            <Link href="/admin" className="back">← {t.admin.title}</Link>
          </div>
          <h2 className="ptitle">{t.admin.journalTitle} <span className="admin-count">{rows.length}</span></h2>

          {rows.length === 0 ? (
            <div className="flash warn">{t.admin.journalEmpty}</div>
          ) : (
            <div className="tablewrap admin-table">
              <table>
                <thead>
                  <tr>
                    <th>{t.admin.colWhen}</th>
                    <th>{t.admin.colAction}</th>
                    <th>{t.admin.colEntity}</th>
                    <th>{t.mod.by}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="muted small" style={{ whiteSpace: "nowrap" }}>{fmt.format(r.createdAt)}</td>
                      <td><span className={`badge ${badgeClass(r.action)}`}>{label(t, r.action)}</span></td>
                      <td>
                        <span className="ckind">{r.entity}</span>{" "}
                        <code className="tag" dir="ltr">{r.entityId.slice(0, 8)}…</code>
                      </td>
                      <td className="muted small">{r.userId ? nameBy.get(r.userId) ?? "—" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
