const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Main route
router.get("/", (req, res) => {
  res.render("landing");
});

//Show register form
router.get("/register", (req, res) => {
  res.render("register");
});

//Handle signup
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/eventos");
      });
    }
  });
});

//LOGIN routes

//Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

//Handle Login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/eventos",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//Handle logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/eventos");
});

//Login middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
