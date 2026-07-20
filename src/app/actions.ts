"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/locale";

/** Enregistre la langue choisie (cookie 1 an) puis revient à la page voulue. */
export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");
  const next = String(formData.get("next") || "/");

  if (isLocale(locale)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  redirect(next.startsWith("/") ? next : "/");
}
