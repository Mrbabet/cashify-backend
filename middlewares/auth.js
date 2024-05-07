const passport = require("passport");

const authMiddleware = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    req.user = user;
    if (!user || err) {
      console.log(user, err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  })(req, res, next);
};

module.exports = authMiddleware;
