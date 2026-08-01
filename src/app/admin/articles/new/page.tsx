import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../../guard";
import { createArticle } from "../../actions";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticle({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/articles/new" />;

  const { e } = await searchParams;
  const areas = await db.area.findMany({ orderBy: { country: "asc" }, select: { id: true, country: true, code: true } });

  return (
    <>
      <SiteHeader locale={locale} next="/admin/articles/new" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin/articles" className="back">← {t.admin.manageArticles}</Link></div>
          <h2 className="ptitle">{t.admin.newItem} · {t.admin.manageArticles}</h2>
          {e && <div className="flash err">{t.contrib.required}</div>}
          <ArticleForm locale={locale} action={createArticle} areas={areas} />
        </section>
      </div>
    </>
  );
}
