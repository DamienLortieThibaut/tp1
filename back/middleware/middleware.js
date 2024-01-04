const db = require("../database/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getEmailFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    return decoded.email;
  } catch (error) {
    return null;
  }
};

exports.authenticator = (req, res, next) => {
  // Vérifier le token
  const token = req.params.token ? req.params.token : req.headers.authorization;
  // Décoder le token
  if (token && process.env.SECRETKEY) {
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ erreur: "Accès refusé" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ erreur: "Accès refusé" });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.query.token || req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Access refusé." });

  const email = getEmailFromToken(token);

  if (!email) {
    return res.status(401).json({ error: "Token invalide" });
  }

  try {
    const result = await db.query(
      "SELECT role from utilisateur where email = ?",
      email
      );

    if (result[0].role === 'administrateur') {
      next();
    } else {
      res.status(403).json({ erreur: "Accès refusé" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server " });
  }
};
  
exports.isReporterOrAdmin = async (req, res, next) => {
    const token = req.query.token || req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Access refusé." });
  
    const email = getEmailFromToken(token);
  
    if (!email) {
      return res.status(401).json({ error: "Token invalide" });
    }
  
    try {
      const result = await db.query(
        "SELECT role from utilisateur where email = ?",
        email
        );
      if (result[0].role === 'journaliste' || result[0].role === 'administrateur') {
        next();
      } else {
        res.status(403).json({ erreur: "Accès refusé" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server " });
    }
  };