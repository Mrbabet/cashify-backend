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
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
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
  const refreshToken = req.cookies?.jwt; 

  if (!refreshToken) return res.sendStatus(204);


  if (!user) {
    res.clearCookie('jwt',{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.status(401).json({ message: "Not authorized" });
  }
  user.accessToken = null;
  user.refreshToken = null;
  await user.save();
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(201).json({ message: "Logout successful" });
};


module.exports = {
  login,
  register,
  logout,
};
