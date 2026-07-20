import { db } from "@/lib/db";

export type Recording = {
  id: string;
  uri: string;
  ipa: string | null;
  notes: string | null;
  license: string | null;
  speaker: string | null;
  area: string | null;
};

/**
 * Enregistrements diffusables pour une entrée (§11).
 *
 * GARDE-FOU : un enregistrement dont le locuteur n'a pas donné son consentement
 * explicite n'est JAMAIS servi à l'interface publique (§11, §25). Le filtre est
 * appliqué ici, au niveau de l'accès aux données, et non dans le composant —
 * pour qu'aucune vue future ne puisse le contourner par oubli.
 */
export async function listPublishableRecordings(lexemeId: string): Promise<Recording[]> {
  const rows = await db.media.findMany({
    where: {
      lexemeId,
      kind: "audio",
      OR: [
        { speaker: { consent: true } },
        { speakerId: null }, // enregistrement institutionnel sans locuteur nommé
      ],
    },
    orderBy: { createdAt: "asc" },
    include: { speaker: { include: { area: true } } },
  });

  return rows.map((m) => ({
    id: m.id,
    uri: m.uri,
    ipa: m.ipa,
    notes: m.notes,
    license: m.license,
    speaker: m.speaker?.pseudonym ?? null,
    area: m.speaker?.area?.country ?? null,
  }));
}

/** Nombre d'enregistrements retenus faute de consentement — pour l'administration. */
export async function countWithheld(lexemeId: string): Promise<number> {
  return db.media.count({
    where: { lexemeId, kind: "audio", speaker: { consent: false } },
  });
}
