import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];

  const doc = await db.document.findUnique({
    where: { id },
    include: { articles: { include: { article: true } } },
  });

  if (!doc) notFound();

  const rights =
    doc.rights === "open" ? t.lib.open : doc.rights === "restricted" ? t.lib.restricted : t.lib.unknown;
  const badge = doc.rights === "open" ? "approved" : doc.rights === "restricted" ? "pending" : "rejected";

  const rows: [string, string | null][] = [
    [t.lib.author, doc.author],
    [t.lib.year, doc.year],
    [t.lib.kind, t.lib.kinds[doc.kind] ?? doc.kind],
    [t.lib.language, doc.language],
  ];

  return (
    <>
      <SiteHeader locale={locale} next={`/bibliotheque/${doc.id}`} />
      <div className="wrap">
        <article className="panel-section">
          <Link href="/bibliotheque" className="back">← {t.lib.title}</Link>

          <div className="art-meta">
            <span className="ckind">{t.lib.kinds[doc.kind] ?? doc.kind}</span>
            <span className={`badge ${badge}`}>{rights}</span>
          </div>

          <h2 className="ptitle">{doc.title}</h2>

          {doc.description && <p className="art-lead" dir="auto">{doc.description}</p>}

          <dl className="payload doc-meta">
            {rows.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="prow">
                <dt>{k}</dt>
                <dd dir="auto">{v}</dd>
              </div>
            ))}
            <div className="prow">
              <dt>{t.lib.rights}</dt>
              <dd dir="auto">
                {rights}
                {doc.rightsNote ? ` — ${doc.rightsNote}` : ""}
              </dd>
            </div>
          </dl>

          {/* Le champ iiifManifest existe en base, mais aucune visionneuse n'est
              branchée : la plateforme n'héberge aucun document numérisé. */}
          <div className="flash warn">{t.lib.noViewer}</div>

          {doc.url && doc.rights === "open" && (
            <p>
              <a href={doc.url} className="btn" target="_blank" rel="noopener noreferrer">
                {t.lib.consult} ↗
              </a>
            </p>
          )}

          {doc.articles.length > 0 && (
            <section className="art-rel">
              <h3 className="sub-h">{t.lib.inArticles}</h3>
              <ul className="clist">
                {doc.articles.map(({ article }) => (
                  <li key={article.id} className="citem">
                    <Link href={`/encyclopedie/${article.slug}`} className="clabel">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
