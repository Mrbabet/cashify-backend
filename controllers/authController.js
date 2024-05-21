const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const crypto = require("crypto");
const { sendVerification } = require("../helpers/sendVerificationEmail");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const newUser = new User({
    email,
    avatarURL,
    verificationToken: crypto.randomBytes(64).toString("hex"),
  });
  await newUser.setPassword(password);
  await newUser.save();

  sendVerification(newUser);

  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!user.verify) {
    return res.status(401).json({ message: "Not verificated" });
  }

  const isPasswordCorrect = await user.validatePassword(password);

  if (isPasswordCorrect) {
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.save();
  
    return res.status(200).send({
      accessToken,
      refreshToken,
      user: {
        email,
        balance: user.balance,
        id: user._id,
      },
    });
  } else {
    return res.status(401).json({ message: "Wrong password" });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  // Check if there is no refresh token, then return 204 No Content
  if (!refreshToken) return res.sendStatus(204);

  try {
    // Find user based on refresh token
    const user = await User.findOne({ refreshToken });

    // If user not found, clear the cookie and return 401 Unauthorized
    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.status(401).json({ message: "Not authorized" });
    }

    // Reset user's access and refresh tokens
    user.accessToken = null;
    user.refreshToken = null;
    await user.save();

    // Clear JWT cookie and return 200 OK
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  login,
  register,
  logout,
};
