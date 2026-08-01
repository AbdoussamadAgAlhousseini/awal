import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../../../guard";
import { updateArticle, deleteArticle } from "../../../actions";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticle({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  const { slug } = await params;
  if (!isModerator(user)) return <AdminDenied locale={locale} next={`/admin/articles/${slug}/edit`} />;

  const { saved } = await searchParams;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) notFound();

  const areas = await db.area.findMany({ orderBy: { country: "asc" }, select: { id: true, country: true, code: true } });

  return (
    <>
      <SiteHeader locale={locale} next={`/admin/articles/${article.slug}/edit`} />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin/articles" className="back">← {t.admin.manageArticles}</Link></div>
          <h2 className="ptitle" dir="auto">{article.title}</h2>
          {saved && <div className="flash ok">{t.admin.saved}</div>}
          <div className="note">
            <b>{t.cite.permalink} :</b> <code className="pl-url" dir="ltr">/encyclopedie/{article.slug}</code> — {t.admin.slugFixed}
          </div>

          <ArticleForm
            locale={locale}
            action={updateArticle}
            areas={areas}
            article={{
              id: article.id,
              title: article.title,
              summary: article.summary,
              body: article.body,
              category: article.category,
              areaId: article.areaId,
              sensitivity: article.sensitivity,
              restrictionNote: article.restrictionNote,
              status: article.status,
            }}
          />

          <form action={deleteArticle} className="admin-danger">
            <input type="hidden" name="id" value={article.id} />
            <button type="submit" className="btn danger">{t.admin.del}</button>
            <span className="muted small">{t.admin.delHint}</span>
          </form>
        </section>
      </div>
    </>
  );
}
