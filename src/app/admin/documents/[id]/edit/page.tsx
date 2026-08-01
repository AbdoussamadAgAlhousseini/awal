import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../../../guard";
import { updateDocument, deleteDocument } from "../../../actions";
import DocumentForm from "@/components/admin/DocumentForm";

export const dynamic = "force-dynamic";

export default async function EditDocument({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const user = await getCurrentUser();
  const { id } = await params;
  if (!isModerator(user)) return <AdminDenied locale={locale} next={`/admin/documents/${id}/edit`} />;

  const { saved } = await searchParams;
  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) notFound();

  return (
    <>
      <SiteHeader locale={locale} next={`/admin/documents/${doc.id}/edit`} />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb"><Link href="/admin/documents" className="back">← {t.admin.manageDocuments}</Link></div>
          <h2 className="ptitle" dir="auto">{doc.title}</h2>
          {saved && <div className="flash ok">{t.admin.saved}</div>}

          <DocumentForm
            locale={locale}
            action={updateDocument}
            document={{
              id: doc.id,
              title: doc.title,
              author: doc.author,
              year: doc.year,
              kind: doc.kind,
              language: doc.language,
              description: doc.description,
              rights: doc.rights,
              rightsNote: doc.rightsNote,
              url: doc.url,
            }}
          />

          <form action={deleteDocument} className="admin-danger">
            <input type="hidden" name="id" value={doc.id} />
            <button type="submit" className="btn danger">{t.admin.del}</button>
            <span className="muted small">{t.admin.delHint}</span>
          </form>
        </section>
      </div>
    </>
  );
}
