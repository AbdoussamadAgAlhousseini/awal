import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, posLabel, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../guard";

export const dynamic = "force-dynamic";

export default async function AdminLexemes({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; q?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/lexemes" />;

  const { deleted, q = "" } = await searchParams;
  const term = q.trim();

  const rows = await db.lexeme.findMany({
    where: term
      ? { OR: [{ headword: { contains: term } }, { tifinagh: { contains: term } }] }
      : {},
    orderBy: { headword: "asc" },
    include: { senses: { orderBy: { order: "asc" }, take: 1, select: { defShort: true } } },
  });

  return (
    <>
      <SiteHeader locale={locale} next="/admin/lexemes" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb">
            <Link href="/admin" className="back">← {t.admin.title}</Link>
          </div>
          <h2 className="ptitle">{t.admin.manageLexemes} <span className="admin-count">{rows.length}</span></h2>

          {deleted && <div className="flash ok">{t.admin.actionDelete} ✓</div>}

          <form className="admin-search" action="/admin/lexemes" method="get" role="search">
            <input type="search" name="q" defaultValue={q} placeholder={t.searchPlaceholder} dir="auto" />
            <button type="submit" className="btn">{t.searchBtn}</button>
          </form>

          <div className="tablewrap admin-table">
            <table>
              <thead>
                <tr>
                  <th>{t.contrib.headword}</th>
                  <th>{t.contrib.pos}</th>
                  <th>{t.contrib.definition}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lx) => (
                  <tr key={lx.id}>
                    <td>
                      <span className="tif gold" style={{ marginInlineEnd: 8 }}>{lx.tifinagh}</span>
                      <b>{lx.headword}</b>
                    </td>
                    <td className="muted">{posLabel(locale, lx.pos)}</td>
                    <td className="muted" dir="auto">{lx.senses[0]?.defShort ?? "—"}</td>
                    <td className="admin-actions-cell">
                      <Link href={`/mot/${lx.slug}`} className="tag">/mot/{lx.slug}</Link>
                      <Link href={`/admin/lexemes/${lx.slug}/edit`} className="btn small-btn">{t.admin.edit}</Link>
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
