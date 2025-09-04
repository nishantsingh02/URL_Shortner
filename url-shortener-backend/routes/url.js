const express = require("express");
const { HandleGenrateNewShortUrl } = require("../controllers/url")
const { handleGetAnaylytics } = require("../controllers/url")
const router = express.Router();

router.post("/", HandleGenrateNewShortUrl);

router.get("/analytics/:shortId", handleGetAnaylytics )

module.exports = router;