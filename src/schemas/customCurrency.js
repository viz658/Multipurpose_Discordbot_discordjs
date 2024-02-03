const { Schema, model } = require("mongoose");

const currencySchema = new Schema({
  Guild: String,
  Currency: { type: String, default: "$" },
});

module.exports = model("Currency", currencySchema);
