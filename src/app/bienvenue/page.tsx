import { setLocale } from "@/app/actions";
import { welcome } from "@/lib/i18n";

export const dynamic = "force-dynamic";

// Écran d'accueil : premier contact, choix de la langue d'interface (FR / EN / AR).
export default function Welcome() {
  return (
    <section className="choose">
      <div className="choose-inner">
        <div className="choose-mark tif">ⴰⵡⴰⵍ</div>
        <div className="choose-kicker">{welcome.kicker}</div>

        <h1 className="choose-title">
          {welcome.titles.map((title, i) => (
            <span key={i} lang={welcome.cards[i].code} dir={welcome.cards[i].dir}>
              {title}
            </span>
          ))}
        </h1>

        <div className="choose-subs">
          {welcome.subs.map((sub, i) => (
            <p key={i} lang={welcome.cards[i].code} dir={welcome.cards[i].dir}>
              {sub}
            </p>
          ))}
        </div>

        <div className="choose-grid">
          {welcome.cards.map((c) => (
            <form key={c.code} action={setLocale}>
              <input type="hidden" name="next" value="/" />
              <button type="submit" name="locale" value={c.code} className="lang-card" dir={c.dir}>
                <span className="flagword">{c.code.toUpperCase()}</span>
                <span className="langname" lang={c.code}>{c.label}</span>
                <span className="go">{c.go}</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}
