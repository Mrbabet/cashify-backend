const passport = require("passport");

const authMiddleware = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error(err || info);
      return res.status(401).json({ message: `Unauthorized :${info}` });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authMiddleware;
