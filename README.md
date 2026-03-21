# WorksVine-v1
(React + TypeScript + Vite + Tailwind + shadcnUI)

# 🍇 WorksVine

Application mobile de gestion de vignoble — carnet numérique pour suivre les travaux, traitements et documents de chaque année.

---

## Stack technique

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/UI**
- **Firebase** — Firestore (base de données) + Authentication
- **Cloudinary** — stockage des documents (photos, PDF)
- **React Router v7**
- **Lucide React** — icônes

---

## Fonctionnalités

### Gestion des années
- Créer et supprimer des années (millésimes)
- Recherche rapide par année
- Vue d'ensemble : nombre de travaux et traitements par année

### Travaux
7 types disponibles : Taille, Liage, Baisse des fils, Remonter les fils, Pré-palissage, Palissage, Vendanges

- Date de début et de fin
- Notes libres
- **Statut** : À faire / En cours / Terminé (changement en un clic)
- Pièces jointes (photos JPG/PNG, PDF)

### Traitements
3 types disponibles : Engrais, Chélate de fer, Désherbage

- Date du traitement
- Notes libres
- **Statut** : À faire / En cours / Terminé
- Pièces jointes

### Documents
- Upload vers Cloudinary (JPG, PNG, PDF)
- Ouverture dans un nouvel onglet
- Impression directe
- Suppression

### Statistiques par année
- Chiffres clés : total travaux, traitements, documents
- Avancement travaux et traitements (terminés / en cours / à faire)
- Barre de progression globale
- Répartition par type avec barres visuelles proportionnelles

### Authentification
- Connexion Google (OAuth)
- Connexion email / mot de passe
- Création de compte
- Données isolées par utilisateur — chaque compte ne voit que ses propres données

---

## Structure du projet

```
src/
├── components/
│   ├── DocumentManager.tsx   — upload et affichage des pièces jointes
│   ├── WorkCard.tsx          — carte travail avec statut
│   ├── TreatmentCard.tsx     — carte traitement avec statut
│   └── ProtectedRoute.tsx    — protection des routes authentifiées
├── pages/
│   ├── HomePage.tsx          — liste des années + recherche
│   ├── YearPage.tsx          — travaux, traitements, statistiques
│   └── LoginPage.tsx         — connexion Google et email
├── hooks/
│   ├── useAuth.ts            — gestion authentification Firebase
│   ├── useYears.ts           — CRUD années (filtré par userId)
│   ├── useYear.ts            — CRUD travaux et traitements
│   └── useUpload.ts          — upload Cloudinary
├── lib/
│   ├── firebase.ts           — initialisation Firebase
│   ├── cloudinary.ts         — configuration Cloudinary
│   ├── docUtils.ts           — formatDate, openDocument, printDocument
│   └── utils.ts              — utilitaire cn()
└── types/
    └── index.ts              — types TypeScript (Work, Treatment, Year…)
```

---

## Installation

```bash
# Cloner le projet
git clone https://github.com/ton-compte/WorksVine-v1.git
cd WorksVine-v1

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

---

## Configuration Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer **Firestore Database**
3. Activer **Authentication** → Google + Email/Mot de passe
4. Copier les clés dans `src/lib/firebase.ts`
5. Créer l'index composite Firestore : `userId ASC` + `year DESC`

**Règles Firestore :**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /years/{yearId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Configuration Cloudinary

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Créer un **upload preset** non signé
3. Renseigner dans `src/lib/cloudinary.ts` :

```ts
export const CLOUDINARY_CONFIG = {
  cloudName: "votre-cloud-name",
  uploadPreset: "votre-upload-preset",
};
```

---

## Déploiement Netlify

```bash
# Build de production
npm run build
```

Le fichier `netlify.toml` est déjà configuré :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Après déploiement, ajouter le domaine Netlify dans Firebase :
**Authentication → Settings → Authorized domains**

---

## Thème

**Minuit doré** — palette personnalisée :

| Variable | Valeur | Usage |
|---|---|---|
| `--deep` | `#10102a` | Fond principal |
| `--teal` | `#04656E` | Accent, boutons, bordures actives |
| `--cream` | `#EBEBA5` | Textes, titres, années |
| `--cream-light` | `#f5f5c8` | Hover, labels |

---

## Licence

Projet personnel — tous droits réservés.

