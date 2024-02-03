const { Schema, model } = require("mongoose");

const spamdetectSchema = new Schema({
  Guild: String,
  User: String,
  Count: Number,
  Time: Number,
});

module.exports = model("spamdetect", spamdetectSchema);
