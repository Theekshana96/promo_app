const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  catName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
