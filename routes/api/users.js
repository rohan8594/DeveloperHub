const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../../models/User");
const jwtSecret = require("../../config/keys").secretOrKey;

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      const newUser = new User({ name, email, password, avatar });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(payload, jwtSecret, { expiresIn: 86400 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route   GET api/users/test
// @desc    Tests users route; returns current user
// @access  Private
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
