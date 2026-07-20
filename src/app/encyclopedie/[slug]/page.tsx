import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];

  const article = await db.article.findUnique({
    where: { slug },
    include: {
      area: true,
      lexemes: { include: { lexeme: { include: { senses: { take: 1, orderBy: { order: "asc" } } } } } },
      documents: { include: { document: true } },
    },
  });

  if (!article || article.status !== "published") notFound();

  const restricted = article.sensitivity === "restricted";

  return (
    <>
      <SiteHeader locale={locale} next={`/encyclopedie/${article.slug}`} />
      <div className="wrap">
        <article className="panel-section article">
          <Link href="/encyclopedie" className="back">← {t.enc.title}</Link>

          <div className="art-meta">
            <span className="art-cat">{t.enc.categories[article.category] ?? article.category}</span>
            {article.area && (
              <span className="muted small">
                {t.enc.area} : {article.area.country}
              </span>
            )}
          </div>

          <h2 className="ptitle">{article.title}</h2>
          <p className="art-lead" dir="auto">{article.summary}</p>

          {restricted ? (
            <div className="restricted">
              <h3>{t.enc.restrictedTitle}</h3>
              <p>{t.enc.restricted}</p>
              {article.restrictionNote && (
                <p className="restricted-note" dir="auto">{article.restrictionNote}</p>
              )}
            </div>
          ) : (
            <div className="art-body" dir="auto">
              {article.body.split(/\n\s*\n/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {article.lexemes.length > 0 && (
            <section className="art-rel">
              <h3 className="sub-h">{t.enc.relatedTerms}</h3>
              <div className="chips" style={{ justifyContent: "flex-start" }}>
                {article.lexemes.map(({ lexeme }) => (
                  <Link key={lexeme.id} className="chip" href={`/mot/${lexeme.id}`}>
                    <span className="tif">{lexeme.tifinagh}</span> {lexeme.headword}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {article.documents.length > 0 && (
            <section className="art-rel">
              <h3 className="sub-h">{t.enc.furtherReading}</h3>
              <ul className="clist">
                {article.documents.map(({ document }) => (
                  <li key={document.id} className="citem">
                    <span className="ckind">{t.lib.kinds[document.kind] ?? document.kind}</span>
                    <Link href={`/bibliotheque/${document.id}`} className="clabel">
                      {document.title}
                    </Link>
                    {document.author && <span className="muted small">{document.author}</span>}
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
