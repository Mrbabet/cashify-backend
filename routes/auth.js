const express = require("express");
const ctrlAuth = require("../controllers/authController");
const ctrlEmail = require("../helpers/verifyEmail");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.post("/logout", auth, ctrlAuth.logout);
router.post("/refresh", ctrlAuth.refreshToken);
router.get("/verify/:verificationToken", ctrlEmail.verifyEmail);
router.get("/google");

module.exports = router;
