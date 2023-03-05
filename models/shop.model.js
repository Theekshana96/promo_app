const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  promotion: {
    type: [String],
  },
  description: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  lat: {
    type: Integer,
    required: true,
  },
  lng: {
    type: Integer,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
});

const Shop = mongoose.model("shop", shopSchema);

module.exports = Shop;
