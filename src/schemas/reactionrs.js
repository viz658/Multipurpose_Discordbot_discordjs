const { Schema, model } = require("mongoose");

const reaction = new Schema({
  Guild: String,
  Message: String,
  Emoji: String,
  Role: String,
});

module.exports = model("rrs", reaction);
