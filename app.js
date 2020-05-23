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
const methodOverride = require("method-override");
const commentRoutes = require("./routes/comments");
const eventosRoutes = require("./routes/eventos");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/eva");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

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

/*
INDEX  /eventos
NEW    /eventos/new
CREATE /eventos
SHOW   /eventos/:id

NEW    eventos/:id/comments/new
CREATE eventos/:id/comments
*/

app.use(indexRoutes);
app.use("/eventos/:id/comments", commentRoutes);
app.use("/eventos", eventosRoutes);

app.listen(3000, () => {
  console.log("server is running");
});
