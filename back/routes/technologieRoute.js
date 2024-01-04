const express = require("express");
const router = express.Router();
const technologieController = require("../controllers/technologieController");
const middleware = require("../middleware/middleware");

router.get("/getAll", technologieController.getAll);
router.post(
  "/add",
  middleware.authenticator,
  middleware.isAdmin,
  technologieController.add
);
router.delete(
  "/delete/:id",
  middleware.authenticator,
  middleware.isAdmin,
  technologieController.delete
);
router.put(
  "/update/:id",
  middleware.authenticator,
  middleware.isAdmin,
  technologieController.update
);

module.exports = router;
