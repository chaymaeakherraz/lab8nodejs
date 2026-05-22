const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + extension);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Seules les images JPG, JPEG, PNG, GIF et WEBP sont autorisées."),
      false
    );
  }
};

function cleanupFiles(files) {
  if (!files) return;

  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.unlink(file.path, () => {});
    });
  } else if (typeof files === "object" && !files.path) {
    Object.keys(files).forEach((key) => {
      files[key].forEach((file) => {
        fs.unlink(file.path, () => {});
      });
    });
  } else if (files.path) {
    fs.unlink(files.path, () => {});
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadMixed = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).fields([
  { name: "image", maxCount: 1 },
  { name: "galerie", maxCount: 2 }
]);

function handleUploadError(err, req, res, next) {
  cleanupFiles(req.file || req.files);

  let message = err.message;

  if (err.code === "LIMIT_FILE_SIZE") {
    message = "Le fichier est trop volumineux. Maximum autorisé: 5 Mo.";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    message = "Trop de fichiers ou nom de champ incorrect.";
  }

  res.status(400).send(`
    <h1>Erreur lors du téléversement</h1>
    <p>${message}</p>
    <a href="/">Retour à l'accueil</a>
  `);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post(
  "/upload",
  upload.single("fichier"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("Aucun fichier téléversé.");
    }

    res.send(`
      <h1>Image téléversée avec succès</h1>
      <p>Nom original: ${req.file.originalname}</p>
      <p>Taille: ${req.file.size} octets</p>
      <p>Type: ${req.file.mimetype}</p>
      <img src="/uploads/${req.file.filename}" style="max-width:400px;">
      <br><br>
      <a href="/">Retour</a>
    `);
  },
  handleUploadError
);

app.post(
  "/upload-multiple",
  upload.array("fichiers", 3),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("Aucun fichier téléversé.");
    }

    const images = req.files
      .map(
        (file) => `
        <li>
          <p>${file.originalname} - ${file.size} octets</p>
          <img src="/uploads/${file.filename}" style="max-width:300px;">
        </li>
      `
      )
      .join("");

    res.send(`
      <h1>Images téléversées avec succès</h1>
      <p>Nombre de fichiers: ${req.files.length}</p>
      <ul>${images}</ul>
      <a href="/">Retour</a>
    `);
  },
  handleUploadError
);

app.post(
  "/upload-with-data",
  uploadMixed,
  (req, res) => {
    if (!req.files || !req.files.image) {
      return res.status(400).send("Image principale obligatoire.");
    }

    const titre = req.body.titre || "Sans titre";
    const description = req.body.description || "Aucune description";
    const mainImage = req.files.image[0];
    const galerie = req.files.galerie || [];

    const galerieHtml = galerie
      .map(
        (file) => `
        <div style="margin:10px;">
          <img src="/uploads/${file.filename}" style="max-width:250px;">
          <p>${file.originalname}</p>
        </div>
      `
      )
      .join("");

    res.send(`
      <h1>${titre}</h1>
      <p>${description}</p>

      <h3>Image principale</h3>
      <img src="/uploads/${mainImage.filename}" style="max-width:400px;">

      <h3>Galerie</h3>
      <div style="display:flex; flex-wrap:wrap;">
        ${galerieHtml}
      </div>

      <br>
      <a href="/">Retour</a>
    `);
  },
  handleUploadError
);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});