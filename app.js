const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Evento = require("./models/eventos");
const Comment = require("./models/comments");
const seedDB = require("./seed");

mongoose.connect("mongodb://localhost/eva");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
seedDB();
//agregar eventos
// Evento.create(
//   {
//     name: "Crypto 3.0 Cubrite de los riesgos!",
//     image:
//       "https://cdn.evbuc.com/eventlogos/167194251/clubcashflowargentina28229cnjbgcfgxopia.jpg",
//     description: "descubre todo el poder de las crypto monedas",
//   },
//   (err, evento) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Evento creado!");
//       console.log(evento);
//     }
//   }
// );

/*
INDEX  /eventos
NEW    /eventos/new
CREATE /eventos
SHOW   /eventos/:id

NEW    eventos/:id/comments/new
CREATE eventos/:id/comments
*/

//Main route
app.get("/", (req, res) => {
  res.render("landing");
});

//INDEX - lista de eventos
app.get("/eventos", (req, res) => {
  Evento.find((err, todosEventos) => {
    if (err) {
      console.log(err);
    } else {
      res.render("eventos/index", { eventos: todosEventos });
    }
  });
});

//NEW - formulario para crear eventos
app.get("/eventos/new", (req, res) => {
  res.render("eventos/new");
});

//CREATE - Sube el nuevo evento a la db
app.post("/eventos", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const newEvento = {
    name: name,
    image: image,
    description: desc,
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
app.get("/eventos/:id", (req, res) => {
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

//Comments
//NEW
app.get("/eventos/:id/comments/new", (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { evento: evento });
    }
  });
});

app.listen(3000, () => {
  console.log("server is running");
});

//CREATE
app.post("/eventos/:id/comments", (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
      res.redirect("/eventos");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          evento.comments.push(comment);
          evento.save();
          res.redirect(`/eventos/${evento._id}`);
        }
      });
    }
  });
});
