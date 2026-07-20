import { buildParadigm, ASPECT_LABELS } from "@/lib/conjugation.mjs";
import { messages, type Locale } from "@/lib/i18n";

type Stem = { aspect: string; stem: string; attested: boolean };

type Aspect = {
  aspect: string;
  documented: boolean;
  attested: boolean;
  stem: string | null;
  forms: { person: Record<string, string>; form: string }[];
};

export default function Conjugation({ stems, locale }: { stems: Stem[]; locale: Locale }) {
  const t = messages[locale];
  const paradigm = buildParadigm(stems) as Aspect[];

  return (
    <section className="conj">
      <h3 className="sub-h">{t.conj.title}</h3>

      <div className="conj-grid">
        {paradigm.map((asp) => {
          const label = ASPECT_LABELS[asp.aspect as keyof typeof ASPECT_LABELS][locale];
          return (
            <div key={asp.aspect} className="conj-card">
              <header className="conj-head">
                <span className="conj-aspect">{label}</span>
                {asp.documented && (
                  <>
                    <span className="conj-stem" dir="ltr">
                      {t.conj.stem} « {asp.stem} »
                    </span>
                    <span className={`badge ${asp.attested ? "approved" : "pending"}`}>
                      {asp.attested ? t.conj.attested : t.conj.toValidate}
                    </span>
                  </>
                )}
              </header>

              {asp.documented ? (
                <table className="conj-table">
                  <tbody>
                    {asp.forms.map(({ person, form }) => (
                      <tr key={person.code}>
                        <th scope="row">{person[locale]}</th>
                        <td dir="ltr">{form}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="conj-missing">{t.conj.notDocumented}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="conj-note">{t.conj.note}</p>
    </section>
  );
}
