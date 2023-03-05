const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
  offer: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  types: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shop",
  },
});

const Promotion = mongoose.model("promotion", promoSchema);

module.exports = Promotion;
