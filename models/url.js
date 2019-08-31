const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
  _id: String,
  url: String
});

module.exports = mongoose.model("url", urlSchema);
