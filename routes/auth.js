// @swagger

const express = require("express");
const ctrlAuth = require("../controllers/authController");
const ctrlEmail = require("../helpers/verifyEmail");
const auth = require("../middlewares/auth");

const router = express.Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */ 
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.post("/logout", auth, ctrlAuth.logout);
router.post("/refresh", ctrlAuth.refreshToken);
router.get("/verify/:verificationToken", ctrlEmail.verifyEmail);
router.get("/google");

module.exports = router;
