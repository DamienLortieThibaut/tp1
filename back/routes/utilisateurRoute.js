const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateurController");

router.get("/getAll", utilisateurController.getAll);
router.post("/add", utilisateurController.register);
router.post("/login", utilisateurController.login);
router.delete("/delete/:id", utilisateurController.delete);
router.put("/update/:id", utilisateurController.update);

module.exports = router;
