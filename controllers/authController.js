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
      password: newUser.password,
      avatarURL: newUser.avatarURL,
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

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.save();
    return res.status(200).send({
      accessToken,
      refreshToken,
      userData: {
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
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  user.accessToken = null;
  user.refreshToken = null;
  await user.save();

  res.status(201).json({ message: "Logout successful" });
};
const refreshToken = async (req, res, next) => {
  const refreshToken = req.headers.authorization;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  const splitToken = refreshToken.split(" ")[1];
  jwt.verify(
    splitToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const user = await User.findOne({ _id: decodedToken.id });
      if (!user) {
        return res.status(401).json({ message: "No such User" });
      }
      const payload = { id: user._id, email: user.email };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      const newRefreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );
      user.accessToken = accessToken;
      user.refreshToken = newRefreshToken;
      user.save();

      res.status(201).json({
        message: "Token refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
};
