import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const COPY = {
  fr: {
    title: "API publique",
    intro:
      "Le lexique tamasheq d'Awal est ouvert en lecture, sous licence CC BY-SA. Les identifiants sont des slugs stables, et chaque entrée est disponible en JSON ou en Linked Data (Ontolex-Lemon).",
    endpoints: "Points d'accès",
    try: "Essayer",
    ld: "Linked Data",
    ldNote:
      "L'export JSON-LD aligne le lexique sur Ontolex-Lemon et Dublin Core, le rendant interopérable (Wikidata, triplestores).",
    spec: "Spécification OpenAPI",
    license: "Licence & citation",
    licenseNote:
      "Contenu sous CC BY-SA 4.0. Attribuez « Awal — plateforme de la langue tamasheq » et citez le slug. Rappel : le contenu d'amorçage reste à valider scientifiquement.",
  },
  en: {
    title: "Public API",
    intro:
      "Awal's Tamasheq lexicon is open for reading under CC BY-SA. Identifiers are stable slugs, and every entry is available as JSON or Linked Data (Ontolex-Lemon).",
    endpoints: "Endpoints",
    try: "Try it",
    ld: "Linked Data",
    ldNote:
      "The JSON-LD export aligns the lexicon with Ontolex-Lemon and Dublin Core, making it interoperable (Wikidata, triplestores).",
    spec: "OpenAPI specification",
    license: "Licence & citation",
    licenseNote:
      "Content under CC BY-SA 4.0. Attribute “Awal — Tamasheq language platform” and cite the slug. Note: seed content is still to be scientifically validated.",
  },
  ar: {
    title: "الواجهة البرمجية العامة",
    intro:
      "معجم أوال للتماشق مفتوح للقراءة برخصة CC BY-SA. المعرّفات هي slugs ثابتة، وكل مدخل متاح بصيغة JSON أو بيانات مترابطة (Ontolex-Lemon).",
    endpoints: "نقاط الوصول",
    try: "جرّب",
    ld: "البيانات المترابطة",
    ldNote:
      "يوائم تصدير JSON-LD المعجم مع Ontolex-Lemon وDublin Core، مما يجعله قابلاً للتشغيل البيني.",
    spec: "مواصفة OpenAPI",
    license: "الرخصة والاقتباس",
    licenseNote:
      "المحتوى برخصة CC BY-SA 4.0. انسب العمل إلى «أوال — منصة اللغة التماشقية» واذكر المعرّف. تنبيه: محتوى الانطلاق ما زال بحاجة إلى تحقّق علمي.",
  },
} as const;

const ENDPOINTS = [
  { m: "GET", p: "/api/v1/lexemes?q=aman", d: { fr: "recherche / liste paginée", en: "search / paginated list", ar: "بحث / قائمة" } },
  { m: "GET", p: "/api/v1/lexemes/aman", d: { fr: "une entrée (JSON)", en: "one entry (JSON)", ar: "مدخل (JSON)" } },
  { m: "GET", p: "/api/v1/lexemes/aman?format=jsonld", d: { fr: "une entrée (Ontolex)", en: "one entry (Ontolex)", ar: "مدخل (Ontolex)" } },
  { m: "GET", p: "/api/v1/lexicon.jsonld", d: { fr: "tout le lexique (Linked Data)", en: "full lexicon (Linked Data)", ar: "كامل المعجم" } },
  { m: "GET", p: "/api/v1/areas", d: { fr: "aires dialectales", en: "dialect areas", ar: "المناطق اللهجية" } },
  { m: "GET", p: "/api/v1/openapi.json", d: { fr: "spécification OpenAPI", en: "OpenAPI spec", ar: "مواصفة OpenAPI" } },
];

export default async function ApiDoc() {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const c = COPY[locale];

  return (
    <>
      <SiteHeader locale={locale} next="/api-doc" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{c.title}</h2>
          <p className="muted" dir="auto">{c.intro}</p>

          <h3 className="sub-h">{c.endpoints}</h3>
          <div className="ep-list">
            {ENDPOINTS.map((e) => (
              <div key={e.p} className="ep-row">
                <span className="ep-method">{e.m}</span>
                <code className="ep-path" dir="ltr">{e.p}</code>
                <span className="ep-desc muted" dir="auto">{e.d[locale]}</span>
                <a className="ep-try" href={e.p} target="_blank" rel="noopener noreferrer">{c.try} ↗</a>
              </div>
            ))}
          </div>

          <h3 className="sub-h">{c.ld}</h3>
          <p className="muted" dir="auto">{c.ldNote}</p>

          <h3 className="sub-h">{c.spec}</h3>
          <p>
            <a className="btn" href="/api/v1/openapi.json" target="_blank" rel="noopener noreferrer">
              /api/v1/openapi.json ↗
            </a>
          </p>

          <div className="note" dir="auto">
            <b>{c.license}.</b> {c.licenseNote}
          </div>

          <p style={{ marginTop: 20 }}>
            <Link href="/" className="back">← Awal</Link>
          </p>
        </section>
      </div>
    </>
  );
}
