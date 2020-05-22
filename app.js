const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Evento = require("./models/eventos");
const Comment = require("./models/comments");
const seedDB = require("./seed");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect("mongodb://localhost/eva");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
seedDB();

//Passport Configuration
app.use(
  require("express-session")({
    secret: "Eva es la mejor app clon",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
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
      res.render("eventos/index", {
        eventos: todosEventos,
        currentUser: req.user,
      });
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
app.get("/eventos/:id/comments/new", isLoggedIn, (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { evento: evento });
    }
  });
});

//CREATE
app.post("/eventos/:id/comments", isLoggedIn, (req, res) => {
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

//Auth Routes

//Show register form
app.get("/register", (req, res) => {
  res.render("register");
});

//Handle signup
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login");
});

//Handle Login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/eventos",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//Handle logout
app.get("/logout", (req, res) => {
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

app.listen(3000, () => {
  console.log("server is running");
});
