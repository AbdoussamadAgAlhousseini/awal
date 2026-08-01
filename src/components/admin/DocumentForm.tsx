import { messages, type Locale } from "@/lib/i18n";

const KINDS = ["livre", "article", "manuscrit", "audio", "video", "archive"];

type DocumentValues = {
  id: string;
  title: string;
  author: string | null;
  year: string | null;
  kind: string;
  language: string | null;
  description: string | null;
  rights: string;
  rightsNote: string | null;
  url: string | null;
};

/** Formulaire de document de bibliothèque, partagé entre création et édition (§16, §19). */
export default function DocumentForm({
  locale,
  action,
  document: d,
}: {
  locale: Locale;
  action: (formData: FormData) => void;
  document?: DocumentValues;
}) {
  const t = messages[locale];
  const rights: [string, string][] = [
    ["open", t.lib.open],
    ["restricted", t.lib.restricted],
    ["unknown", t.lib.unknown],
  ];

  return (
    <form action={action} className="form">
      {d && <input type="hidden" name="id" value={d.id} />}

      <label className="field-row">
        <span>{t.admin.fTitle} *</span>
        <input name="title" defaultValue={d?.title ?? ""} required maxLength={200} dir="auto" />
      </label>

      <div className="grid2">
        <label className="field-row">
          <span>{t.lib.author}</span>
          <input name="author" defaultValue={d?.author ?? ""} maxLength={140} dir="auto" />
        </label>
        <label className="field-row">
          <span>{t.lib.year}</span>
          <input name="year" defaultValue={d?.year ?? ""} maxLength={20} dir="ltr" />
        </label>
        <label className="field-row">
          <span>{t.lib.kind}</span>
          <select name="kind" defaultValue={d?.kind ?? "livre"}>
            {KINDS.map((k) => <option key={k} value={k}>{t.lib.kinds[k] ?? k}</option>)}
          </select>
        </label>
        <label className="field-row">
          <span>{t.lib.language}</span>
          <input name="language" defaultValue={d?.language ?? ""} maxLength={60} dir="auto" />
        </label>
        <label className="field-row">
          <span>{t.lib.rights}</span>
          <select name="rights" defaultValue={d?.rights ?? "unknown"}>
            {rights.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="field-row">
          <span>{t.admin.fUrl}</span>
          <input name="url" type="url" defaultValue={d?.url ?? ""} maxLength={300} dir="ltr" placeholder="https://…" />
        </label>
      </div>

      <label className="field-row">
        <span>{t.admin.fRightsNote}</span>
        <input name="rightsNote" defaultValue={d?.rightsNote ?? ""} maxLength={300} dir="auto" />
      </label>

      <label className="field-row">
        <span>{t.admin.fDescription}</span>
        <textarea name="description" defaultValue={d?.description ?? ""} rows={6} dir="auto" />
      </label>

      <button type="submit" className="btn primary">{t.admin.save}</button>
    </form>
  );
}
