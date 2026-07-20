# Awal ⴰⵡⴰⵍ — plateforme mondiale de la langue tamasheq

> MVP **dictionnaire v0.1** — premier jalon de la feuille de route du [dossier de conception](https://claude.ai/code/artifact/58fad4b0-8826-446b-8572-2f084a121724).

Awal (« la parole / le mot ») vise à devenir la référence numérique mondiale de la langue
tamasheq et du patrimoine touareg : dictionnaire, encyclopédie, atlas, bibliothèque,
apprentissage, laboratoire linguistique et API ouverte.

Ce dépôt contient le **socle exécutable** du dictionnaire : modèle de données, recherche,
fiche de mot, variantes dialectales et une API JSON.

## Stack

- **Next.js 15** (App Router, React 19, Server Components)
- **Prisma 6** + **SQLite** en dev — portable vers PostgreSQL (voir §23 du dossier)
- Identité visuelle « nuit du désert » (indigo · sable · or-ocre · tifinagh), thèmes clair & sombre

## Démarrer

```bash
npm install
npm run setup     # crée la base SQLite + amorce les données d'exemple
npm run dev       # http://localhost:3000
```

## Ce qui marche déjà

| Route | Rôle |
|-------|------|
| `/` | Accueil + recherche (latin, tifinagh, ou par sens en français) |
| `/mot/[id]` | Fiche complète : sens multiples, traductions fr/en/ar, racine, étymologie, variantes par pays |
| `/api/lexemes?q=…` | API JSON publique (préfigure l'API v1 du §22) |

## Modèle de données

Voir [`prisma/schema.prisma`](prisma/schema.prisma) : `Lexeme`, `Sense`, `Example`, `Root`,
`Variant`, `Area`, `Media`, `Speaker`, `Source` — aligné sur le §21 du dossier.

## ⚠️ Contenu

Les 10 entrées d'amorçage sont des **données d'EXEMPLE**, transcriptions simplifiées, **à valider
par des locuteurs et un comité scientifique** avant toute publication de référence. Le nom « Awal »
est un nom de travail à valider avec les institutions et communautés partenaires.

## Prochaines étapes (extrait roadmap)

- Recherche phonétique & floue, translittération latin ↔ tifinagh
- Contribution + modération + réputation (v0.5)
- Audio multi-locuteurs, conjugueur, encyclopédie, atlas (v1.0)
- Bascule PostgreSQL + OpenSearch + pgvector à l'échelle
