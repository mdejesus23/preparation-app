const express = require("express");

const preparationControllers = require("../controllers/preparation");
const isAuth = require("../routesProtector/is-auth");

const router = express.Router();

router.get("/", preparationControllers.getThemes);

router.get("/readings/:themeId", isAuth, preparationControllers.getReadings);

router.post(
  "/readings/vote/:readingId",
  isAuth,
  preparationControllers.postVote
);

module.exports = router;
