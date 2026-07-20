import Link from "next/link";
import { signIn, signOut } from "@/app/actions";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { parsePayload } from "@/lib/contributions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function Account({ searchParams }: { searchParams: Promise<{ sent?: string; e?: string }> }) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { sent, e } = await searchParams;
  const user = await getCurrentUser();

  const mine = user
    ? await db.contribution.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 25,
        include: { lexeme: { select: { headword: true, id: true, slug: true } } },
      })
    : [];

  return (
    <>
      <SiteHeader locale={locale} next="/compte" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.acc.title}</h2>

          {sent && <div className="flash ok">{t.contrib.sent}</div>}
          {e && <div className="flash err">{t.contrib.required}</div>}

          {!user ? (
            <>
              <p className="muted">{t.acc.intro}</p>
              <form action={signIn} className="form">
                <label className="field-row">
                  <span>{t.acc.pseudonym}</span>
                  <input name="pseudonym" required maxLength={40} placeholder={t.acc.pseudonymPh} />
                </label>
                <label className="field-row">
                  <span>{t.acc.modCode}</span>
                  <input name="moderatorCode" type="text" autoComplete="off" />
                  <small className="muted">{t.acc.modCodeHint}</small>
                </label>
                <button type="submit" className="btn primary">{t.acc.signIn}</button>
              </form>
            </>
          ) : (
            <>
              <div className="profile">
                <div className="avatar tif">ⴰ</div>
                <div>
                  <div className="pname">{user.pseudonym}</div>
                  <div className="pmeta">
                    {t.acc.role} :{" "}
                    <b>{user.role === "moderator" ? t.acc.roleModerator : t.acc.roleContributor}</b>
                    {" · "}
                    {t.acc.reputation} : <b>{user.reputation}</b>
                  </div>
                </div>
                <form action={signOut} style={{ marginInlineStart: "auto" }}>
                  <button type="submit" className="btn">{t.acc.signOut}</button>
                </form>
              </div>

              <h3 className="sub-h">{t.acc.mine}</h3>
              {mine.length === 0 ? (
                <p className="muted">{t.acc.none}</p>
              ) : (
                <ul className="clist">
                  {mine.map((c) => {
                    const p = parsePayload(c.payload);
                    const label = p.headword || p.text || p.form || c.kind;
                    return (
                      <li key={c.id} className="citem">
                        <span className={`badge ${c.status}`}>
                          {c.status === "pending" ? t.mod.pending : c.status === "approved" ? t.mod.approved : t.mod.rejected}
                        </span>
                        <span className="ckind">{c.kind === "new_lexeme" ? t.contrib.kindNew : c.kind === "example" ? t.contrib.kindExample : t.contrib.kindVariant}</span>
                        <span className="clabel" dir="auto">{label}</span>
                        {c.lexeme && (
                          <Link href={`/mot/${c.lexeme.slug || c.lexeme.id}`} className="clink">{c.lexeme.headword}</Link>
                        )}
                        {c.reviewNote && <span className="cnote" dir="auto">« {c.reviewNote} »</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
