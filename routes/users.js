const express = require("express");

const auth = require("../middlewares/auth");
const router = express.Router();

router.patch("user/balance", auth);
router.get("user", auth);

module.exports = router;
