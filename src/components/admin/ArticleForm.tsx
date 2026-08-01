import { messages, type Locale } from "@/lib/i18n";

const CATEGORIES = [
  "histoire", "oralite", "musique", "artisanat",
  "pastoralisme", "habitat", "cosmologie", "coutume", "nature",
];

type ArticleValues = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  areaId: string | null;
  sensitivity: string;
  restrictionNote: string | null;
  status: string;
};

type Area = { id: string; country: string; code: string };

/** Formulaire de fiche encyclopédique, partagé entre création et édition (§9, §19). */
export default function ArticleForm({
  locale,
  action,
  areas,
  article,
}: {
  locale: Locale;
  action: (formData: FormData) => void;
  areas: Area[];
  article?: ArticleValues;
}) {
  const t = messages[locale];
  const a = article;
  const statuses: [string, string][] = [
    ["draft", t.admin.statusDraft],
    ["review", t.admin.statusReview],
    ["published", t.admin.statusPublished],
    ["archived", t.admin.statusArchived],
  ];

  return (
    <form action={action} className="form">
      {a && <input type="hidden" name="id" value={a.id} />}

      <label className="field-row">
        <span>{t.admin.fTitle} *</span>
        <input name="title" defaultValue={a?.title ?? ""} required maxLength={140} dir="auto" />
      </label>

      <div className="grid2">
        <label className="field-row">
          <span>{t.admin.fCategory}</span>
          <select name="category" defaultValue={a?.category ?? "histoire"}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{t.enc.categories[c] ?? c}</option>
            ))}
          </select>
        </label>
        <label className="field-row">
          <span>{t.admin.fStatus}</span>
          <select name="status" defaultValue={a?.status ?? "published"}>
            {statuses.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="field-row">
          <span>{t.enc.area}</span>
          <select name="areaId" defaultValue={a?.areaId ?? ""}>
            <option value="">—</option>
            {areas.map((ar) => <option key={ar.id} value={ar.id}>{ar.country} ({ar.code})</option>)}
          </select>
        </label>
        <label className="field-row">
          <span>{t.admin.fSensitivity}</span>
          <select name="sensitivity" defaultValue={a?.sensitivity ?? "public"}>
            <option value="public">{t.admin.sensPublic}</option>
            <option value="restricted">{t.admin.sensRestricted}</option>
          </select>
        </label>
      </div>

      <label className="field-row">
        <span>{t.admin.fRestrictionNote}</span>
        <input name="restrictionNote" defaultValue={a?.restrictionNote ?? ""} maxLength={400} dir="auto" />
      </label>

      <label className="field-row">
        <span>{t.admin.fSummary}</span>
        <input name="summary" defaultValue={a?.summary ?? ""} maxLength={300} dir="auto" />
      </label>

      <label className="field-row">
        <span>{t.admin.fBody}</span>
        <textarea name="body" defaultValue={a?.body ?? ""} rows={12} dir="auto" />
      </label>

      <button type="submit" className="btn primary">{t.admin.save}</button>
    </form>
  );
}
