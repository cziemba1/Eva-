const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Evento = require("../models/eventos");

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
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
    email: req.body.email,
    info: req.body.info,
  });
  if (req.body.adminCode === "codigoSecreto123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("register");
    } else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", `Bienvenido a EvA ${user.username}`);
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
  req.flash("success", "Has abandonado la sesion");
  res.redirect("/eventos");
});

//User profile
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash("error", "Algo salio mal");
      res.redirect("/eventos");
    } else {
      Evento.find()
        .where("author.id")
        .equals(foundUser._id)
        .exec((err, eventos) => {
          if (err) {
            req.flash("error", "Algo salio mal");
            res.redirect("/eventos");
          } else {
            res.render("users/show", { user: foundUser, eventos: eventos });
          }
        });
    }
  });
});

module.exports = router;
