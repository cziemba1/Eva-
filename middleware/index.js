//middleware directory
const Evento = require("../models/eventos");
const Comment = require("../models/comments");

const middlewareObj = {};

middlewareObj.checkEventoPropiedad = function (req, res, next) {
  if (req.isAuthenticated()) {
    Evento.findById(req.params.id, (err, foundEvento) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundEvento.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentPropiedad = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
