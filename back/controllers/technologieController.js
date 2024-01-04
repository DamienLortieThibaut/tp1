const db = require("../database/database");
require("dotenv").config();

// Read du CRUD pour la technologie
exports.getAll = async (req, res) => {
  try {
    // Connexion et récupération des données
    let connexion = await db.getConnection();
    const result = await connexion.query(`SELECT * from technologie`);
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des technologies: ", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des technologies" });
  }
};

// Create du CRUD pour les technologies
exports.add = async (req, res) => {
  // Check si tous les champs sont bien présent
  if (req.body.nomtechno && req.body.datecreation && req.body.nomcreateur) {
    try {
      // Connexion à la base de données
      let connexion = await db.getConnection();
      // Insertion dans la base de données
      await connexion.query(
        `INSERT INTO technologie(nomtechno, datecreation, nomcreateur) VALUES ('${req.body.nomtechno}', '${req.body.datecreation}', '${req.body.nomcreateur}')`
      );
      res.status(200).json({ success: "Technologie ajouté" });
    } catch (error) {
      // Message d'erreur en cas de problème
      console.error(
        "Erreur lors l'insertion dans la table technologie : ",
        error
      );
      res
        .status(500)
        .json({ error: "Erreur lors l'insertion dans la table technologie" });
    }
  } else {
    res.status(400).json({
      error: "Il vous manque un champ lors de l'insertion de la technologie",
    });
  }
};

// DELETE du CRUD pour les utilisateurs
exports.delete = async (req, res) => {
  try {
    // Récupération de l'id
    const id = parseInt(req.params.id);
    // Connexion à la base de données et suppression
    let connexion = await db.getConnection();
    const result = await connexion.query(
      `DELETE from technologie WHERE id = ?`,
      id
    );
    // Gestion de la réponse par rapport à l'execution de la commande
    if (result.affectedRows > 0) {
      res.status(200).json({ success: "Technologie supprimé avec succès" });
    } else {
      res.status(404).json({ error: "Technologie non trouvé" });
    }
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la suppression de la technologie : ", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la technologie" });
  }
};

// UPDATE du CRUD d'un utilisateur
exports.update = async (req, res) => {
  try {
    // Récupération de l'id et des informations
    const id = parseInt(req.params.id);
    const { nomtechno, datecreation, nomcreateur } = req.body;
    if (!nomtechno || !datecreation || !nomcreateur)
      return res.status(400).json("Données d'utilisateur incomplètes");
    let connexion = await db.getConnection();
    const result = await connexion.query(
      "UPDATE technologie SET nomtechno = ?, datecreation = ?, nomcreateur = ? WHERE id = ?",
      [nomtechno, datecreation, nomcreateur, id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ success: "Technologie mise à jour" });
    } else {
      res.status(404).json({ error: "Technologie non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la technologie : ", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la technologie" });
  }
};