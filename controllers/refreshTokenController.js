const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models/user");

const refreshToken = async (req, res, next) => {
  // Retrieve the refresh token from cookies
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    return res.sendStatus(401); // No refresh token found
  }

  // Verify the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }

      // Fetch user details from the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.sendStatus(404); // User not found
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.save();


      res.json({ accessToken, refreshToken });
    }
  );
};

module.exports = { refreshToken };
