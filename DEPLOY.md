# Mettre Awal en ligne (comme AKAL : Vercel + Supabase)

Même montage que **akal-indigenous.org** : hébergement **Vercel**, base **Supabase**
(PostgreSQL), dépôt **public**, déploiement en ligne de commande.

> Awal utilise Prisma ; il se connecte à la base Supabase par sa chaîne de connexion —
> rien à changer au code. Il faut une **base Supabase distincte** de celle d'AKAL.

---

## 1. La base — Supabase (PostgreSQL)

1. Sur **https://supabase.com**, créer un **nouveau projet** (ex. `awal`) et noter le mot
   de passe de la base.
2. **Project Settings → Database → Connection string** → onglet **URI**. Deux chaînes :
   - **Transaction pooler** (port `6543`) → `DATABASE_URL`
     (ajouter `?pgbouncer=true&connection_limit=1` à la fin)
   - **Session / Direct** (port `5432`) → `DIRECT_URL`

## 2. Créer les tables + le contenu (une fois, depuis ta machine)

```bash
cp .env.example .env.local        # si pas déjà fait
# coller DATABASE_URL et DIRECT_URL (étape 1) dans .env.local
npm install
npm run setup                     # crée les tables dans Supabase + amorce le contenu
```

`npm run setup` = `prisma db push` (structure) + le seed (39 entrées, 5 aires…).
Ensuite `npm run dev` en local travaille sur la **même** base que la production.

## 3. Dépôt public

Vercel (offre Hobby) **refuse de déployer un dépôt privé** dès qu'un commit porte un
en-tête `Co-Authored-By` — c'est le cas ici. Comme pour AKAL, le dépôt doit donc être
**public** :

```bash
gh repo edit AbdoussamadAgAlhousseini/awal --visibility public
```

*(Le code devient visible de tous. Les secrets ne sont pas dans le dépôt : ils restent
dans `.env.local`, ignoré par git, et dans Vercel.)*

## 4. L'hébergement — Vercel (comme AKAL, en CLI)

Depuis le dossier du projet, lié au compte déjà connecté :

```bash
npx vercel@latest link --yes --scope akal1        # crée/associe le projet "awal"
npx vercel@latest --prod --yes --scope akal1       # premier déploiement
```

Puis régler les variables d'environnement (dans le tableau de bord Vercel du projet
`awal` → **Settings → Environment Variables**, ou en CLI `vercel env add … production`) :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Supabase **Transaction pooler** (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **Direct** (port 5432) |
| `AUTH_SECRET` | résultat de `openssl rand -base64 32` |
| `AUTH_URL` | l'URL Vercel, ex. `https://awal.vercel.app` |
| `AWAL_MODERATOR_EMAILS` | ton adresse (pour être valideur) |

Redéployer après avoir posé les variables : `npx vercel@latest --prod --yes --scope akal1`.

## 5. Connexion des contributeurs (OAuth)

Tant qu'aucun fournisseur n'est configuré → **mode prototype** (à ne pas laisser en
public). Pour une vraie connexion, **GitHub** (le plus rapide) :

1. https://github.com/settings/developers → **New OAuth App**
2. *Callback URL* : `https://<ton-app>.vercel.app/api/auth/callback/github`
3. Ajouter `AUTH_GITHUB_ID` et `AUTH_GITHUB_SECRET` dans Vercel, puis redéployer.

L'écran **Compte** bascule alors sur « Se connecter avec GitHub ». Les adresses de
`AWAL_MODERATOR_EMAILS` deviennent valideurs à la connexion.

## 6. Nom de domaine (optionnel, comme akal-indigenous.org)

`vercel domains add <domaine> awal --scope akal1`, suivre le DNS, puis mettre `AUTH_URL`
à jour.

---

## Notes

- **Secrets** : uniquement dans `.env.local` (ignoré par git) et Vercel. Rien dans le dépôt.
- **Mises à jour** : chaque `git push` sur `main` redéploie (la CI vérifie types + tests avant).
- **Vérifier** contre l'URL stable `awal.vercel.app` (les URLs `awal-<hash>-akal1.vercel.app`
  peuvent être derrière l'authentification Vercel).
- **Évolutions du schéma** : après modif de `prisma/schema.prisma`, relancer `npm run db:push`
  (avec `.env.local` sur Supabase).
