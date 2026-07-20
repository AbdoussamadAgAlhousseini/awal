// Awal — sérialisation publique (§22).
//
// Une seule source de vérité pour la forme des entrées exposées : l'API REST et les
// exports Linked Data en dépendent, afin qu'ils ne divergent jamais.
//
// L'identifiant public est le SLUG (§8), stable et citable. Le cuid interne n'est
// jamais exposé.

import type { Prisma } from "@prisma/client";

export const LEXEME_INCLUDE = {
  root: { select: { radicals: true } },
  senses: {
    orderBy: { order: "asc" as const },
    select: { order: true, defShort: true, defLong: true, translations: true, examples: { select: { text: true, translation: true } } },
  },
  variants: { select: { form: true, ipa: true, area: { select: { code: true, country: true } } } },
  verbStems: { select: { aspect: true, stem: true, attested: true } },
} satisfies Prisma.LexemeInclude;

export type LexemeWithRelations = Prisma.LexemeGetPayload<{ include: typeof LEXEME_INCLUDE }>;

function parseTr(json: string | null): Record<string, string> {
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
}

/** Représentation JSON « plate » d'une entrée, pour l'API REST. */
export function lexemeToJSON(lx: LexemeWithRelations) {
  return {
    id: lx.slug,
    headword: lx.headword,
    tifinagh: lx.tifinagh,
    ipa: lx.ipa,
    pos: lx.pos,
    gender: lx.gender,
    number: lx.number,
    register: lx.register,
    frequency: lx.frequency,
    etymology: lx.etymology,
    root: lx.root?.radicals ?? null,
    senses: lx.senses.map((s) => ({
      order: s.order,
      definition: s.defShort,
      definitionLong: s.defLong,
      translations: parseTr(s.translations),
      examples: s.examples.map((e) => ({ text: e.text, translation: e.translation })),
    })),
    variants: lx.variants.map((v) => ({
      area: v.area.code,
      country: v.area.country,
      form: v.form,
      ipa: v.ipa,
    })),
    conjugation: lx.verbStems.length
      ? lx.verbStems.map((s) => ({ aspect: s.aspect, stem: s.stem, attested: s.attested }))
      : undefined,
  };
}

/** URL absolue d'une ressource, dérivée de l'origine de la requête. */
export function resourceUrl(origin: string, slug: string): string {
  return `${origin}/api/v1/lexemes/${slug}`;
}
