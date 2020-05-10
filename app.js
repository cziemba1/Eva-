const express = require("express");
const app = express();
const request = require("request");
const bodyparser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

const eventos = [
  {
    name: "Conferencia Alpha",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F95728009%2F424421217447%2F1%2Foriginal.20200306-181649?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C1280%2C640&s=9fdf54dcee69aa7e07478d8d378b65ad",
  },
  {
    name: "Crypto 3.0 Cubrite de los riesgos!",
    image:
      "https://cdn.evbuc.com/eventlogos/167194251/clubcashflowargentina28229cnjbgcfgxopia.jpg",
  },
  {
    name: "VI Festival de la Música Italiana de La Plata-Edición 2020",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F92359739%2F162029601953%2F1%2Foriginal.20200213-135803?h=150&w=300&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C71%2C368%2C184&s=070ab0ee640b966301fa1c72d500c82d",
  },
  {
    name: "Expo Vinos & Negocios 2020",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F97954848%2F168650103313%2F1%2Foriginal.20200403-154428?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=93%2C0%2C624%2C312&s=f12d9948740f7712e7c386851d4dcc9b",
  },
  {
    name: "Expor gourmet 2020",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F87948407%2F224906128103%2F1%2Foriginal.20200116-140940?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C1364%2C682&s=86c36b8ac56b16496e1bdc04c118faec",
  },
  {
    name: "K-style ¡Lo que más te gusta del KPOP en un solo lugar! ",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F84780717%2F312378508413%2F1%2Foriginal.20191217-025406?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=5c1e3cc70895f3ffec78038eb0f5e29c",
  },
  {
    name: "Feria Gamer! / Mega Evento Video Juegos!",
    image:
      "https://scontent-eze1-1.xx.fbcdn.net/v/t1.0-9/85158894_2796587863721430_4521634495694110720_n.png?_nc_cat=104&_nc_ohc=Lr1d6EyCgpAAX_PrTGp&_nc_ht=scontent-eze1-1.xx&oh=d54cebfe50863f560951ed1c6c93c316&oe=5F01604D",
  },
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/eventos", (req, res) => {
  res.render("eventos", { eventos: eventos });
});

app.post("/eventos", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newEvento = {
    name: name,
    image: image,
  };

  eventos.push(newEvento);
  res.redirect("eventos");
});

app.get("/eventos/new", (req, res) => {
  res.render("new");
});

app.listen(3000, () => {
  console.log("server is running");
});
