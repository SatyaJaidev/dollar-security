const express = require("express");
const router = express.Router();
const { getVisitorCount } = require("../controllers/analyticsController");

router.get("/visitors", getVisitorCount);

module.exports = router;
