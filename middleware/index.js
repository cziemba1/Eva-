//middleware directory
const Evento = require("../models/eventos");
const Comment = require("../models/comments");

const middlewareObj = {};

middlewareObj.checkEventoPropiedad = function (req, res, next) {
  if (req.isAuthenticated()) {
    Evento.findById(req.params.id, (err, foundEvento) => {
      if (err) {
        //problemas con la db
        req.flash("error", "Algo salio mal");
        res.redirect("back");
      } else {
        if (
          foundEvento.author.id.equals(req.user._id) ||
          foundEvento.user.isAdmin
        ) {
          next();
        } else {
          req.flash(
            "error",
            "No tienes los permisos adecuados para realizar esa accion"
          );
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Necesitas iniciar sesion antes de hacer eso");
    res.redirect("back");
  }
};

middlewareObj.checkCommentPropiedad = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        //problemas con la db
        req.flash("error", "Algo salio mal");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash(
            "error",
            "No tienes los permisos adecuados para realizar esa accion"
          );
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Necesitas iniciar sesion antes de hacer eso");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Necesitas iniciar sesion antes de hacer eso");
  res.redirect("/login");
};

module.exports = middlewareObj;
