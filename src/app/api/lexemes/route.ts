import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Ancienne route non versionnée : conservée en redirection vers l'API v1 (§22). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  redirect(`/api/v1/lexemes${url.search}`);
}
