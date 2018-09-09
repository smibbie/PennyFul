//Dependencies --------------------------------------------------------------
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

// Passport ------------------------------------------------------------------
// Telling passport we want to use a Local Strategy - login via username/email and password
passport.use(new LocalStrategy(
  // User will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  (email, password, done) => {
    // queries the database to match email with provided email
    db.User.findOne({
      where: {
        email: email
      }
    }).then((dbUser) => {
      // If there's no user with provided email
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the provided email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      return done(null, dbUser);
    });
  }
));

// Boilerplate passport functions to serialize and deserialize users
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


module.exports = passport;
