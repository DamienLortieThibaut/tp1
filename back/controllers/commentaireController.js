const db = require("../database/database");
require("dotenv").config();

// Insérer un nouveau commentaire dans la base de données
exports.add = async (req, res) => {
  // Check si tous les champs sont bien présent
  if (req.body.message && req.body.idtechnologie && req.body.idutilisateur) {
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
        `INSERT INTO commentaire(date_creation_commentaire, message, idtechnologie, idutilisateur) VALUES ('${dateFormat}', '${req.body.message}', ${req.body.idtechnologie}, ${req.body.idutilisateur})`
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
};

// Affichage de tous les commentaires par rapport à une date antérieur
exports.searchByDate = async (req, res) => {
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
};

// Affichage de tous les commentaires de l'auteur
exports.searchByAuthor = async (req, res) => {
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
};

// Affichage des commentaires en fonction de la techno
exports.searchByTechno = async (req, res) => {
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
};