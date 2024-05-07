const { User } = require("../models/user");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const jwtStrategy = new JwtStrategy(options, async function (payload, done) {
  try {
    const user = await User.findOne({ _id: payload.id }).lean();
    if (!user) {
      return done(new Error("User not found."));
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(jwtStrategy);

module.exports = jwtStrategy;
