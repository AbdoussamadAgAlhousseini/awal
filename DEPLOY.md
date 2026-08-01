# Mettre Awal en ligne (Vercel + Neon)

Ce guide met le site sur Internet, gratuitement, pour que de vraies personnes puissent
l'utiliser et contribuer. Deux comptes à créer (Neon, Vercel). Compte ~20 minutes.

> À la fin, l'app tourne sur une URL type `https://awal.vercel.app`, avec une vraie base
> PostgreSQL partagée. Le code est déjà prêt : il ne reste que des comptes et des valeurs
> à copier-coller.

---

## 1. La base de données — Neon (PostgreSQL)

1. Créer un compte sur **https://neon.tech** (gratuit) et un projet.
2. Dans le projet, ouvrir **Connection Details**. Copier deux chaînes :
   - la connexion **Pooled** → ce sera `DATABASE_URL`
   - la connexion **Direct** (bouton « Direct connection ») → ce sera `DIRECT_URL`
   - chacune ressemble à `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

## 2. Créer les tables et les données d'amorçage (une seule fois, depuis ta machine)

Dans le dossier du projet :

```bash
cp .env.example .env.local        # si pas déjà fait
# ouvrir .env.local et coller DATABASE_URL et DIRECT_URL (étape 1)
npm install
npm run setup                     # crée les tables dans Neon + amorce le contenu
```

`npm run setup` = `prisma db push` (structure) + le seed (39 entrées, 5 aires, etc.).
À partir de là, `npm run dev` en local travaille sur la **même** base que la production.

## 3. Mettre le code sur GitHub

Le dépôt est déjà là : **https://github.com/AbdoussamadAgAlhousseini/awal** (privé).
Rien à faire, sinon s'assurer que la branche `main` est à jour (`git push`).

## 4. L'hébergement — Vercel

1. Créer un compte sur **https://vercel.com** (se connecter avec GitHub).
2. **Add New → Project** → importer le dépôt `awal`.
3. Vercel détecte Next.js automatiquement. **Ne pas déployer tout de suite** :
   d'abord régler les variables d'environnement (**Settings → Environment Variables**) :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | la connexion **Pooled** de Neon |
   | `DIRECT_URL` | la connexion **Direct** de Neon |
   | `AUTH_SECRET` | résultat de `openssl rand -base64 32` |
   | `AUTH_URL` | l'URL Vercel, ex. `https://awal.vercel.app` |
   | `AWAL_MODERATOR_EMAILS` | ton adresse (pour être valideur) |

4. **Deploy.** Au bout d'une minute, le site est en ligne.

## 5. Activer la connexion des contributeurs (OAuth)

Tant qu'aucun fournisseur n'est configuré, le site tourne en **mode prototype**
(pseudonyme, non sécurisé — à ne pas laisser en public). Pour une vraie connexion :

**Avec GitHub** (le plus rapide) :
1. https://github.com/settings/developers → **New OAuth App**
2. *Homepage* : ton URL Vercel. *Authorization callback URL* :
   `https://<ton-app>.vercel.app/api/auth/callback/github`
3. Copier le **Client ID** et générer un **Client Secret**.
4. Dans Vercel, ajouter `AUTH_GITHUB_ID` et `AUTH_GITHUB_SECRET`, puis **redéployer**.

L'écran **Compte** bascule alors automatiquement sur « Se connecter avec GitHub », et la
voie pseudonyme se ferme. Les adresses listées dans `AWAL_MODERATOR_EMAILS` deviennent
valideurs à la connexion.

*(Google fonctionne pareil via `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` et l'URL de rappel
`.../api/auth/callback/google`.)*

## 6. Nom de domaine (optionnel)

Dans Vercel **Settings → Domains**, ajouter `awal.org` (ou autre) et suivre les
instructions DNS. Penser à mettre à jour `AUTH_URL` en conséquence.

---

## Notes

- **Secrets** : ils vivent uniquement dans `.env.local` (ignoré par git) et dans Vercel.
  Rien de sensible n'entre dans le dépôt.
- **Mises à jour** : chaque `git push` sur `main` redéploie automatiquement (et la CI
  GitHub vérifie types + tests avant).
- **Évolutions du schéma** : après avoir modifié `prisma/schema.prisma`, relancer
  `npm run db:push` (avec `.env.local` pointant sur Neon) pour appliquer à la base.
- **Coût** : les offres gratuites de Neon et Vercel suffisent pour démarrer ; la
  facturation n'intervient qu'à fort trafic.
