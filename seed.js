const mongoose = require("mongoose");
const Evento = require("./models/eventos");

async function seedDb() {
  await Evento.remove({});
  await Comment.remove({});

  for (const seed of seeds) {
    let evento = await Evento.create(seed);
    let comment = await Evento.create({
      text: "Disfrute mucho de evento, ojala lo repitan!",
      author: "Juliana",
    });
    evento.comments.push(comment);
    evento.save();
  }
}
