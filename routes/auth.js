const express = require("express");
const ctrlAuth = require("../controllers/authController");
const ctrlToken = require('../controllers/refreshTokenController')
const ctrlEmail = require("../helpers/verifyEmail");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const validation = require("../middlewares/validation");
const { userSchema } = require("../validation/userSchema");

const router = express.Router();

router.post(
  "/register",
  validation(userSchema),
  ctrlWrapper(ctrlAuth.register)
);
router.post("/login", validation(userSchema), ctrlWrapper(ctrlAuth.login));
router.get("/refresh", ctrlWrapper(ctrlToken.refreshToken));
router.post("/logout", ctrlWrapper(ctrlAuth.logout));

router.get("/verify/:verificationToken", ctrlWrapper(ctrlEmail.verifyEmail));
router.get("/google");

module.exports = router;
