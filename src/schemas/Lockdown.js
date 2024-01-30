const { Schema, model } = require("mongoose");

const lockdown = new Schema({
  Guild: String,
});

module.exports = model("lockdown", lockdown);
