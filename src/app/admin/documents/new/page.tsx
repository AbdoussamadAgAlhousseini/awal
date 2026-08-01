import Link from "next/link";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../../guard";
import { createDocument } from "../../actions";
import DocumentForm from "@/components/admin/DocumentForm";

export const dynamic = "force-dynamic";

export default async function NewDocument({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  if (!isModerator(user)) return <AdminDenied locale={locale} next="/admin/documents/new" />;

  const { e } = await searchParams;

  return (
    <>
      <SiteHeader locale={locale} next="/admin/documents/new" />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin/documents" className="back">← {t.admin.manageDocuments}</Link></div>
          <h2 className="ptitle">{t.admin.newItem} · {t.admin.manageDocuments}</h2>
          {e && <div className="flash err">{t.contrib.required}</div>}
          <DocumentForm locale={locale} action={createDocument} />
        </section>
      </div>
    </>
  );
}
