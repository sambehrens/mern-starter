const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');

const keys = require('../config/keys');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwtKey,
};

module.exports = (passport) => {
  // See http://www.passportjs.org/packages/passport-jwt/ for more info
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.userId, (_err, user) => {
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      });
    })
  );
};
