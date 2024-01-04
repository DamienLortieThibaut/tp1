const db = require("../database/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Read du CRUD pour l'utilisateur
exports.getAll = async (req, res) => {
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
};

// Create du CRUD pour les utilisateurs
exports.register = async (req, res) => {
  // Vérifier l'email de l'utilisateur
  const { nom, prenom, email, password } = req.body;
  const result = await db.query(
    "SELECT * from utilisateur where email = ?",
    email
  );
  if (result.affectedRows > 0) {
    return res.status(400).json({ error: "Utilisateur déjà existant" });
  }
  if (!nom || !prenom || !email || !password)
    return res
      .status(400)
      .json({ error: "Il vous manque un champ lors de votre inscription" });
  // Utiliser bcrypt pour hasher le mdp
  const hashMDP = await bcrypt.hash(password, 10);
  // Envoyer les infos (email , mdp hasher) en bdd
  await db.query(`INSERT INTO utilisateur(nom, prenom, email, password) VALUES(?,?,?,?)`, [
    nom,
    prenom,
    email,
    hashMDP,
  ]);
  // Renvoie jwt token pour la signature
  const token = jwt.sign({ email }, process.env.SECRETKEY, { expiresIn: "1h" });
  res.json({ token });
};

// DELETE du CRUD pour les utilisateurs
exports.delete = async (req, res) => {
  try {
    // Récupération de l'id
    const id = parseInt(req.params.id);
    // Connexion à la base de données et suppression
    let connexion = await db.getConnection();
    const result = connexion.query(`DELETE from utilisateur WHERE id = ?`, id);
    // Gestion de la réponse par rapport à l'execution de la commande
    if (result.affectedRows > 0) {
      res.status(200).json("Utilisateur supprimé avec succès");
    } else {
      res.status(404).json("Utilisateur non trouvé");
    }
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la suppression de l'utilisateur : ", error);
    res.status(500).json("Erreur lors de la suppression de l'utilisateur");
  }
};

// UPDATE du CRUD d'un utilisateur
exports.update = async (req, res) => {
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
    if (result.affectedRows > 0) {
      res.status(200).json("Utilisateur mis à jour");
    } else {
      res.status(404).json("Utilisateur non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);
    res.status(500).json("Erreur lors de la mise à jour de l'utilisateur");
  }
};

exports.login = async (req, res) => {
  // Vérifier l'email de l'utilisateur => Récupérer le mdp
  const { email, password } = req.body;
  const result = await db.query(
    "SELECT * from utilisateur where email = ?",
    email
  );
  if (result.affectedRows == 0) {
    return res.status(400).json({ error: "Utilisateur non existant" });
  }

  const utilisateur = result[0];
  // Comparaison du mdp avec le mdp hasher en bdd avec bcrypt
  const SamePwd = await bcrypt.compare(password, utilisateur.password);

  if (!SamePwd) return res.status(401).json({ error: "mdp incorrect" });
  // Renvoie jwt token pour la signature
  const token = jwt.sign({ email }, process.env.SECRETKEY, { expiresIn: "1h" });
  res.json({ token });
};

exports.getAllName = async (req, res) => {
  try {
    // Connexion et récupération des données
    let connexion = await db.getConnection();
    const result = await connexion.query(`SELECT nom from utilisateur`);
    res.status(200).json(result);
  } catch (error) {
    // Message d'erreur en cas de probleme
    console.error("Erreur lors de la récupération des utilisateurs: ", error);
    res.status(500).json("Erreur lors de la récupération des utilisateurs");
  }
};