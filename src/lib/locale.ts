import { cookies } from "next/headers";
import { isLocale, type Locale } from "./i18n";

export const LOCALE_COOKIE = "awal_locale";

/** Locale choisie par l'utilisateur, ou null si aucun choix n'a encore été fait. */
export async function getLocale(): Promise<Locale | null> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : null;
}
