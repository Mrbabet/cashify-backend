const express = require("express");

const ctrlUser = require("../controllers/userController");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const router = express.Router();

router.patch("/balance", ctrlWrapper(ctrlUser.updateUserBalance));
router.get("/", ctrlWrapper(ctrlUser.getCurrent));

module.exports = router;
