import { messages, type Locale } from "@/lib/i18n";
import type { Recording } from "@/lib/audio";

/**
 * Prononciations d'une entrée (§11). Plusieurs enregistrements, plusieurs locuteurs,
 * plusieurs aires. Les enregistrements sans consentement sont filtrés en amont
 * (src/lib/audio.ts) et n'arrivent jamais jusqu'ici.
 */
export default function Recordings({
  recordings,
  locale,
}: {
  recordings: Recording[];
  locale: Locale;
}) {
  const t = messages[locale];

  return (
    <section className="rec">
      <h3 className="sub-h">{t.audio.title}</h3>

      {recordings.length === 0 ? (
        <p className="rec-empty">{t.audio.none}</p>
      ) : (
        <ul className="rec-list">
          {recordings.map((r) => (
            <li key={r.id} className="rec-item">
              <audio controls preload="none" src={r.uri} className="rec-player">
                <a href={r.uri}>{t.audio.title}</a>
              </audio>
              <div className="rec-meta">
                {r.speaker && (
                  <span>
                    <b>{t.audio.speaker}</b> {r.speaker}
                  </span>
                )}
                {r.area && (
                  <span>
                    <b>{t.audio.area}</b> {r.area}
                  </span>
                )}
                {r.ipa && (
                  <span className="rec-ipa" dir="ltr">{r.ipa}</span>
                )}
                {r.license && (
                  <span>
                    <b>{t.audio.license}</b> {r.license}
                  </span>
                )}
              </div>
              {r.notes && <p className="rec-notes" dir="auto">{r.notes}</p>}
            </li>
          ))}
        </ul>
      )}

      <p className="rec-consent">{t.audio.consentGate}</p>
    </section>
  );
}
