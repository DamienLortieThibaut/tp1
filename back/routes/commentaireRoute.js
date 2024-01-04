const express = require("express");
const router = express.Router();
const commentaireController = require("../controllers/commentaireController");
const middleware = require("../middleware/middleware");

router.post("/add", middleware.isReporterOrAdmin, commentaireController.add);
router.get(
  "/searchByAuthor/:nom",
  middleware.authenticator,
  commentaireController.searchByAuthor
);
router.get(
  "/searchByDate/:date",
  middleware.authenticator,
  commentaireController.searchByDate
);
router.get(
  "/searchByTechno/:techno",
  middleware.authenticator,
  commentaireController.searchByTechno
);

module.exports = router;
