const express = require("express");
const app = express();
const db = require("./database");
const bcrypt = require("bcrypt");

app.use(express.json());

// Read du CRUD pour l'utilisateur
app.get("/utilisateurs", async (req, res) => {
  try {
    // Connexion et récupération des données
    let connexion = await db.getConnection();
    const result = await connexion.query(`SELECT * from utilisateur`);
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des utilisateurs: ", error);
    res.status(500).json("Erreur lors de la récupération des utilisateurs");
  }
});

// Affichage des commentaires en fonction de la techno
app.get("/commentaire/techno/:techno", async (req, res) => {
  try {
    // Connexion et récupération des données en fonction du nom de la techno
    let connexion = await db.getConnection();
    const nom = req.params.techno;
    const result = await connexion.query(
      `SELECT c.*, t.nomtechno from commentaire c INNER JOIN technologie t ON c.idtechnologie=t.id WHERE t.nomtechno = ?`,
      nom
    );
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des commentaires : ", error);
    res.status(500).json("Erreur lors de la récupération des commentaires");
  }
});

// Affichage de tous les commentaires de l'auteur
app.get("/commentaire/nom/:nom", async (req, res) => {
  try {
    // Connexion et récupération des données en fonction du nom de l'auteur
    let connexion = await db.getConnection();
    const nom = req.params.nom;
    const result = await connexion.query(
      `SELECT c.*, u.nom FROM commentaire c INNER JOIN utilisateur u ON c.idutilisateur=u.id WHERE u.nom = ?`,
      nom
    );
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des commentaires: ", error);
    res.status(500).json("Erreur lors de la récupération des commentaires");
  }
});

// Affichage de tous les commentaires par rapport à une date antérieur
app.get("/commentaire/date/:date", async (req, res) => {
  try {
    // Connexion et récupération des données en fonction d'une date
    let connexion = await db.getConnection();
    const date = req.params.date;
    const result = await connexion.query(
      `SELECT * FROM commentaire WHERE date_creation_commentaire < ?`,
      date
    );
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des commentaires: ", error);
    res.status(500).json("Erreur lors de la récupération des commentaires");
  }
});

// Insérer un nouveau commentaire dans la base de données
app.post("/commentaire", async (req, res) => {
  // Check si tous les champs sont bien présent
  if (req.body.contenu && req.body.idtechnologie && req.body.idutilisateur) {
    try {
      // Connexion à la base de données
      let connexion = await db.getConnection();
      // Récupération de la date
      const datecreation = new Date();
      const dateFormat = datecreation
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      // Insertion dans la base de données
      await connexion.query(
        `INSERT INTO commentaire(date_creation_commentaire, contenu, idtechnologie, idutilisateur) VALUES ('${dateFormat}', '${req.body.contenu}', ${req.body.idtechnologie}, ${req.body.idutilisateur})`
      );
      res.status(200).json("Commentaire ajouté");
    } catch (error) {
      // Message d'erreur en cas de problème
      console.error(
        "Erreur lors de l'insertion dans la table commentaire : ",
        error
      );
      res
        .status(500)
        .json("Erreur lors de l'insertion dans la table commentaire");
    }
  } else {
    res
      .status(400)
      .json("Il vous manque un champ lors de l'insertion d'un commentaire");
  }
});

// Create du CREAD pour les utilisateurs
app.post("/utilisateur", async (req, res) => {
  // Check si tous les champs sont bien présent
  if (req.body.nom && req.body.prenom && req.body.email && req.body.mdp) {
    try {
      // Connexion à la base de données
      let connexion = await db.getConnection();
      // Génération d'un sel
      const sel = await bcrypt.genSalt(10);
      // Hash du mot de passe
      const hashMdp = await bcrypt.hash(req.body.mdp, sel);
      // Insertion dans la base de données
      await connexion.query(
        `INSERT INTO utilisateur(nom, prenom, email, mdp) VALUES ('${req.body.nom}', '${req.body.prenom}', '${req.body.email}', '${hashMdp}')`
      );
      res.status(200).json("Utilisateur ajouté");
    } catch (error) {
      // Message d'erreur en cas de problème
      console.error(
        "Erreur lors l'insertion dans la table utilisateur : ",
        error
      );
      res.status(500).json("Erreur lors l'insertion dans la table utilisateur");
    }
  } else {
    res
      .status(400)
      .json("Il vous manque un champ lors de l'insertion de l'utilisateur");
  }
});

// Delete du CRUD pour les utilisateurs
app.delete("/utilisateur/:id", async (req, res) => {
  try {
    // Récupération de l'id
    const id = parseInt(req.params.id);
    // Connexion à la base de données et suppression
    let connexion = await db.getConnection();
    const result = connexion.query(`DELETE from utilisateur WHERE id = ?`, id);
    // Gestion de la réponse par rapport à l'execution de la commande
    if (result) {
      res.status(200).json("Utilisateur supprimé avec succès");
    } else {
      res.status(404).json("Utilisateur non trouvé");
    }
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la suppression de l'utilisateur : ", error);
    res.status(500).json("Erreur lors de la suppression de l'utilisateur");
  }
});

// Mise à jour d'un utilisateur
app.put("/utilisateur/:id", async (req, res) => {
  try {
    // Récupération de l'id et des informations
    const id = parseInt(req.params.id);
    const { nom, prenom, email } = req.body;
    if (!nom || !prenom || !email)
      return res.status(400).json("Données d'utilisateur incomplètes");
    let connexion = await db.getConnection();
    const result = await connexion.query(
      "UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?",
      [nom, prenom, email, id]
    );
    if (result) {
      res.status(200).json("Utilisateur mis à jour");
    } else {
      res.status(404).json("Utilisateur non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);
    res.status(500).json("Erreur lors de la mise à jour de l'utilisateur");
  }
});

app.listen(8000, function () {
  console.log("Serveur ouvert sur le port 8000");
});
