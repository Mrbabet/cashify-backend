const express = require("express");

const auth = require("../middlewares/auth");
const ctrlUser = require("../controllers/userController");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const router = express.Router();

router.patch("/balance", auth);
router.get("/", auth, ctrlWrapper(ctrlUser.getCurrent));

module.exports = router;
