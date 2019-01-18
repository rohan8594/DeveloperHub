const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = mongoose.model("users"); // or require("../models/User");
const jwtSecret = require("./keys").secretOrKey;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret;

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
