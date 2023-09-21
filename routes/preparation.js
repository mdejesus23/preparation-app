const express = require("express");

const preparationControllers = require("../controllers/preparation");
const isAuth = require("../routesProtector/is-auth");

const router = express.Router();

router.get("/", preparationControllers.getThemes);

router.get("/readings/:themeId", isAuth, preparationControllers.getReadings);

router.put(
  "/readings/vote/:themeId",
  isAuth,
  preparationControllers.voteReading
);

router.get(
  "/readings/consolidated/:themeId",
  isAuth,
  preparationControllers.getConsolidatedReadings
);

module.exports = router;
