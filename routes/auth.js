const express = require("express");
const ctrlAuth = require("../controllers/authController");
const ctrlEmail = require("../helpers/verifyEmail");
const auth = require("../middlewares/auth");
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
router.post("/logout", auth, ctrlWrapper(ctrlAuth.logout));
router.post("/refresh", ctrlWrapper(ctrlAuth.refreshToken));
router.get("/verify/:verificationToken", ctrlWrapper(ctrlEmail.verifyEmail));
router.get("/google");

module.exports = router;
