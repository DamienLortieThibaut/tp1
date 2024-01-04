const express = require("express");
const app = express();
const cors = require("cors");

// Récupération des routes
const utilisateurRoute = require("./routes/utilisateurRoute");
const commentaireRoute = require("./routes/commentaireRoute");
const technologieRoute = require("./routes/technologieRoute");

// Middleware
app.use(express.json());
app.use(cors());

// Appel des routes
app.use("/user", utilisateurRoute);
app.use("/comment", commentaireRoute);
app.use("/technology", technologieRoute);

app.listen(8000, function () {
  console.log("Serveur ouvert sur le port 8000");
});
