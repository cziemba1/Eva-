const mongoose = require("mongoose");
const Evento = require("./models/eventos");
const Comment = require("./models/comments");

seeds = [
  {
    name: "Crypto 3.0 Cubrite de los riesgos!",
    image:
      "https://cdn.evbuc.com/eventlogos/167194251/clubcashflowargentina28229cnjbgcfgxopia.jpg",
    description: "Crypto monedas y poder",
  },
  {
    name: "TRAVESÍAS Argentinas",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F99242428%2F193970643009%2F1%2Foriginal.20200422-101401?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C20%2C1170%2C585&s=92b01c9eba17b6bf0f34275e1a1a0092",
    description:
      "Las mejores travesias argentinas de la mano de nuestros habitantes",
  },
  {
    name: "Las mujeres en la historia Argentina",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F99465234%2F338373391701%2F1%2Foriginal.20200424-213708?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C1166%2C583&s=02800bef215d42a78d58d475fa6717b2",
    description:
      "Un descubrimiento y homenaje a todas aquellas mujeres de Argentina",
  },
  {
    name: "Crypto 3.0 Cubrite de los riesgos!",
    image:
      "https://cdn.evbuc.com/eventlogos/167194251/clubcashflowargentina28229cnjbgcfgxopia.jpg",
    description: "Crypto monedas y poder",
  },
  {
    name: "TRAVESÍAS Argentinas",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F99242428%2F193970643009%2F1%2Foriginal.20200422-101401?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C20%2C1170%2C585&s=92b01c9eba17b6bf0f34275e1a1a0092",
    description:
      "Las mejores travesias argentinas de la mano de nuestros habitantes",
  },
];

async function seedDB() {
  await Comment.remove({});
  await Evento.remove({});

  for (const seed of seeds) {
    let evento = await Evento.create(seed);
    let comment = await Comment.create({
      text: "Disfrute mucho de evento, ojala lo repitan!",
      author: "Juliana",
    });
    evento.comments.push(comment);
    evento.save();
  }
}

module.exports = seedDB;
