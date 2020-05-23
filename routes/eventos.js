const express = require("express");
const router = express.Router();
const Evento = require("../models/eventos");

//INDEX - lista de eventos
router.get("/", (req, res) => {
  Evento.find((err, todosEventos) => {
    if (err) {
      console.log(err);
    } else {
      res.render("eventos/index", {
        eventos: todosEventos,
        currentUser: req.user,
      });
    }
  });
});

//NEW - formulario para crear eventos
router.get("/new", isLoggedIn, (req, res) => {
  res.render("eventos/new");
});

//CREATE - Sube el nuevo evento a la db
router.post("/", isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newEvento = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };
  //crear eventos
  Evento.create(newEvento, (err, nuevoEven) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("eventos");
    }
  });
});

//SHOW - me muestra mas info de un evento en particular
router.get("/:id", (req, res) => {
  Evento.findById(req.params.id)
    .populate("comments")
    .exec((err, foundEvento) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundEvento);
        res.render("eventos/show", { evento: foundEvento });
      }
    });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
