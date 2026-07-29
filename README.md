# Awal ⴰⵡⴰⵍ — plateforme mondiale de la langue tamasheq

> **v1.0** — dictionnaire trilingue, contribution & modération, recherche phonétique,
> conjugueur, atlas linguistique, encyclopédie, bibliothèque, apprentissage
> et prononciation multi-locuteurs.
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
cp .env.example .env.local     # toutes les variables sont vides par défaut
npm run setup                  # base SQLite + données d'amorçage
npm run dev                    # http://localhost:3000
```

Sans aucune variable renseignée, l'application tourne en **mode prototype**
(identité pseudonyme). Pour activer l'authentification réelle, voir ci-dessous.

## Fonctionnalités

| Route | Rôle |
|-------|------|
| `/bienvenue` | Choix de la langue au premier écran (FR / EN / AR) |
| `/` | Recherche à trois niveaux (voir ci-dessous) |
| `/mot/[slug]` | Fiche : sens, traductions fr/en/ar, racine, étymologie, variantes |
| `/encyclopedie` | Fiches culturelles par catégorie ; `/encyclopedie/[slug]` |
| `/bibliotheque` | Catalogue de références ; `/bibliotheque/[id]` |
| `/atlas` | Atlas linguistique ; `?terme=<slug>` cartographie la répartition d’un mot |
| `/apprendre` | Révision en répétition espacée (SM-2) |
| `/contribuer` | Proposer un mot, un exemple, une variante ou un enregistrement |
| `/moderation` | File de validation (réservée aux valideurs) |
| `/compte` | Identité pseudonyme, réputation, mes contributions |
| `/api-doc` | Portail développeur : points d'accès, Linked Data, OpenAPI |
| `/api/v1/…` | API publique v1 (voir ci-dessous) |

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

### Conjugueur (§12)

La conjugaison berbère se décompose en deux parties de nature très différente :

- **l'affixation personnelle** est régulière et partagée par les parlers → **le moteur la génère** ;
- **le radical de chaque aspect** dépend de la classe du verbe et est très irrégulier →
  **le moteur ne l'invente pas**. Un aspect sans radical documenté affiche
  « radical non documenté » au lieu d'une forme fabriquée.

Chaque aspect porte son radical et un statut **attesté / à valider**. Une règle
morphologique notable est implémentée : le préfixe de 3ᵉ pers. masc. `i-` se
consonantise en `y-` devant voyelle (`əgməy` → `yəgməy`), sans quoi la marque
d'accord disparaîtrait et la forme serait confondue avec le radical nu.

### Atlas linguistique (§15)

Carte **SVG inline**, sans fond de carte ni tuiles externes : elle fonctionne hors-ligne
et en bas débit (§26), et n'introduit aucune dépendance à un fournisseur. Les polygones
sont stockés en GeoJSON sur `Area.geojson`.

⚠️ **Les zones sont indicatives.** Le tamasheq est un continuum : ce ne sont ni des
isoglosses attestées ni des limites territoriales. Les isoglosses réelles devront venir
d'enquêtes de terrain géolocalisées.

### Encyclopédie (§9)

Fiches culturelles classées par catégorie, reliées au lexique et à la bibliothèque.

Le garde-fou éthique du dossier est **implémenté, pas seulement documenté** : chaque fiche
porte un régime d'accès. Une fiche `restricted` (droit coutumier, généalogies, médecine)
**n'expose aucun corps de texte** — seulement un avis motivé. Conformément aux principes
CARE, ces savoirs ne se publient pas sans le consentement de leurs détenteurs.

### Bibliothèque (§16)

Catalogue de références avec métadonnées, régime de droits (`open` / `restricted` /
`unknown`) et liens croisés vers les fiches encyclopédiques. Un document sous droits
n'affiche aucun lien de consultation.

⚠️ **Aucune visionneuse IIIF n'est branchée.** Le champ `iiifManifest` existe, mais la
plateforme ne dispose ni de documents numérisés ni de serveur d'images : le catalogue
**décrit** des références, il ne les héberge pas. Afficher un faux lecteur serait mentir
sur ce que le système sait faire.

### Apprentissage (§17)

Répétition espacée sur le modèle **SM-2**. Chaque entrée ajoutée au paquet génère deux
cartes — **reconnaissance** (tamasheq → langue) et **production** (langue → tamasheq).
Quatre notes replanifient la carte, avec l'échéance affichée sur chaque bouton.

⚠️ **Écart assumé au dossier** : celui-ci évoquait « un algorithme type FSRS ». FSRS suppose
un modèle ajusté sur un historique de révisions réel ; sans ces données, une implémentation
approximative serait moins fiable qu'un SM-2 correctement appliqué. Le passage à FSRS
reste possible une fois un historique constitué.

### Prononciation multi-locuteurs (§11)

Plusieurs enregistrements par entrée, chacun attribué à un locuteur et à une aire, avec
IPA, licence et contexte. Les contributeurs peuvent en proposer via `/contribuer?kind=audio`.

**Garde-fou de consentement** : un enregistrement dont le locuteur n'a pas donné son
consentement explicite n'est jamais servi. Le filtre est appliqué dans
[`src/lib/audio.ts`](src/lib/audio.ts), **au niveau de l'accès aux données** et non dans le
composant — de sorte qu'aucune vue future ne puisse le contourner par oubli, et que les
enregistrements retenus n'apparaissent même pas dans la charge sérialisée envoyée au client.
La case de consentement est obligatoire à la soumission.

⚠️ **Aucun enregistrement n'est livré.** La collecte auprès de locuteurs reste à faire, et
la plateforme **ne synthétise pas** de prononciation : présenter une voix générée comme
référence d'une langue menacée serait nuisible.

### Authentification (§25)

Le câblage **Auth.js (NextAuth v5)** est complet et **attend uniquement des identifiants** ;
il est conçu pour ne rien casser tant qu'ils sont absents.

- **Aucune variable renseignée → mode prototype** : identité pseudonyme sans mot de passe,
  clairement signalée comme n'authentifiant personne. Vérifié : les 11 routes répondent
  200 et `/api/auth/*` renvoie un `503 auth_not_configured` lisible plutôt qu'un plantage.
- **`AUTH_SECRET` + les identifiants d'un fournisseur (GitHub et/ou Google) →
  authentification réelle** : l'écran de compte bascule automatiquement en boutons OAuth,
  la voie pseudonyme se **ferme** (pas de porte dérobée coexistante), et le rôle valideur
  est accordé selon `AWAL_MODERATOR_EMAILS` — une **liste d'adresses vérifiées**, réévaluée
  à chaque connexion, qui remplace le code de modération partagé du prototype.

Activation, sans qu'aucun secret n'entre dans le dépôt (`.env*` est ignoré) :

```bash
# 1) openssl rand -base64 32   → AUTH_SECRET
# 2) créer une app OAuth chez le fournisseur ; callback :
#    http://localhost:3000/api/auth/callback/github
# 3) renseigner AUTH_GITHUB_ID / AUTH_GITHUB_SECRET (et/ou Google) dans .env.local
# 4) AWAL_MODERATOR_EMAILS=vous@exemple.org
```

Le point d'intégration est `getCurrentUser()` (`src/lib/session.ts`) : il préfère la
session Auth.js dès qu'un fournisseur est configuré, et ne retombe sur le cookie
prototype que sinon. Tout le reste (contribution, modération, cartes) en dépend déjà.

### Identifiants stables et citables (§8)

Les URL de fiches reposaient sur l'identifiant technique (`cuid`), **régénéré à chaque
ré-amorçage** : toute adresse citée devenait caduque. Un ouvrage de référence ne peut pas
se permettre des liens qui pourrissent.

Chaque entrée porte désormais un **slug déterministe** dérivé de la forme vedette
(`eɣlan` → `/mot/eghlan`, `aḍu` → `/mot/adu`, `ⴰⵎⴰⵏ` → `/mot/aman`). Le `cuid` reste la clé
technique interne, jamais exposée. Les anciens liens par identifiant continuent de
fonctionner en repli, pour ne rien casser.

Vérifié : après un `npm run setup` complet, les 11 slugs sont **identiques** et
`/mot/aman` répond toujours, alors que le `cuid` correspondant a changé.

### API publique v1 & Linked Data (§22)

Versionnée sous `/api/v1`, en **lecture publique** (CORS ouvert, cache court), avec
pagination. Les identifiants sont les **slugs stables** (§8). Portail : `/api-doc`.

| Point d'accès | Rôle |
|---|---|
| `GET /api/v1/lexemes?q=&limit=&offset=` | liste paginée ou recherche (moteur à 3 niveaux) |
| `GET /api/v1/lexemes/{slug}` | une entrée (JSON) |
| `GET /api/v1/lexemes/{slug}?format=jsonld` | une entrée en **Ontolex-Lemon** |
| `GET /api/v1/lexicon.jsonld` | tout le lexique en **Linked Data** (dataset) |
| `GET /api/v1/areas` | aires dialectales + géométrie indicative |
| `GET /api/v1/openapi.json` | spécification **OpenAPI 3.1** |

L'ancienne route `/api/lexemes` redirige (307) vers `/api/v1/lexemes`.

**Linked Data** : les exports JSON-LD sont alignés sur **Ontolex-Lemon** (lexiques),
**LexInfo** (catégories grammaticales), **SKOS** et **Dublin Core**. Ce n'est pas du JSON
qui « ressemble » à du RDF : validé en l'expansant avec un vrai processeur JSON-LD, une
entrée produit **33 triplets** et le lexique complet **275**, avec des prédicats résolus
vers les IRI canoniques de ces vocabulaires. Le tamasheq est étiqueté `tmh` (ISO 639-3),
sa graphie tifinagh `tmh-Tfng`. Licence **CC BY-SA 4.0**, citation par slug.

### Quiz & jeux (§17)

Page publique `/jouer` (aucune connexion requise) : un quiz éclair à choix multiples
généré depuis le lexique, avec trois types de questions — **sens** (tamasheq → glose),
**mot** (glose → tamasheq) et **lecture** (tifinagh → latin). Retour immédiat (bonne
réponse surlignée), score de session, et rejeu qui régénère de nouvelles questions.

Le générateur ([`src/lib/quiz.ts`](src/lib/quiz.ts)) est une fonction pure et testée
(4 options distinctes dont une correcte, variété des types, quiz vide si < 4 entrées).
Le composant est interactif côté client — aucun aller-retour serveur par réponse, aucun
état persisté (pas de faux classement).

### Tests & qualité (§28)

Suite de tests unitaires (**Vitest**) sur les moteurs purs — c'est là que vivent les
règles subtiles et les bugs déjà corrigés :

```bash
npm test          # exécution unique
npm run test:watch
```

**35 tests / 6 fichiers**, couvrant : l'ordonnancement SRS (progression 1→6→15 j, plancher
d'ease, réinitialisation), la clé phonétique (`amghar≡amgar`, `awal≡aoual≡ⴰⵡⴰⵍ`), le
conjugueur (**la règle `i-→y-` de régression**, aspects non documentés jamais inventés), les
slugs stables (déterminisme, désambiguïsation), la projection de l'atlas et le GeoJSON, et
le Linked Data (structure Ontolex, forme tifinagh `tmh-Tfng`, gloses multilingues).

Une **CI GitHub Actions** (`.github/workflows/ci.yml`) lance à chaque push et PR :
`prisma generate` → typecheck (`tsc --noEmit`) → tests. C'est la porte de qualité du §28.

## Modèle de données

Voir [`prisma/schema.prisma`](prisma/schema.prisma) : `Lexeme`, `Sense`, `Example`, `Root`,
`Variant`, `Area`, `Media`, `Speaker`, `Source`, `VerbStem`, `Article`, `Document`,
`User`, `Card`, `Contribution`, `Revision`, plus les modèles Auth.js
(`Account`, `Session`, `VerificationToken`) — aligné sur §21.

## ⚠️ Limites assumées à ce stade

- **Contenu lexical d'exemple**, à valider par des locuteurs et un comité scientifique.
- **Radicaux verbaux non attestés** : les radicaux fournis sont des propositions issues de
  la littérature, tous marqués « à valider ». Les affixes d'accord eux-mêmes sont une
  normalisation simplifiée (2sg `-ăd`/`-ăt`, voyelle d'appui `ă`/`ə`) qui varie selon l'aire.
- **Géométrie de l'atlas approximative**, tracée à la main à titre pédagogique.
- **Fiches encyclopédiques de démonstration** : rédigées à un niveau général et factuel,
  elles n'ont pas été relues par un comité scientifique.
- **Métadonnées bibliographiques à vérifier** : les notices renvoient à des ouvrages réels
  mais leurs détails (édition, pagination) doivent être confirmés sur les exemplaires.
- **Authentification réelle câblée mais pas activée** : il faut renseigner `AUTH_SECRET`
  et les identifiants d'un fournisseur OAuth pour sortir du mode prototype. C'est le
  dernier prérequis avant une mise en ligne publique — et il ne dépend plus que de la
  fourniture d'identifiants, pas de développement.
- **Recherche en mémoire** pour les niveaux 2-3 : correct à cette échelle, à migrer vers
  OpenSearch + `pg_trgm` (§13, §26).
- « Awal » est un **nom de travail**, à valider avec les institutions partenaires.

## Suite

Collecte d'enregistrements auprès de locuteurs, visionneuse IIIF (une fois des documents
numérisés disponibles), quiz et jeux, API publique v1 et exports Linked Data.
