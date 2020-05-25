const mongoose = require("mongoose");

//Schema Setup
const eventosSchema = new mongoose.Schema({
  name: String,
  hora: String,
  price: String,
  image: String,
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
    avatar: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Evento", eventosSchema);
