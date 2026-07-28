import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { refWhere } from "@/lib/lexeme-ref";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import { AdminDenied } from "../../../guard";
import { updateLexeme, deleteLexeme } from "../../../actions";

export const dynamic = "force-dynamic";

const POS_OPTIONS = ["nom", "verbe", "adjectif", "adverbe", "pronom", "numéral", "nom propre"];

function parseTr(json: string | null): Record<string, string> {
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
}

export default async function EditLexeme({
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
  if (!isModerator(user)) return <AdminDenied locale={locale} next={`/admin/lexemes/${slug}/edit`} />;

  const { saved } = await searchParams;

  const lx = await db.lexeme.findFirst({
    where: refWhere(slug),
    include: { senses: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!lx) notFound();

  const sense = lx.senses[0];
  const tr = parseTr(sense?.translations ?? null);

  return (
    <>
      <SiteHeader locale={locale} next={`/admin/lexemes/${lx.slug}/edit`} />
      <div className="wrap">
        <section className="panel-section">
          <div className="admin-crumb">
            <Link href="/admin/lexemes" className="back">← {t.admin.manageLexemes}</Link>
          </div>
          <h2 className="ptitle">
            <span className="tif gold" style={{ marginInlineEnd: 10 }}>{lx.tifinagh}</span>
            {lx.headword}
          </h2>

          {saved && <div className="flash ok">{t.admin.saved}</div>}

          <div className="note" dir="auto">
            <b>{t.cite.permalink} :</b> <code className="pl-url" dir="ltr">/mot/{lx.slug}</code> — {t.admin.slugFixed}
          </div>

          <form action={updateLexeme} className="form">
            <input type="hidden" name="id" value={lx.id} />

            <div className="grid2">
              <label className="field-row">
                <span>{t.contrib.headword}</span>
                <input name="headword" defaultValue={lx.headword} maxLength={80} dir="ltr" required />
              </label>
              <label className="field-row">
                <span>{t.contrib.tifinagh}</span>
                <input name="tifinagh" defaultValue={lx.tifinagh} maxLength={80} className="tif" dir="ltr" />
              </label>
              <label className="field-row">
                <span>{t.contrib.ipa}</span>
                <input name="ipa" defaultValue={lx.ipa ?? ""} maxLength={80} dir="ltr" />
              </label>
              <label className="field-row">
                <span>{t.contrib.pos}</span>
                <select name="pos" defaultValue={lx.pos}>
                  {POS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className="field-row">
                <span>{t.register}</span>
                <input name="register" defaultValue={lx.register ?? ""} maxLength={40} dir="auto" />
              </label>
              <label className="field-row">
                <span>{t.etymology}</span>
                <input name="etymology" defaultValue={lx.etymology ?? ""} maxLength={200} dir="auto" />
              </label>
            </div>

            <label className="field-row">
              <span>{t.contrib.definition}</span>
              <input name="defShort" defaultValue={sense?.defShort ?? ""} maxLength={200} dir="auto" required />
            </label>
            <label className="field-row">
              <span>{t.admin.defLong}</span>
              <input name="defLong" defaultValue={sense?.defLong ?? ""} maxLength={400} dir="auto" />
            </label>

            <div className="grid2">
              <label className="field-row">
                <span>{t.contrib.trFr}</span>
                <input name="trFr" defaultValue={tr.fr ?? ""} maxLength={120} dir="auto" />
              </label>
              <label className="field-row">
                <span>{t.contrib.trEn}</span>
                <input name="trEn" defaultValue={tr.en ?? ""} maxLength={120} dir="auto" />
              </label>
              <label className="field-row">
                <span>{t.contrib.trAr}</span>
                <input name="trAr" defaultValue={tr.ar ?? ""} maxLength={120} dir="auto" />
              </label>
            </div>

            <button type="submit" className="btn primary">{t.admin.save}</button>
          </form>

          <form action={deleteLexeme} className="admin-danger">
            <input type="hidden" name="id" value={lx.id} />
            <button type="submit" className="btn danger">{t.admin.del}</button>
            <span className="muted small">{t.admin.delHint}</span>
          </form>
        </section>
      </div>
    </>
  );
}
