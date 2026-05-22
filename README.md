# Express Upload Demo - Multer

## Description
Ce projet est une application web développée avec Node.js, Express.js et Multer permettant le téléversement de fichiers/images.

Le projet permet :
- Upload simple d’une image
- Upload multiple d’images
- Upload avec métadonnées
- Validation des fichiers
- Limitation de taille
- Gestion des erreurs
- Stockage des images dans un dossier local

---

# Technologies utilisées

- Node.js
- Express.js
- Multer
- HTML5
- CSS3
- JavaScript

---

# Installation du projet

## 1. Cloner le projet

```bash
git clone https://github.com/USERNAME/express-upload-demo.git
```

## 2. Accéder au dossier

```bash
cd express-upload-demo
```

## 3. Installer les dépendances

```bash
npm install
```

---

# Lancer le projet

## Mode développement

```bash
npm run dev
```

## Mode normal

```bash
npm start
```

---

# Ouvrir dans le navigateur

```txt
http://localhost:3000
```

---

# Fonctionnalités

## Upload simple
- Téléversement d’une seule image
- Validation du type MIME
- Limitation de taille à 5 Mo

## Upload multiple
- Téléversement jusqu’à 3 images
- Prévisualisation des images

## Upload avec métadonnées
- Ajout d’un titre
- Ajout d’une description
- Image principale + galerie

## Sécurité
- Vérification des extensions
- Vérification des types MIME
- Nettoyage des fichiers en cas d’erreur

---

# Structure du projet

```txt
express-upload-demo/
│
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── uploads/
├── views/
│   └── index.html
│
├── server.js
├── package.json
└── README.md
```

---

# Dépendances installées

```bash
npm install express multer
npm install --save-dev nodemon
```

---



https://github.com/user-attachments/assets/6fbf1aa5-022c-467b-9b6c-ed09afba6710

