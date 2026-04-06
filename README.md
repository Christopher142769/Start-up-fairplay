# Fair Play — plateforme challenges étudiants

Stack : **Node.js (Express)**, **MongoDB (Mongoose)**, **React (Vite) + Tailwind**.

## Prérequis

- Node.js 20+
- MongoDB en local ou URI cloud (Atlas)

## Configuration

1. Copier l’exemple d’environnement et le remplir :

   ```bash
   cp server/.env.example server/.env
   ```

2. Définir au minimum `MONGODB_URI`, `JWT_SECRET` (16 caractères ou plus), les variables **SMTP_***, et pour créer l’admin : `ADMIN_EMAIL` + `ADMIN_PASSWORD`.

3. Initialiser les écoles et le compte admin :

   ```bash
   cd server && npm install && npm run seed
   ```

## Lancer en développement

Terminal 1 — API (port 4000) :

```bash
cd server && npm run dev
```

Terminal 2 — interface (port 5173, proxy `/api` → 4000) :

```bash
cd client && npm install && npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

## Fonctionnalités

- Inscription groupe (nom, école, mot de passe + confirmation, e-mail chef de groupe) : **JWT immédiat**, accès direct au tableau de bord.
- Connexion après déconnexion : mot de passe puis **code à 6 chiffres** par e-mail.
- **Mot de passe oublié** (groupes uniquement) : code par e-mail puis nouveau mot de passe.
- Admin : même logique 2FA ; **pas** de flux « mot de passe oublié » côté API.
- Dépôt de fichiers (PDF, Office, images, vidéos — **200 Mo max** par fichier).
- Admin : téléchargement **ZIP** `NomGroupe_Ecole.zip`, messagerie par groupe + e-mail de notification au chef de groupe.

Les fichiers uploadés sont stockés sous `server/uploads/` (non versionné).

## Hébergement sur Render

Render convient bien à ce dépôt : une **Web Service** pour l’API Node et un **Static Site** pour le front Vite. La base MongoDB peut être [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuit possible) ou toute instance accessible depuis Internet.

### Ordre recommandé

1. Créer la base MongoDB et récupérer l’URI (`MONGODB_URI`).
2. Déployer le **backend** sur Render, noter l’URL publique (ex. `https://fairplay-api.onrender.com`).
3. Déployer le **frontend** en définissant **`VITE_API_URL`** sur cette URL **avant** le build (sans slash final).
4. Mettre à jour le backend avec **`CLIENT_ORIGIN`** = URL exacte du Static Site (ex. `https://fairplay-web.onrender.com`), puis redéployer si besoin.

### Backend — Web Service

| Champ Render | Valeur |
|--------------|--------|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

**Variables d’environnement** (minimum) :

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Chaîne de connexion MongoDB (obligatoire). |
| `JWT_SECRET` | Secret long et aléatoire pour les JWT. |
| `CLIENT_ORIGIN` | URL du front déployé, schéma inclus, **sans** slash final (CORS). |
| `PORT` | Laisser Render l’injecter automatiquement en général. |

**E-mail (codes OTP, etc.)** : reprendre les variables du fichier `server/.env.example` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`).

**Premier admin / écoles** : en local ou via un shell Render (one-off), avec les mêmes variables que dans `.env.example` :

```bash
cd server && npm install && npm run seed
```

Les fichiers uploadés sont sur le disque du service (`server/uploads/`). Sur un plan gratuit Render, ce volume peut être **éphémère** : prévoir une sauvegarde ou un stockage objet (S3, etc.) pour une prod sérieuse.

### Frontend — Static Site

| Champ Render | Valeur |
|--------------|--------|
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Variable obligatoire au build** :

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL publique de l’API, **sans** slash final (ex. `https://fairplay-api.onrender.com`). |

Vite lit `VITE_API_URL` **au moment du build** : toute modification exige un **nouveau déploiement** du Static Site.

Copie locale des exemples :

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Vérifications rapides

- API : `GET https://ton-api.onrender.com/api/health` → `{ "ok": true }`.
- Front : connexion / inscription ; si erreurs réseau, vérifier `VITE_API_URL`, `CLIENT_ORIGIN` et que l’API est bien « live » sur Render.

## Production (général)

- Builder le client : `cd client && npm run build`.
- Servir `client/dist` derrière un reverse proxy ou héberger le front séparément.
- Définir `CLIENT_ORIGIN` sur l’URL du front pour CORS.
- Utiliser `VITE_API_URL` sur le client si l’API n’est pas sur le même domaine.
