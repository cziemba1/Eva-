const express = require("express");
const router = express.Router({ mergeParams: true });
const Evento = require("../models/eventos");
const Comment = require("../models/comments");

//NEW
router.get("/new", isLoggedIn, (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { evento: evento });
    }
  });
});

//CREATE
router.post("/", isLoggedIn, (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
      res.redirect("/eventos");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          evento.comments.push(comment);
          evento.save();
          res.redirect(`/eventos/${evento._id}`);
        }
      });
    }
  });
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
