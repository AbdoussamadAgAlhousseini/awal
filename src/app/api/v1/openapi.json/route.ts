import { json, preflight, requestOrigin } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

/** GET /api/v1/openapi.json — spécification OpenAPI 3.1 de l'API publique (§22). */
export async function GET(request: Request) {
  const origin = requestOrigin(request);

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Awal — API publique",
      version: "1.0.0",
      description:
        "API en lecture publique du lexique tamasheq. Contenu sous licence CC BY-SA. " +
        "Les identifiants sont des slugs stables (§8). Le contenu d'amorçage reste à valider.",
      license: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    },
    servers: [{ url: `${origin}/api/v1` }],
    paths: {
      "/lexemes": {
        get: {
          summary: "Lister ou rechercher des entrées",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" }, description: "Recherche (latin, tifinagh, sens). Vide = liste." },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": {
              description: "Page de résultats",
              content: { "application/json": { schema: { $ref: "#/components/schemas/LexemeList" } } },
            },
          },
        },
      },
      "/lexemes/{slug}": {
        get: {
          summary: "Obtenir une entrée",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" }, example: "aman" },
            { name: "format", in: "query", schema: { type: "string", enum: ["json", "jsonld"] }, description: "jsonld = Ontolex-Lemon" },
          ],
          responses: {
            "200": {
              description: "Entrée",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Lexeme" } },
                "application/ld+json": { schema: { type: "object" } },
              },
            },
            "404": { description: "Introuvable" },
          },
        },
      },
      "/lexicon.jsonld": {
        get: {
          summary: "Exporter tout le lexique en Linked Data (Ontolex-Lemon)",
          responses: { "200": { description: "Jeu de données JSON-LD", content: { "application/ld+json": { schema: { type: "object" } } } } },
        },
      },
      "/areas": {
        get: {
          summary: "Lister les aires dialectales",
          responses: { "200": { description: "Aires + géométrie indicative" } },
        },
      },
    },
    components: {
      schemas: {
        Lexeme: {
          type: "object",
          properties: {
            id: { type: "string", description: "Slug stable", example: "aman" },
            headword: { type: "string", example: "aman" },
            tifinagh: { type: "string", example: "ⴰⵎⴰⵏ" },
            ipa: { type: "string", nullable: true, example: "/aˈman/" },
            pos: { type: "string", example: "nom" },
            root: { type: "string", nullable: true, example: "M-N" },
            senses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  order: { type: "integer" },
                  definition: { type: "string" },
                  translations: { type: "object", additionalProperties: { type: "string" } },
                  examples: { type: "array", items: { type: "object" } },
                },
              },
            },
            variants: { type: "array", items: { type: "object" } },
            conjugation: { type: "array", items: { type: "object" }, nullable: true },
          },
        },
        LexemeList: {
          type: "object",
          properties: {
            version: { type: "string" },
            count: { type: "integer" },
            limit: { type: "integer" },
            offset: { type: "integer" },
            next: { type: "string", nullable: true },
            data: { type: "array", items: { $ref: "#/components/schemas/Lexeme" } },
          },
        },
      },
    },
  };

  return json(spec);
}
