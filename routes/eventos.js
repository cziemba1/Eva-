const express = require("express");
const router = express.Router();
const Evento = require("../models/eventos");
const middleware = require("../middleware");

//INDEX - lista de eventos
router.get("/", function (req, res) {
  var perPage = 8;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Evento.find({ name: regex })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, todosEventos) {
        Evento.count({ name: regex }).exec(function (err, count) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            if (todosEventos.length < 1) {
              noMatch =
                "No existen eventos con ese nombre. Por favor, intente de nuevo.";
            }
            res.render("eventos/index", {
              eventos: todosEventos,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search,
            });
          }
        });
      });
  } else {
    // get all campgrounds from DB
    Evento.find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, todosEventos) {
        Evento.count().exec(function (err, count) {
          if (err) {
            console.log(err);
          } else {
            res.render("eventos/index", {
              eventos: todosEventos,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false,
            });
          }
        });
      });
  }
});

//NEW - formulario para crear eventos
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("eventos/new");
});

//CREATE - Sube el nuevo evento a la db
router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const hora = req.body.hora;
  const price = req.body.price;
  const image = req.body.image;
  const location = req.body.location;
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
    price: price,
    location: location,
    hora: hora,
  };
  //crear eventos
  Evento.create(newEvento, (err, nuevoEven) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Evento creado exitosamente");
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
        res.render("eventos/show", { evento: foundEvento });
      }
    });
});

//EDIT : editar eventos (donde se crea el formulario)
router.get("/:id/edit", middleware.checkEventoPropiedad, (req, res) => {
  Evento.findById(req.params.id, (err, foundEvento) => {
    res.render("eventos/edit", { evento: foundEvento });
  });
});
//UPDATE: actualizar eventos (donde se sube el formulario)
router.put("/:id", middleware.checkEventoPropiedad, (req, res) => {
  Evento.findByIdAndUpdate(
    req.params.id,
    req.body.evento,
    (err, updatedEvento) => {
      if (err) {
        res.redirect("/eventos");
      } else {
        req.flash("success", "Se han actualizado los campos correctamente");
        res.redirect(`/eventos/${req.params.id}`);
      }
    }
  );
});

//DESTROY eliminar eventos
router.delete("/:id", middleware.checkEventoPropiedad, (req, res) => {
  Evento.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/eventos");
    } else {
      req.flash("success", "Se ha eliminado el evento correctamente");
      res.redirect("/eventos");
    }
  });
});

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
  Evento.findById(req.params.id, function (err, foundEvento) {
    if (err) {
      console.log(err);
      return res.redirect("/eventos");
    }

    // checkear si req.user._id existe en foundEvento.likes
    var foundUserLike = foundEvento.likes.some(function (like) {
      return like.equals(req.user._id);
    });

    if (foundUserLike) {
      // Si el usuario ya dio like, removerlo
      foundEvento.likes.pull(req.user._id);
    } else {
      // agregar nuevo like del usuario
      foundEvento.likes.push(req.user);
    }

    foundEvento.save(function (err) {
      if (err) {
        console.log(err);
        return res.redirect("/eventos");
      }
      return res.redirect("/eventos/" + foundEvento._id);
    });
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$!#\s]/g, "\\$&");
}

module.exports = router;
