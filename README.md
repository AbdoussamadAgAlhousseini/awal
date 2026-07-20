# Awal ⴰⵡⴰⵍ — plateforme mondiale de la langue tamasheq

> **v0.5** — dictionnaire trilingue, contribution communautaire, modération et recherche phonétique.
> Jalons de la feuille de route du [dossier de conception](https://claude.ai/code/artifact/58fad4b0-8826-446b-8572-2f084a121724).

Awal (« la parole / le mot ») vise à devenir la référence numérique mondiale de la langue
tamasheq et du patrimoine touareg : dictionnaire, encyclopédie, atlas, bibliothèque,
apprentissage, laboratoire linguistique et API ouverte.

## Stack

- **Next.js 15** (App Router, React 19, Server Components & Server Actions)
- **Prisma 6** + **SQLite** en dev — portable vers PostgreSQL (§23)
- Identité visuelle « nuit du désert » (indigo · sable · or ocre · tifinagh), thèmes clair & sombre

## Démarrer

```bash
npm install
cp .env.example .env.local     # puis choisissez un AWAL_MODERATOR_CODE
npm run setup                  # base SQLite + données d'amorçage
npm run dev                    # http://localhost:3000
```

## Fonctionnalités

| Route | Rôle |
|-------|------|
| `/bienvenue` | Choix de la langue au premier écran (FR / EN / AR) |
| `/` | Recherche à trois niveaux (voir ci-dessous) |
| `/mot/[id]` | Fiche : sens, traductions fr/en/ar, racine, étymologie, variantes |
| `/contribuer` | Proposer un mot, un exemple ou une variante dialectale |
| `/moderation` | File de validation (réservée aux valideurs) |
| `/compte` | Identité pseudonyme, réputation, mes contributions |
| `/api/lexemes?q=…` | API JSON publique (préfigure l'API v1, §22) |

### Recherche (§13)

Trois niveaux, les deux derniers servant de **repli** (« vouliez-vous dire… ») :

1. **Lexical** — forme exacte, préfixe, sous-chaîne, variante, traduction (filtré en base) ;
2. **Phonétique** — squelette consonantique : le tamasheq étant une langue à racines,
   les voyelles sont retirées et les consonnes confondues à l'écrit fusionnées
   (`g/ɣ`, `k/q`, `t/ṭ`, `d/ḍ`…). `amghar` ≡ `amgar`, `awal` ≡ `aoual` ≡ `ⴰⵡⴰⵍ` ;
3. **Flou** — distance de Levenshtein ≤ 2 (`amane` → `aman`).

La translittération tifinagh ↔ latin est appliquée en amont, donc les trois écritures
et l'arabe interrogent le même index.

### Contribution & modération (§18)

- Trois types de propositions : **nouveau mot**, **exemple d'usage**, **variante dialectale**.
- Tout passe par une file de validation ; rien n'est publié sans relecture.
- À l'approbation : application au lexique, **journal d'audit** (`Revision`) et
  **réputation** du contributeur (+5 / +2).
- **Un valideur ne peut pas valider sa propre proposition** — elle reste en attente
  pour un autre relecteur.

## Modèle de données

Voir [`prisma/schema.prisma`](prisma/schema.prisma) : `Lexeme`, `Sense`, `Example`, `Root`,
`Variant`, `Area`, `Media`, `Speaker`, `Source`, `User`, `Contribution`, `Revision` — aligné sur §21.

## ⚠️ Limites assumées à ce stade

- **Contenu lexical d'exemple**, à valider par des locuteurs et un comité scientifique.
- **Identité pseudonyme sans mot de passe** : le code de modération est un garde simple.
  L'authentification réelle (OAuth2/OIDC + MFA, §25) est un prérequis de la v1.0.
- **Identifiants non stables** : un `npm run setup` régénère les ID, donc les URL de fiches
  changent. Des identifiants persistants et citables sont requis avant toute diffusion (§8).
- **Recherche en mémoire** pour les niveaux 2-3 : correct à cette échelle, à migrer vers
  OpenSearch + `pg_trgm` (§13, §26).
- « Awal » est un **nom de travail**, à valider avec les institutions partenaires.

## Suite (v1.0)

Encyclopédie, bibliothèque IIIF, atlas linguistique, conjugueur (FST), apprentissage &
répétition espacée, API publique v1 et exports Linked Data.
