const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../validation/userSchema");
const gravatar = require("gravatar");
const crypto = require("crypto");
const { sendVerification } = require("../helpers/sendVerificationEmail");
require("dotenv").config();

const register = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  const user = await User.findOne({ email: value.email });
  const avatarURL = gravatar.url(value.email);
  if (error) {
    return res.status(401).json({ message: error.message });
  }
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  try {
    const newUser = new User({
      email: value.email,
      avatarURL,
      verificationToken: crypto.randomBytes(64).toString("hex"),
    });
    await newUser.setPassword(value.password);
    await newUser.save();

    sendVerification(newUser);

    res.status(201).json({
      user: {
        email: newUser.email,
        password: newUser.password,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);

    const user = await User.findOne({ email: value.email });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
      return res.status(401).json({ message: "Not verificated" });
    }

    const isPasswordCorrect = await user.validatePassword(value.password);

    if (isPasswordCorrect) {
      const payload = {
        id: user._id,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20s",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      return res.json({ accessToken, refreshToken });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  const { id } = req.user;
  try {
    await User.findByIdAndUpdate(
      id,
      { accessToken: null, refreshToken: null },
      { new: true }
    );

    res.status(201).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const refreshToken = async (req, res, next) => {
  const refreshToken = req.headers.authorization;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
  }
  const splitToken = refreshToken.split(" ")[1];
  jwt.verify(splitToken, process.env.REFRESH_TOKEN_SECRET),
    async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const user = await User.findOne({ _id: decodedToken.id });
      if (!user) {
        return res.status(401).json({ message: "No such User" });
      }
      const payload = { id: user._id, email: user.email };

      const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "20s",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      return { accessToken, refreshToken };
    };
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
};
