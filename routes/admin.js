const express = require("express");

const adminController = require("../controllers/admin");

// create a Route instance
const router = express.Router();

router.get("/add-reading", adminController.getAddReading);

module.exports = router;
